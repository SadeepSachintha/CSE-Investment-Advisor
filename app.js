/**
 * app.js
 * Central controller for the CSE Investment Advisor SPA.
 * Manages virtual portfolios, local storage, routing, Chart.js renderings, and UI actions.
 */

// Global State Object
const APP_STATE = {
  portfolio: {
    cash: 1000000.00, // LKR 1 Million Virtual Capital
    holdings: []
  },
  chatHistory: [],
  activeView: 'dashboard',
  selectedStockSymbol: 'JKH.N0000',
  currentChartInstance: null,
  portfolioChartInstance: null
};

// Initialize application on DOM content load
document.addEventListener('DOMContentLoaded', () => {
  initLocalStorage();
  setupRouting();
  setupMarketTimer();
  renderDashboard();
  renderExplorer();
  renderPortfolio();
  renderAdvisorChat();
  renderCalculator();
  setupEventListeners();
  
  // Initialize Lucide Icons for initial HTML
  lucide.createIcons();
});

// 1. Local Storage State Management
function initLocalStorage() {
  // Load Portfolio
  const savedPortfolio = localStorage.getItem('cse_advisor_portfolio');
  if (savedPortfolio) {
    APP_STATE.portfolio = JSON.parse(savedPortfolio);
  } else {
    // Save initial state
    localStorage.setItem('cse_advisor_portfolio', JSON.stringify(APP_STATE.portfolio));
  }

  // Load Chat History
  const savedChat = localStorage.getItem('cse_advisor_chat');
  if (savedChat) {
    APP_STATE.chatHistory = JSON.parse(savedChat);
  } else {
    // Initial welcome message
    APP_STATE.chatHistory = [
      {
        sender: 'advisor',
        text: `
          <div class="advisor-card">
            <h4>Ayubowan! 🙏 Welcome to CSE Investment Advisor</h4>
            <p class="text-accent text-small font-bold" style="margin-top: -0.25rem; margin-bottom: 0.75rem;">A Product of SS Labz</p>
            <p>I am <strong>Ariya</strong>, your digital investment assistant developed by <strong>SS Labz</strong>. I am pre-loaded with comprehensive metrics, financial histories, and transaction schedules for top equities listed on the Colombo Stock Exchange (CSE).</p>
            <p>You can begin by reviewing your virtual <strong>LKR 1,000,000</strong> portfolio, exploring listed companies, or executing screens to find high-yield dividend shares.</p>
            <p>What financial goal can I help you achieve today?</p>
            
            <div class="chat-options-group mt-3">
              <button class="chat-chip" onclick="sendAdvisorPrompt('Evaluate My Portfolio')"><i data-lucide="shield-check"></i> Evaluate Portfolio</button>
              <button class="chat-chip" onclick="sendAdvisorPrompt('Find Dividend Stars')"><i data-lucide="award"></i> High Dividend Screens</button>
              <button class="chat-chip" onclick="sendAdvisorPrompt('Value Investing Screen')"><i data-lucide="trending-down"></i> Value Screens</button>
              <button class="chat-chip" onclick="sendAdvisorPrompt('Market Outlook')"><i data-lucide="globe"></i> Market Outlook</button>
            </div>
          </div>
        `,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
    ];
    localStorage.setItem('cse_advisor_chat', JSON.stringify(APP_STATE.chatHistory));
  }
}

function savePortfolio() {
  localStorage.setItem('cse_advisor_portfolio', JSON.stringify(APP_STATE.portfolio));
  renderPortfolio(); // Reactive refresh
}

function saveChatHistory() {
  localStorage.setItem('cse_advisor_chat', JSON.stringify(APP_STATE.chatHistory));
}

// 2. SPA Navigation / Routing
function setupRouting() {
  const navItems = document.querySelectorAll('.nav-item');
  const panels = document.querySelectorAll('.view-panel');

  navItems.forEach(item => {
    const link = item.querySelector('a');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.getAttribute('data-view');
      
      // Update sidebar active class
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // Update panels active class
      panels.forEach(panel => {
        if (panel.id === `${targetView}-view`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });

      APP_STATE.activeView = targetView;
      
      // Hook custom initializers
      if (targetView === 'dashboard') {
        renderDashboard();
      } else if (targetView === 'explorer') {
        renderExplorer();
      } else if (targetView === 'portfolio') {
        renderPortfolio();
      } else if (targetView === 'chat') {
        renderAdvisorChat();
        scrollChatToBottom();
      } else if (targetView === 'calculator') {
        renderCalculator();
      }
      
      // Re-run icon renderer for any new elements
      lucide.createIcons();
    });
  });
}

