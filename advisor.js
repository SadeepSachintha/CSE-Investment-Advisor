/**
 * advisor.js
 * AI Investment Advisor ("Ariya") logic for Colombo Stock Exchange.
 * Provides custom conversational responses, portfolio analysis, stock screens, and market reports.
 */

const CSE_ADVISOR = (() => {
  
  // Format currency
  const formatLKR = (num) => {
    return "LKR " + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // 1. Portfolio Evaluation Logic
  const evaluatePortfolio = (portfolio) => {
    if (!portfolio || !portfolio.holdings || portfolio.holdings.length === 0) {
      return `
        <div class="advisor-card glow-border">
          <div class="card-header-accent"><i data-lucide="alert-circle"></i> Portfolio Review Status</div>
          <p><strong>Your virtual portfolio is currently empty!</strong></p>
          <p>To begin your investment journey, head over to the <strong>Stock Explorer</strong> panel and simulate a purchase. I recommend starting with established blue-chips to build a resilient foundation:</p>
          <ul class="styled-list">
            <li><strong>COMB.N0000 (Commercial Bank)</strong>: High dividend yield (~7.5%) and exceptionally low P/E ratio (~6.2x) indicating strong defensive value.</li>
            <li><strong>JKH.N0000 (John Keells Holdings)</strong>: The benchmark conglomerate of Sri Lanka. Outstanding long-term growth prospects with the upcoming Colombo Port West Container Terminal (WCT) and flagship Waterfront Integrated Resort.</li>
            <li><strong>HAYL.N0000 (Hayleys)</strong>: Strong export earner (gloves, purification carbon) providing a natural hedge.</li>
          </ul>
        </div>
      `;
    }

    const holdings = portfolio.holdings;
    let totalCost = 0;
    let totalValue = 0;
    let portfolioBeta = 0;
    let weightedDivYield = 0;
    const sectorWeights = {};

    // Get stock details to perform calculation
    holdings.forEach(holding => {
      const dbStock = CSE_DATA.stocks.find(s => s.symbol === holding.symbol);
      if (dbStock) {
        const cost = holding.avgBuyPrice * holding.quantity;
        const value = dbStock.price * holding.quantity;
        totalCost += cost;
        totalValue += value;
        
        portfolioBeta += dbStock.beta * value;
        weightedDivYield += dbStock.divYield * value;

        // Group by sector
        sectorWeights[dbStock.sector] = (sectorWeights[dbStock.sector] || 0) + value;
      }
    });

    portfolioBeta = totalValue > 0 ? portfolioBeta / totalValue : 0;
    weightedDivYield = totalValue > 0 ? weightedDivYield / totalValue : 0;

    // Analyze concentration
    let concentrationWarning = "";
    let highRiskWarning = "";
    let diversificationTip = "";

    const highestSector = Object.keys(sectorWeights).reduce((a, b) => sectorWeights[a] > sectorWeights[b] ? a : b);
    const highestSectorPct = (sectorWeights[highestSector] / totalValue) * 100;

    if (highestSectorPct > 50) {
      concentrationWarning = `
        <div class="alert-box warning-box">
          <i data-lucide="alert-triangle"></i>
          <strong>Concentration Alert:</strong> You have <strong>${highestSectorPct.toFixed(1)}%</strong> of your assets allocated in the <strong>${highestSector}</strong> sector. I recommend rebalancing to keep any single sector below 35% of total capital.
        </div>
      `;
    }

    if (portfolioBeta > 1.25) {
      highRiskWarning = `
        <div class="alert-box caution-box">
          <i data-lucide="trending-up"></i>
          <strong>High Risk Profile (Beta: ${portfolioBeta.toFixed(2)}):</strong> Your portfolio volatility is higher than the general market. Consider adding low-beta defensive utility shares like <strong>DIAL.N0000</strong> (Beta: 0.70) or <strong>COMB.N0000</strong> (Beta: 0.95) to cushion against market shocks.
        </div>
      `;
    } else if (portfolioBeta < 0.8) {
      diversificationTip = `
        <div class="alert-box info-box">
          <i data-lucide="shield-check"></i>
          <strong>Defensive Portfolio (Beta: ${portfolioBeta.toFixed(2)}):</strong> Your portfolio is highly insulated. If you have a longer investment horizon, you might consider allocating a small portion (10-15%) into high-momentum growers like <strong>LIOC.N0000</strong> (Energy) or capital expansions like <strong>AEL.N0000</strong> (Construction) to boost returns.
        </div>
      `;
    }

    // Build holdings analysis rows
    let tableRows = "";
    holdings.forEach(holding => {
      const dbStock = CSE_DATA.stocks.find(s => s.symbol === holding.symbol);
      if (dbStock) {
        const cost = holding.avgBuyPrice * holding.quantity;
        const value = dbStock.price * holding.quantity;
        const gainLoss = value - cost;
        const gainLossPct = (gainLoss / cost) * 100;
        const gainLossClass = gainLoss >= 0 ? "text-positive" : "text-negative";
        
        // Custom Advisor view on each holding
        let rec = "HOLD";
        if (dbStock.pe < 7.0 && dbStock.divYield > 6.0) rec = "BUY / ACCUMULATE";
        else if (gainLossPct > 25.0) rec = "TAKE PROFIT (PARTIAL)";
        else if (dbStock.pe > 18.0) rec = "REDUCE / SWITCH";

        tableRows += `
          <tr>
            <td><strong>${holding.symbol.split('.')[0]}</strong></td>
            <td>${holding.quantity.toLocaleString()}</td>
            <td>${formatLKR(holding.avgBuyPrice)}</td>
            <td>${formatLKR(dbStock.price)}</td>
            <td class="${gainLossClass}"><strong>${gainLossPct >= 0 ? '+' : ''}${gainLossPct.toFixed(2)}%</strong></td>
            <td><span class="badge ${rec.includes('BUY') ? 'badge-buy' : rec.includes('TAKE') ? 'badge-sell' : 'badge-hold'}">${rec}</span></td>
          </tr>
        `;
      }
    });

    const netProfit = totalValue - totalCost;
    const netProfitPct = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
    const profitClass = netProfit >= 0 ? "text-positive" : "text-negative";

    return `
      <div class="advisor-card">
        <h4 class="card-title"><i data-lucide="shield-check" class="title-icon"></i> Portfolio Health Report</h4>
        <div class="advisor-stats-grid">
          <div class="adv-stat">
            <span class="label">Weighted Beta</span>
            <span class="value">${portfolioBeta.toFixed(2)}</span>
            <span class="sub">${portfolioBeta > 1.1 ? 'Aggressive' : portfolioBeta < 0.85 ? 'Defensive' : 'Balanced'}</span>
          </div>
          <div class="adv-stat">
            <span class="label">Avg Div Yield</span>
            <span class="value">${weightedDivYield.toFixed(2)}%</span>
            <span class="sub">Market Avg: 5.4%</span>
          </div>
          <div class="adv-stat">
            <span class="label">Total Return</span>
            <span class="value ${profitClass}">${netProfitPct >= 0 ? '+' : ''}${netProfitPct.toFixed(2)}%</span>
            <span class="sub">${formatLKR(netProfit)}</span>
          </div>
        </div>

        ${concentrationWarning}
        ${highRiskWarning}
        ${diversificationTip}

        <h5 class="section-sub-title">Individual Asset Advisory</h5>
        <div class="table-container">
          <table class="advisor-table">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Qty</th>
                <th>Avg Cost</th>
                <th>Current</th>
                <th>Return</th>
                <th>Advisor Rec</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
        
        <p class="disclaimer mt-3"><em>Disclaimer: Ariya's feedback is based on mathematical algorithms and market indicators. Consult a certified broker before finalizing any trading actions.</em></p>
      </div>
    `;
  };

  // 2. Dividend Screener
  const runDividendScreen = () => {
    const highYielders = [...CSE_DATA.stocks]
      .filter(s => s.divYield >= 6.5)
      .sort((a, b) => b.divYield - a.divYield);

    let rows = "";
    highYielders.forEach(s => {
      rows += `
        <tr class="hover-row" onclick="viewStockDetails('${s.symbol}')">
          <td><strong>${s.symbol.split('.')[0]}</strong></td>
          <td>${s.name}</td>
          <td class="text-accent"><strong>${s.divYield.toFixed(2)}%</strong></td>
          <td>${s.pe.toFixed(1)}x</td>
          <td>${formatLKR(s.price)}</td>
          <td>LKR ${s.eps.toFixed(2)}</td>
        </tr>
      `;
    });

    return `
      <div class="advisor-card glow-border">
        <h4 class="card-title text-emerald"><i data-lucide="award" class="title-icon"></i> Top Dividend Yielding Stars</h4>
        <p class="card-desc">Dividend investing is highly popular on the CSE, providing a superb cash flow hedge. These companies represent robust cash-generating engines with high payout rates, low P/E, and steady business structures:</p>
        
        <div class="table-container">
          <table class="advisor-table">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Company Name</th>
                <th>Dividend Yield</th>
                <th>P/E Ratio</th>
                <th>Price</th>
                <th>EPS</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
        
        <div class="advisor-notes mt-3">
          <h5><i data-lucide="lightbulb"></i> Ariya's Strategic Tip:</h5>
          <p>For defensive passive income, consider pairing <strong>DIAL.N0000</strong> (highest yield at 9.8%, low beta) with <strong>SAMP.N0000</strong> (banking major, 8.2% yield, extremely cheap P/E at 5.8x). This blends telecommunication stability with banking growth.</p>
        </div>
      </div>
    `;
  };

  // 3. Value Investing Screener
  const runValueScreen = () => {
    // Value screen: P/E < 10, P/BV (Price to Book Value) < 1.2, Beta <= 1.3
    const valueStocks = CSE_DATA.stocks.filter(s => {
      const pbRatio = s.price / s.bookValue;
      return s.pe < 10.0 && pbRatio < 1.1 && s.beta <= 1.3;
    }).sort((a, b) => a.pe - b.pe);

    let rows = "";
    valueStocks.forEach(s => {
      const pbRatio = s.price / s.bookValue;
      rows += `
        <tr class="hover-row" onclick="viewStockDetails('${s.symbol}')">
          <td><strong>${s.symbol.split('.')[0]}</strong></td>
          <td>${s.name}</td>
          <td><strong>${s.pe.toFixed(1)}x</strong></td>
          <td>${pbRatio.toFixed(2)}x</td>
          <td>${s.beta.toFixed(2)}</td>
          <td>${formatLKR(s.price)}</td>
          <td>${formatLKR(s.bookValue)}</td>
        </tr>
      `;
    });

    return `
      <div class="advisor-card glow-border">
        <h4 class="card-title text-indigo"><i data-lucide="trending-down" class="title-icon"></i> Value & Undervalued Screener</h4>
        <p class="card-desc">Based on classical Benjamin Graham value principles, this screener filters for stocks trading at low multiples (P/E &lt; 10x), below or near their accounting Book Value (P/BV &lt; 1.1x), with controlled market volatility:</p>
        
        <div class="table-container">
          <table class="advisor-table">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Company Name</th>
                <th>P/E Ratio</th>
                <th>P/BV Ratio</th>
                <th>Beta</th>
                <th>Price</th>
                <th>Book Value</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
        
        <div class="advisor-notes mt-3">
          <h5><i data-lucide="info"></i> Market Context:</h5>
          <p>Sri Lankan banking counters like <strong>COMB</strong>, <strong>SAMP</strong>, and <strong>HNB</strong> are trading at historical discounts relative to their book values. This is due to macroeconomic adjustments. As recovery takes hold, these assets offer severe margin of safety and re-rating potential.</p>
        </div>
      </div>
    `;
  };

  // 4. Macro Outlook
  const getMacroOutlook = () => {
    return `
      <div class="advisor-card">
        <h4 class="card-title text-cyan"><i data-lucide="globe" class="title-icon"></i> CSE Macroeconomic & Technical Outlook</h4>
        
        <div class="outlook-box">
          <h5>1. Macroeconomic Environment <span class="badge badge-buy">Positive</span></h5>
          <p>The Central Bank of Sri Lanka (CBSL) has maintained a policy rate-easing cycle, dragging interest rates down. This is driving liquidity out of fixed deposits and treasury bills, channeling it directly into the equity markets. The stabilizing Sri Lankan Rupee (LKR) has also boosted corporate earnings for import-heavy giants.</p>
        </div>

        <div class="outlook-box">
          <h5>2. Key Market Drivers & Catalysts <span class="badge badge-hold">Bullish Neutral</span></h5>
          <ul class="styled-list">
            <li><strong>IMF Review Progress:</strong> Successive review approvals under the Extended Fund Facility (EFF) provide confidence and stimulate foreign institutional inflows.</li>
            <li><strong>Debt Restructuring:</strong> Approaching milestones in external debt agreements will eliminate sovereign risk overhang, paving the way for international credit rating upgrades.</li>
            <li><strong>Port City & Foreign Investments:</strong> Large capital infusions into the Colombo Port City special economic zone are triggering direct capital gains for engineering firms and developers (e.g., Access Engineering).</li>
          </ul>
        </div>

        <div class="outlook-box">
          <h5>3. Technical Analysis (ASPI & S&P SL20) <span class="badge badge-hold">Consolidating</span></h5>
          <p>The <strong>ASPI</strong> is consolidating between the 11,500 and 12,000 range. A decisive breakout above <strong>12,000</strong> backed by heavy volume will open the doors to 12,500. Support is well-established at <strong>11,200</strong>, which remains an excellent accumulation zone.</p>
        </div>

        <div class="advisor-notes mt-3 text-cyan">
          <h5>Ariya's Summary:</h5>
          <p><strong>Overweight:</strong> Banking & Capital Goods. Banking spreads are recovering, and conglomerates are positioned to capitalize on infrastructure projects. <strong>Neutral:</strong> Plantation & Commodities, as commodity exports face currency translation headwinds.</p>
        </div>
      </div>
    `;
  };

  // 5. Custom Stock Analysis
  const analyzeSingleStock = (stockSymbol) => {
    const stock = CSE_DATA.stocks.find(s => s.symbol.toLowerCase() === stockSymbol.toLowerCase() || s.symbol.split('.')[0].toLowerCase() === stockSymbol.toLowerCase());
    
    if (!stock) {
      return `
        <div class="advisor-card">
          <p>I couldn't locate any listed stock matching "<strong>${stockSymbol}</strong>".</p>
          <p>Please double-check the ticker. Examples of top liquid counters I support:</p>
          <code>JKH</code>, <code>COMB</code>, <code>SAMP</code>, <code>LOLC</code>, <code>HAYL</code>, <code>DIAL</code>, <code>LIOC</code>, <code>HNB</code>.
        </div>
      `;
    }

    let rating = "HOLD";
    let ratingClass = "badge-hold";
    let rationale = "";

    if (stock.pe < 7.0 && stock.divYield > 7.0) {
      rating = "STRONG BUY";
      ratingClass = "badge-buy";
      rationale = `${stock.symbol.split('.')[0]} is screaming value. It has a high dividend yield of ${stock.divYield}% combined with an extremely depressed P/E multiple of ${stock.pe}x. There is a strong margin of safety here.`;
    } else if (stock.pe < 10.0 && stock.divYield > 5.0) {
      rating = "BUY / ACCUMULATE";
      ratingClass = "badge-buy";
      rationale = `Solid cash-generator. Trading at a cheap valuation. This stock represents a great core holding for long-term investors seeking both yield and capital gains.`;
    } else if (stock.pe > 18.0) {
      rating = "REDUCE / SELL";
      ratingClass = "badge-sell";
      rationale = `This stock is currently trading at a steep premium (P/E of ${stock.pe}x). If you hold significant paper profits, consider trimming your position and rotating capital into cheaper banking or capital goods options.`;
    } else {
      rating = "HOLD";
      rationale = `Currently fairly valued at ${stock.pe}x earnings. Continue to hold for structural growth, or buy selectively on pullbacks near support lines.`;
    }

    return `
      <div class="advisor-card">
        <h4 class="card-title"><span class="badge ${ratingClass}">${rating}</span> Details: ${stock.name}</h4>
        
        <div class="stock-analysis-details">
          <p><strong>${stock.symbol}</strong> is currently priced at <strong>${formatLKR(stock.price)}</strong> (${stock.change >= 0 ? '+' : ''}${stock.change}%) in the <strong>${stock.sector}</strong> sector.</p>
          <p class="rationale-text"><strong>Ariya's Rationale:</strong> ${rationale}</p>
        </div>

        <div class="advisor-stats-grid mt-3">
          <div class="adv-stat">
            <span class="label">P/E Ratio</span>
            <span class="value">${stock.pe}x</span>
            <span class="sub">Sector Avg: ~9.5x</span>
          </div>
          <div class="adv-stat">
            <span class="label">Dividend Yield</span>
            <span class="value">${stock.divYield}%</span>
            <span class="sub">Cash Distribution</span>
          </div>
          <div class="adv-stat">
            <span class="label">Price to Book</span>
            <span class="value">${(stock.price / stock.bookValue).toFixed(2)}x</span>
            <span class="sub">Book Val: LKR ${stock.bookValue}</span>
          </div>
        </div>

        <div class="outlook-box mt-3">
          <h5>Company Profile & Catalyst:</h5>
          <p>${stock.description}</p>
        </div>

        <button class="btn btn-secondary mt-3" onclick="viewStockDetails('${stock.symbol}')"><i data-lucide="line-chart"></i> View Advanced Interactive Chart</button>
      </div>
    `;
  };

  // 6. Natural Language Response Handler
  const getReply = (userMessage, portfolio) => {
    const msg = userMessage.toLowerCase().trim();

    // Check pre-defined intent matches first
    if (msg.includes("evaluate") || msg.includes("portfolio") || msg.includes("review") || msg.includes("analyze my holdings")) {
      return evaluatePortfolio(portfolio);
    }
    if (msg.includes("dividend") || msg.includes("yield") || msg.includes("stars") || msg.includes("income")) {
      return runDividendScreen();
    }
    if (msg.includes("value") || msg.includes("undervalued") || msg.includes("cheap") || msg.includes("graham")) {
      return runValueScreen();
    }
    if (msg.includes("macro") || msg.includes("outlook") || msg.includes("economy") || msg.includes("market") || msg.includes("aspi")) {
      return getMacroOutlook();
    }

    // Check for specific stocks tickers or names
    for (let s of CSE_DATA.stocks) {
      const ticker = s.symbol.split('.')[0].toLowerCase();
      const rawTicker = s.symbol.toLowerCase();
      const nameParts = s.name.toLowerCase().split(' ');
      
      if (msg === ticker || msg === rawTicker || msg.includes("analyze " + ticker) || msg.includes("about " + ticker) || (msg.includes(ticker) && msg.includes("stock"))) {
        return analyzeSingleStock(s.symbol);
      }
    }

    // Explanations about CSE rules and fees
    if (msg.includes("fee") || msg.includes("charge") || msg.includes("commission") || msg.includes("cost") || msg.includes("tax")) {
      return `
        <div class="advisor-card">
          <h4 class="card-title"><i data-lucide="calculator" class="title-icon"></i> CSE Trading Transaction Fees</h4>
          <p>Every transaction (buying and selling) on the Colombo Stock Exchange incurs standard statutory fees. For retail investors (transaction value under LKR 100 Million), the total charges amount to **0.82%** of the transaction value, broken down as follows:</p>
          
          <ul class="styled-list">
            <li><strong>Brokerage Commission:</strong> 0.64% (goes to your stockbroker company)</li>
            <li><strong>CSE Cess:</strong> 0.084% (goes to the Stock Exchange)</li>
            <li><strong>SEC Levy:</strong> 0.072% (goes to the Securities & Exchange Commission)</li>
            <li><strong>CDS Fee:</strong> 0.024% (goes to the Central Depository Systems)</li>
          </ul>
          
          <p class="mt-3"><strong>Key Takeaway:</strong> To break even on a stock flip, your asset must appreciate by at least **1.64%** (0.82% buy cost + 0.82% sell cost). You can use our interactive **Brokerage Calculator** tab to compute exact expenses for any trade!</p>
        </div>
      `;
    }

    if (msg.includes("how to buy") || msg.includes("how to start") || msg.includes("account") || msg.includes("cds")) {
      return `
        <div class="advisor-card">
          <h4 class="card-title"><i data-lucide="play" class="title-icon"></i> How to Start Investing in the CSE</h4>
          <p>If you wish to move from this virtual sandbox to real-world trading on the Colombo Stock Exchange, here is the official process:</p>
          
          <ol class="styled-list-numeric">
            <li><strong>Select a Stockbroker:</strong> Visit the official cse.lk website and choose from the list of licensed stock brokerage firms in Sri Lanka.</li>
            <li><strong>Open a CDS Account:</strong> Your broker will assist you in opening a Central Depository Systems (CDS) account. You can now do this fully digitally via the 'CSE Mobile App' using your National Identity Card (NIC).</li>
            <li><strong>Fund Your Account:</strong> Transfer capital to your brokerage account bank details.</li>
            <li><strong>Place Trades:</strong> Use the digital trading platforms (like CSE ATS, broker apps) to buy and sell listed shares.</li>
          </ol>
          
          <p class="mt-3">For now, feel free to hone your skills by simulating trades inside this application with your virtual **LKR 1,000,000** capital balance!</p>
        </div>
      `;
    }

    // Default conversational fallback
    return `
      <div class="advisor-card">
        <h4 class="card-title">Greetings! I am Ariya, your CSE Investment Advisor from SS Labz</h4>
        <p>I specialize in Colombo Stock Exchange equity markets, stock screening, transaction charges, and asset allocations. How can I guide you today?</p>
        
        <p>You can ask me questions directly, or click one of the interactive options below to run instantaneous financial evaluations:</p>
        
        <div class="chat-options-group mt-3">
          <button class="chat-chip" onclick="sendAdvisorPrompt('Evaluate My Portfolio')"><i data-lucide="shield-check"></i> Evaluate Portfolio</button>
          <button class="chat-chip" onclick="sendAdvisorPrompt('Find Dividend Stars')"><i data-lucide="award"></i> High Dividend Screens</button>
          <button class="chat-chip" onclick="sendAdvisorPrompt('Value Investing Screen')"><i data-lucide="trending-down"></i> Value Screens</button>
          <button class="chat-chip" onclick="sendAdvisorPrompt('Market Outlook')"><i data-lucide="globe"></i> Market Outlook</button>
        </div>

        <p class="mt-3 text-small"><em>Tip: Try typing stock tickers directly (e.g., <strong>"JKH"</strong>, <strong>"COMB"</strong>, <strong>"LOLC"</strong>) to receive institutional-grade financial analysis.</em></p>
      </div>
    `;
  };

  return {
    getReply,
    evaluatePortfolio,
    runDividendScreen,
    runValueScreen,
    getMacroOutlook,
    analyzeSingleStock
  };
})();