// 3. Live Market Status & Time Updates
function setupMarketTimer() {
  const statusTimeEl = document.getElementById('market-time-label');
  const statusDotEl = document.getElementById('market-status-dot');
  const statusTextEl = document.getElementById('market-status-text');

  function updateStatus() {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeValue = hours * 100 + minutes;

    // Check Colombo Stock Exchange Market hours (09:30 AM to 02:30 PM, Monday-Friday)
    // 09:30 is 930, 14:30 is 1430
    const isWeekday = day >= 1 && day <= 5;
    const isTradingHours = timeValue >= 930 && timeValue <= 1430;

    if (isWeekday && isTradingHours) {
      statusDotEl.className = 'status-dot active';
      statusTextEl.innerText = 'Market Open';
      statusTextEl.className = 'status-label text-positive';

      // Countdown to close
      const closingTime = new Date(now);
      closingTime.setHours(14, 30, 0);
      const diffMs = closingTime - now;
      const diffHrs = Math.floor(diffMs / 3600000);
      const diffMins = Math.floor((diffMs % 3600000) / 60000);
      const diffSecs = Math.floor((diffMs % 60000) / 1000);
      statusTimeEl.innerText = `Closes in: ${diffHrs}h ${diffMins}m ${diffSecs}s`;
    } else {
      statusDotEl.className = 'status-dot closed';
      statusTextEl.innerText = 'Market Closed';
      statusTextEl.className = 'status-label text-negative';

      // Countdown to open next morning (or Monday)
      statusTimeEl.innerText = 'Next Trading: Mon-Fri 09:30 AM - 02:30 PM';
    }
  }

  updateStatus();
  setInterval(updateStatus, 1000);
}

// 4. Render Dashboard View
function renderDashboard() {
  // A. Indices Rendering
  const aspiVal = document.getElementById('aspi-value');
  const aspiChg = document.getElementById('aspi-change');
  const spVal = document.getElementById('sp-value');
  const spChg = document.getElementById('sp-change');

  aspiVal.innerText = CSE_DATA.indices.aspi.value.toLocaleString('en-US', { minimumFractionDigits: 2 });
  const aspiChgVal = CSE_DATA.indices.aspi.change;
  const aspiPct = CSE_DATA.indices.aspi.changePercent;
  aspiChg.innerHTML = `
    <span class="price-change ${aspiChgVal >= 0 ? 'positive' : 'negative'}">
      <i data-lucide="${aspiChgVal >= 0 ? 'trending-up' : 'trending-down'}"></i>
      ${aspiChgVal >= 0 ? '+' : ''}${aspiChgVal.toFixed(2)}
    </span>
    <span class="change-percent">${aspiPct.toFixed(2)}%</span>
  `;

  spVal.innerText = CSE_DATA.indices.spsl20.value.toLocaleString('en-US', { minimumFractionDigits: 2 });
  const spChgVal = CSE_DATA.indices.spsl20.change;
  const spPct = CSE_DATA.indices.spsl20.changePercent;
  spChg.innerHTML = `
    <span class="price-change ${spChgVal >= 0 ? 'positive' : 'negative'}">
      <i data-lucide="${spChgVal >= 0 ? 'trending-up' : 'trending-down'}"></i>
      ${spChgVal >= 0 ? '+' : ''}${spChgVal.toFixed(2)}
    </span>
    <span class="change-percent">${spPct.toFixed(2)}%</span>
  `;

  // B. Sparkline Visualizations
  renderSparkline('aspi-sparkline', CSE_DATA.indices.aspi.history, '#6366f1');
  renderSparkline('spsl20-sparkline', CSE_DATA.indices.spsl20.history, '#06b6d4');

  // C. Top gainers, losers, active lists
  const sortedStocks = [...CSE_DATA.stocks];
  
  // Gainers: Highest Change %
  const gainers = [...sortedStocks].sort((a, b) => b.change - a.change).slice(0, 4);
  const gainersBody = document.getElementById('gainers-list');
  gainersBody.innerHTML = '';
  gainers.forEach(s => {
    gainersBody.appendChild(createMarketRow(s));
  });

  // Losers: Lowest Change %
  const losers = [...sortedStocks].sort((a, b) => a.change - b.change).slice(0, 4);
  const losersBody = document.getElementById('losers-list');
  losersBody.innerHTML = '';
  losers.forEach(s => {
    losersBody.appendChild(createMarketRow(s));
  });

  // Most Active: High volume
  const active = [...sortedStocks].sort((a, b) => b.volume - a.volume).slice(0, 4);
  const activeBody = document.getElementById('active-list');
  activeBody.innerHTML = '';
  active.forEach(s => {
    activeBody.appendChild(createMarketRow(s));
  });

  // D. News feed rendering
  const newsContainer = document.getElementById('news-container');
  newsContainer.innerHTML = '';
  CSE_DATA.news.forEach(n => {
    const newsEl = document.createElement('div');
    newsEl.className = 'news-item';
    newsEl.innerHTML = `
      <div class="news-meta">
        <span class="news-source">${n.source}</span>
        <span class="news-time">${n.timestamp}</span>
      </div>
      <div class="news-title" onclick="${n.stock ? `viewStockDetails('${n.stock}')` : 'void(0)'}">${n.title}</div>
      <div class="news-snippet">${n.snippet}</div>
    `;
    newsContainer.appendChild(newsEl);
  });
}

function renderSparkline(canvasId, data, color) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  // Extract historical values
  const prices = data.map(d => d.price);
  const labels = data.map(d => d.date);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        data: prices,
        borderColor: color,
        borderWidth: 1.5,
        fill: false,
        pointRadius: 0,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  });
}

function createMarketRow(stock) {
  const row = document.createElement('tr');
  row.className = 'hover-row';
  row.onclick = () => viewStockDetails(stock.symbol);
  
  const chgVal = stock.change;
  const isPos = chgVal >= 0;

  row.innerHTML = `
    <td>
      <div class="stock-ticker-cell">
        <span class="ticker-sym">${stock.symbol.split('.')[0]}</span>
        <span class="ticker-name">${stock.name}</span>
      </div>
    </td>
    <td><strong>LKR ${stock.price.toFixed(2)}</strong></td>
    <td class="${isPos ? 'text-positive' : 'text-negative'}">
      <strong>${isPos ? '+' : ''}${chgVal.toFixed(2)}%</strong>
    </td>
  `;
  return row;
}

// 5. Render Stock Explorer View
function renderExplorer() {
  const searchVal = document.getElementById('explorer-search').value.toLowerCase();
  const sectorVal = document.getElementById('explorer-sector-filter').value;
  const sortVal = document.getElementById('explorer-sort-select').value;
  
  const body = document.getElementById('explorer-table-body');
  body.innerHTML = '';

  // Filter stocks
  let filtered = CSE_DATA.stocks.filter(s => {
    const symbolMatch = s.symbol.toLowerCase().includes(searchVal);
    const nameMatch = s.name.toLowerCase().includes(searchVal);
    const sectorMatch = sectorVal === 'all' || s.sector === sectorVal;
    
    return (symbolMatch || nameMatch) && sectorMatch;
  });

  // Sort stocks
  if (sortVal === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortVal === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortVal === 'change-desc') {
    filtered.sort((a, b) => b.change - a.change);
  } else if (sortVal === 'change-asc') {
    filtered.sort((a, b) => a.change - b.change);
  } else if (sortVal === 'pe-asc') {
    filtered.sort((a, b) => a.pe - b.pe);
  } else if (sortVal === 'div-desc') {
    filtered.sort((a, b) => b.divYield - a.divYield);
  } else if (sortVal === 'cap-desc') {
    filtered.sort((a, b) => b.marketCap - a.marketCap);
  }

  filtered.forEach(s => {
    const row = document.createElement('tr');
    row.onclick = () => viewStockDetails(s.symbol);
    
    const isPos = s.change >= 0;
    
    row.innerHTML = `
      <td>
        <div class="stock-ticker-cell">
          <span class="ticker-sym">${s.symbol.split('.')[0]}</span>
          <span class="ticker-name">${s.name}</span>
        </div>
      </td>
      <td><span class="text-accent">${s.sector}</span></td>
      <td><strong>LKR ${s.price.toFixed(2)}</strong></td>
      <td class="${isPos ? 'text-positive' : 'text-negative'}">
        <strong>${isPos ? '+' : ''}${s.change.toFixed(2)}%</strong>
      </td>
      <td>${s.pe.toFixed(1)}x</td>
      <td>${s.divYield.toFixed(1)}%</td>
      <td>LKR ${s.marketCap.toFixed(1)}B</td>
      <td>
        <button class="btn btn-secondary py-1 px-2 text-small" onclick="event.stopPropagation(); viewStockDetails('${s.symbol}')">
          View Detail
        </button>
      </td>
    `;
    body.appendChild(row);
  });
}

// 6. Detailed Stock Modal Visualizer & Chart
function viewStockDetails(symbol) {
  const stock = CSE_DATA.stocks.find(s => s.symbol === symbol);
  if (!stock) return;

  APP_STATE.selectedStockSymbol = symbol;

  // Header Details
  document.getElementById('modal-stock-ticker').innerText = stock.symbol;
  document.getElementById('modal-stock-name').innerText = stock.name;
  
  // Basic Stats
  const priceEl = document.getElementById('modal-stock-price');
  const chgEl = document.getElementById('modal-stock-change');
  priceEl.innerText = `LKR ${stock.price.toFixed(2)}`;
  
  const isPos = stock.change >= 0;
  chgEl.className = isPos ? 'text-positive' : 'text-negative';
  chgEl.innerHTML = `<strong>${isPos ? '+' : ''}${stock.change.toFixed(2)}%</strong>`;

  // Detailed Metrics
  document.getElementById('m-pe').innerText = `${stock.pe.toFixed(1)}x`;
  document.getElementById('m-yield').innerText = `${stock.divYield.toFixed(2)}%`;
  document.getElementById('m-eps').innerText = `LKR ${stock.eps.toFixed(2)}`;
  document.getElementById('m-bv').innerText = `LKR ${stock.bookValue.toFixed(2)}`;
  document.getElementById('m-beta').innerText = stock.beta.toFixed(2);
  document.getElementById('m-roe').innerText = `${stock.roe.toFixed(1)}%`;
  document.getElementById('m-cap').innerText = `LKR ${stock.marketCap.toFixed(1)} Billion`;
  document.getElementById('m-volume').innerText = stock.volume.toLocaleString();
  document.getElementById('m-sector').innerText = stock.sector;
  document.getElementById('m-description').innerText = stock.description;

  // Set trade fields
  document.getElementById('trade-stock-price').value = stock.price.toFixed(2);
  document.getElementById('trade-qty').value = 1000;
  
  // Recalculate trade totals inside modal
  calculateModalTradeTotals();

  // Show Modal Overlay
  const modal = document.getElementById('stock-detail-modal');
  modal.classList.add('active');

  // Render 30-Day Historical Price Chart
  renderModalStockChart(stock);
  
  // Re-run icons in modal
  lucide.createIcons();
}

function closeModal() {
  document.getElementById('stock-detail-modal').classList.remove('active');
}

function renderModalStockChart(stock) {
  if (APP_STATE.currentChartInstance) {
    APP_STATE.currentChartInstance.destroy();
  }

  const ctx = document.getElementById('modal-stock-chart').getContext('2d');
  
  const dates = stock.history.map(h => h.date);
  const prices = stock.history.map(h => h.price);

  // Gradient background for modern feel
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(99, 102, 241, 0.45)');
  gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

  APP_STATE.currentChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Closing Price (LKR)',
        data: prices,
        borderColor: '#6366f1',
        borderWidth: 2,
        backgroundColor: gradient,
        fill: true,
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#0b0f19',
        pointHoverRadius: 6,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          titleColor: '#fff',
          bodyColor: '#cbd5e1',
          borderColor: 'rgba(99, 102, 241, 0.3)',
          borderWidth: 1,
          displayColors: false
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8', font: { size: 10 } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: '#94a3b8', font: { size: 10 } }
        }
      }
    }
  });
}

// 7. Virtual Trade Processing
function calculateModalTradeTotals() {
  const qty = parseInt(document.getElementById('trade-qty').value) || 0;
  const price = parseFloat(document.getElementById('trade-stock-price').value) || 0;
  
  const calc = CSE_DATA.calculateFees(qty, price);
  
  document.getElementById('trade-est-value').innerText = `LKR ${calc.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  document.getElementById('trade-est-fees').innerText = `LKR ${calc.totalFees.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  
  const action = document.querySelector('input[name="trade-action"]:checked').value;
  const grandTotal = action === 'buy' ? calc.grandTotal : calc.netProceeds;
  
  document.getElementById('trade-grand-label').innerText = action === 'buy' ? 'Estimated Cost:' : 'Estimated Net Proceeds:';
  document.getElementById('trade-grand-total').innerText = `LKR ${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}

function processVirtualTrade() {
  const action = document.querySelector('input[name="trade-action"]:checked').value;
  const qty = parseInt(document.getElementById('trade-qty').value) || 0;
  const price = parseFloat(document.getElementById('trade-stock-price').value) || 0;
  const symbol = APP_STATE.selectedStockSymbol;
  const stock = CSE_DATA.stocks.find(s => s.symbol === symbol);

  if (qty <= 0) {
    alert("Please enter a valid quantity of shares to trade.");
    return;
  }

  const calc = CSE_DATA.calculateFees(qty, price);

  if (action === 'buy') {
    // Check cash balance
    if (calc.grandTotal > APP_STATE.portfolio.cash) {
      alert(`Insufficient funds! This transaction requires ${formatLKR(calc.grandTotal)}, but you only have ${formatLKR(APP_STATE.portfolio.cash)} virtual cash.`);
      return;
    }

    // Deduct cash
    APP_STATE.portfolio.cash -= calc.grandTotal;

    // Add/Update Holdings
    const existing = APP_STATE.portfolio.holdings.find(h => h.symbol === symbol);
    if (existing) {
      const newQty = existing.quantity + qty;
      const totalCost = (existing.avgBuyPrice * existing.quantity) + calc.grandTotal;
      existing.avgBuyPrice = parseFloat((totalCost / newQty).toFixed(2));
      existing.quantity = newQty;
    } else {
      APP_STATE.portfolio.holdings.push({
        symbol: symbol,
        quantity: qty,
        avgBuyPrice: parseFloat((calc.grandTotal / qty).toFixed(2)) // include buy fees in cost basis
      });
    }

    alert(`Successfully purchased ${qty.toLocaleString()} shares of ${stock.symbol.split('.')[0]}!`);
  } else {
    // Sell Action
    const existing = APP_STATE.portfolio.holdings.find(h => h.symbol === symbol);
    if (!existing || existing.quantity < qty) {
      alert(`Insufficient holding! You are trying to sell ${qty.toLocaleString()} shares, but you only possess ${existing ? existing.quantity.toLocaleString() : 0} shares.`);
      return;
    }

    // Process Sell
    APP_STATE.portfolio.cash += calc.netProceeds;
    existing.quantity -= qty;

    // Remove holding if quantity is zero
    if (existing.quantity === 0) {
      APP_STATE.portfolio.holdings = APP_STATE.portfolio.holdings.filter(h => h.symbol !== symbol);
    }

    alert(`Successfully sold ${qty.toLocaleString()} shares of ${stock.symbol.split('.')[0]}!`);
  }

  // Persist and close
  savePortfolio();
  closeModal();
  renderDashboard();
  renderExplorer();
  lucide.createIcons();
}

// 8. Render Portfolio Dashboard & Holdings
function renderPortfolio() {
  const cashEl = document.getElementById('portfolio-cash');
  const assetEl = document.getElementById('portfolio-assets');
  const totalEl = document.getElementById('portfolio-total-val');
  const returnsEl = document.getElementById('portfolio-returns');
  
  const cash = APP_STATE.portfolio.cash;
  let assetValue = 0;
  let totalCostBasis = 0;

  const holdingsBody = document.getElementById('portfolio-holdings-body');
  holdingsBody.innerHTML = '';

  APP_STATE.portfolio.holdings.forEach(holding => {
    const dbStock = CSE_DATA.stocks.find(s => s.symbol === holding.symbol);
    if (dbStock) {
      const costBasis = holding.avgBuyPrice * holding.quantity;
      const currentValue = dbStock.price * holding.quantity;
      
      assetValue += currentValue;
      totalCostBasis += costBasis;

      const unrealizedGain = currentValue - costBasis;
      const gainPct = (unrealizedGain / costBasis) * 100;
      const gainClass = unrealizedGain >= 0 ? 'text-positive' : 'text-negative';

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <div class="stock-ticker-cell">
            <span class="ticker-sym">${holding.symbol.split('.')[0]}</span>
            <span class="ticker-name">${dbStock.name}</span>
          </div>
        </td>
        <td><strong>${holding.quantity.toLocaleString()}</strong></td>
        <td>LKR ${holding.avgBuyPrice.toFixed(2)}</td>
        <td>LKR ${dbStock.price.toFixed(2)}</td>
        <td>LKR ${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
        <td class="${gainClass}">
          <strong>${unrealizedGain >= 0 ? '+' : ''}${unrealizedGain.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
          <span class="text-small block text-dim">(${gainPct >= 0 ? '+' : ''}${gainPct.toFixed(2)}%)</span>
        </td>
        <td>
          <button class="btn btn-accent py-1 px-2 text-small mr-2" onclick="viewStockDetails('${holding.symbol}')">Trade</button>
        </td>
      `;
      holdingsBody.appendChild(row);
    }
  });

  const totalValue = cash + assetValue;
  const netProfit = totalValue - 1000000.00; // vs initial LKR 1,000,000 capital
  const profitPct = (netProfit / 1000000.00) * 100;
  const returnClass = netProfit >= 0 ? 'text-positive' : 'text-negative';

  cashEl.innerText = `LKR ${cash.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  assetEl.innerText = `LKR ${assetValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  totalEl.innerText = `LKR ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  
  returnsEl.className = `glass-card primary-edge portfolio-stat-card ${returnClass}`;
  returnsEl.innerHTML = `
    <span class="label">Net Virtual Return</span>
    <span class="value">${netProfit >= 0 ? '+' : ''}${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
    <span class="sub">${profitPct >= 0 ? '+' : ''}${profitPct.toFixed(2)}% (Initial LKR 1.0M)</span>
  `;

  // Render Diversification Chart
  renderPortfolioSectorDistribution();
}

function renderPortfolioSectorDistribution() {
  if (APP_STATE.portfolioChartInstance) {
    APP_STATE.portfolioChartInstance.destroy();
  }

  const canvas = document.getElementById('portfolio-sector-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Group assets by sector
  const sectorValues = {};
  APP_STATE.portfolio.holdings.forEach(h => {
    const s = CSE_DATA.stocks.find(stock => stock.symbol === h.symbol);
    if (s) {
      const val = s.price * h.quantity;
      sectorValues[s.sector] = (sectorValues[s.sector] || 0) + val;
    }
  });

  const sectors = Object.keys(sectorValues);
  const values = Object.values(sectorValues);

  // Fallback if empty
  if (sectors.length === 0) {
    sectors.push("Cash Balance Only");
    values.push(100);
  }

  const colors = ['#6366f1', '#06b6d4', '#10b981', '#fbbf24', '#ec4899', '#f43f5e', '#8b5cf6'];

  APP_STATE.portfolioChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: sectors,
      datasets: [{
        data: values,
        backgroundColor: colors.slice(0, sectors.length),
        borderColor: '#0b0f19',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#94a3b8', font: { size: 11 } }
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleColor: '#fff',
          bodyColor: '#cbd5e1',
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              return `${label}: LKR ${value.toLocaleString()}`;
            }
          }
        }
      }
    }
  });
}

// 9. Interactive AI Advisor Chat
function renderAdvisorChat() {
  const log = document.getElementById('chat-log');
  log.innerHTML = '';

  APP_STATE.chatHistory.forEach(msg => {
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${msg.sender}`;
    bubble.innerHTML = msg.text;
    log.appendChild(bubble);
  });

  lucide.createIcons();
}

function submitAdvisorChat() {
  const inputEl = document.getElementById('chat-input');
  const userText = inputEl.value.trim();
  if (!userText) return;

  // Append user message
  const userMsg = {
    sender: 'user',
    text: userText,
    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };
  APP_STATE.chatHistory.push(userMsg);
  renderAdvisorChat();
  inputEl.value = '';
  scrollChatToBottom();

  // Show simulated loading/typing bubble
  const log = document.getElementById('chat-log');
  const typingBubble = document.createElement('div');
  typingBubble.className = 'message-bubble advisor typing-indicator';
  typingBubble.innerHTML = '<em>Ariya is analyzing Colombo Stock Exchange metrics...</em>';
  log.appendChild(typingBubble);
  scrollChatToBottom();

  // Generate response after small delay
  setTimeout(() => {
    // Remove typing bubble
    typingBubble.remove();

    // Call advisor engine
    const replyText = CSE_ADVISOR.getReply(userText, APP_STATE.portfolio);
    
    const advisorMsg = {
      sender: 'advisor',
      text: replyText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    
    APP_STATE.chatHistory.push(advisorMsg);
    saveChatHistory();
    renderAdvisorChat();
    scrollChatToBottom();
  }, 800);
}

function sendAdvisorPrompt(promptText) {
  // Simulate writing a prompt
  document.getElementById('chat-input').value = promptText;
  submitAdvisorChat();
}

function scrollChatToBottom() {
  const log = document.getElementById('chat-log');
  log.scrollTop = log.scrollHeight;
}

// 10. Standalone Broker Transaction Calculator
function renderCalculator() {
  const symbol = document.getElementById('calc-symbol').value;
  const qty = parseInt(document.getElementById('calc-qty').value) || 0;
  const price = parseFloat(document.getElementById('calc-price').value) || 0;
  const action = document.querySelector('input[name="calc-action"]:checked').value;

  const stock = CSE_DATA.stocks.find(s => s.symbol === symbol);
  
  if (stock && !document.activeElement.id.includes('calc-price')) {
    // If not manually typing price, update price to ticker default
    // Wait, let's only do this if they select a different ticker
    const prevSym = document.getElementById('calc-symbol').dataset.prevVal;
    if (prevSym !== symbol) {
      document.getElementById('calc-price').value = stock.price.toFixed(2);
      document.getElementById('calc-symbol').dataset.prevVal = symbol;
      renderCalculator(); // Recurse with new price
      return;
    }
  }

  const activePrice = parseFloat(document.getElementById('calc-price').value) || 0;
  const calc = CSE_DATA.calculateFees(qty, activePrice);

  // Fill receipt fields
  document.getElementById('rec-title').innerText = action === 'buy' ? 'Purchase Breakdown' : 'Disposal Receipt';
  document.getElementById('rec-ticker').innerText = symbol.split('.')[0];
  document.getElementById('rec-qty').innerText = qty.toLocaleString();
  document.getElementById('rec-price').innerText = `LKR ${activePrice.toFixed(2)}`;
  
  document.getElementById('rec-value').innerText = `LKR ${calc.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  document.getElementById('rec-broker').innerText = `LKR ${calc.brokerFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  document.getElementById('rec-cess').innerText = `LKR ${calc.cseCess.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  document.getElementById('rec-sec').innerText = `LKR ${calc.secLevy.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  document.getElementById('rec-cds').innerText = `LKR ${calc.cdsFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  document.getElementById('rec-total-fees').innerText = `LKR ${calc.totalFees.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  const finalVal = action === 'buy' ? calc.grandTotal : calc.netProceeds;
  document.getElementById('rec-grand-label').innerText = action === 'buy' ? 'Total Settlement Cost:' : 'Net Proceeds Realized:';
  document.getElementById('rec-grand').innerText = `LKR ${finalVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  
  // Percent drag analysis
  const breakEvenChange = 1.64; // ~0.82% * 2
  document.getElementById('rec-analysis').innerHTML = `
    <div class="alert-box info-box mt-3 mb-0">
      <i data-lucide="info"></i>
      <div>
        <strong>Fee Drag Analysis:</strong> Transaction cost constitutes <strong>${((calc.totalFees / calc.value) * 100 || 0).toFixed(3)}%</strong> of trade volume. 
        You require a price appreciation of at least <strong>${breakEvenChange}%</strong> (to LKR ${(activePrice * (1 + breakEvenChange/100)).toFixed(2)}) to clear double brokerage expenses and lock positive returns.
      </div>
    </div>
  `;
  
  lucide.createIcons();
}

// 11. Custom Global Helpers (Binded in DOM window scope for dynamic HTML button calls)
window.sendAdvisorPrompt = sendAdvisorPrompt;
window.viewStockDetails = viewStockDetails;
window.closeModal = closeModal;
window.processVirtualTrade = processVirtualTrade;

// 12. Setup General Event Listeners
function setupEventListeners() {
  // Explorer searches
  document.getElementById('explorer-search').addEventListener('input', renderExplorer);
  document.getElementById('explorer-sector-filter').addEventListener('change', renderExplorer);
  document.getElementById('explorer-sort-select').addEventListener('change', renderExplorer);

  // Modal trade calculations
  document.getElementById('trade-qty').addEventListener('input', calculateModalTradeTotals);
  document.getElementById('trade-stock-price').addEventListener('input', calculateModalTradeTotals);
  
  document.querySelectorAll('input[name="trade-action"]').forEach(radio => {
    radio.addEventListener('change', calculateModalTradeTotals);
  });

  // Calculator listeners
  document.getElementById('calc-symbol').addEventListener('change', renderCalculator);
  document.getElementById('calc-qty').addEventListener('input', renderCalculator);
  document.getElementById('calc-price').addEventListener('input', renderCalculator);
  
  document.querySelectorAll('input[name="calc-action"]').forEach(radio => {
    radio.addEventListener('change', renderCalculator);
  });

  // Chat submit bindings
  document.getElementById('chat-submit').addEventListener('click', submitAdvisorChat);
  document.getElementById('chat-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      submitAdvisorChat();
    }
  });
}

function formatLKR(num) {
  return "LKR " + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
