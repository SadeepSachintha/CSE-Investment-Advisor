/**
 * data.js
 * Comprehensive seed data for the Colombo Stock Exchange (CSE) Investment Advisor app.
 * Pre-populated with real blue-chip companies, tickers, historical price points, news feed, and trading fees.
 */

const CSE_DATA = (() => {
  // Generate mock historical price points (past 30 days) for a stock given its starting price and volatility
  const generateHistory = (startPrice, days = 30, volatility = 0.02, trend = 0.0005) => {
    const history = [];
    let currentPrice = startPrice;
    
    // Seed using a simple random walk with a trend
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Calculate random multiplier
      const changePercent = (Math.random() - 0.48) * volatility + trend;
      currentPrice = currentPrice * (1 + changePercent);
      
      history.push({
        date: formattedDate,
        price: parseFloat(currentPrice.toFixed(2))
      });
    }
    return history;
  };

  const stocks = [
    {
      symbol: "JKH.N0000",
      name: "John Keells Holdings PLC",
      sector: "Capital Goods",
      price: 192.50,
      change: 1.25,
      volume: 1245600,
      pe: 14.5,
      divYield: 3.2,
      eps: 13.28,
      bookValue: 165.40,
      beta: 1.15,
      roe: 8.0,
      marketCap: 300.2, // LKR Billions
      description: "John Keells Holdings PLC (JKH) is Sri Lanka's largest listed conglomerate. JKH has a dominant presence in transportation, leisure, property, consumer foods, retail, financial services, and IT.",
      history: generateHistory(188.00, 30, 0.015, 0.001)
    },
    {
      symbol: "COMB.N0000",
      name: "Commercial Bank of Ceylon PLC",
      sector: "Banking",
      price: 98.20,
      change: 0.82,
      volume: 852100,
      pe: 6.2,
      divYield: 7.5,
      eps: 15.84,
      bookValue: 135.20,
      beta: 0.95,
      roe: 11.7,
      marketCap: 110.5,
      description: "Commercial Bank of Ceylon PLC is the leading private sector commercial bank in Sri Lanka, consistently recognized for its financial stability, innovative digital platforms, and extensive branch network.",
      history: generateHistory(95.00, 30, 0.012, 0.0008)
    },
    {
      symbol: "SAMP.N0000",
      name: "Sampath Bank PLC",
      sector: "Banking",
      price: 76.50,
      change: -0.52,
      volume: 1120000,
      pe: 5.8,
      divYield: 8.2,
      eps: 13.19,
      bookValue: 112.50,
      beta: 0.90,
      roe: 11.7,
      marketCap: 89.6,
      description: "Sampath Bank is a premier private sector bank in Sri Lanka, renowned for technological leadership, customer-centric innovations, and strong growth in lending and deposit books.",
      history: generateHistory(78.00, 30, 0.014, -0.0005)
    },
    {
      symbol: "LOLC.N0000",
      name: "LOLC Holdings PLC",
      sector: "Diversified Financials",
      price: 345.00,
      change: -2.27,
      volume: 245000,
      pe: 7.1,
      divYield: 1.5,
      eps: 48.59,
      bookValue: 395.00,
      beta: 1.60,
      roe: 12.3,
      marketCap: 164.8,
      description: "LOLC Holdings PLC is one of Sri Lanka's largest conglomerates, with extensive global microfinance and financial services operations spanning Asia, Africa, and Eastern Europe.",
      history: generateHistory(355.00, 30, 0.025, -0.0015)
    },
    {
      symbol: "HAYL.N0000",
      name: "Hayleys PLC",
      sector: "Capital Goods",
      price: 88.00,
      change: 2.09,
      volume: 642000,
      pe: 8.4,
      divYield: 6.8,
      eps: 10.48,
      bookValue: 92.10,
      beta: 1.30,
      roe: 11.4,
      marketCap: 66.0,
      description: "Hayleys PLC is a highly diversified multinational conglomerate, operating in sectors such as agriculture, purification (activated carbon), hand protection (gloves), textiles, and transportation/logistics.",
      history: generateHistory(85.00, 30, 0.018, 0.0012)
    },
    {
      symbol: "DIAL.N0000",
      name: "Dialog Axiata PLC",
      sector: "Telecommunication",
      price: 10.10,
      change: 0.00,
      volume: 2410000,
      pe: 8.5,
      divYield: 9.8,
      eps: 1.19,
      bookValue: 9.40,
      beta: 0.70,
      roe: 12.6,
      marketCap: 83.2,
      description: "Dialog Axiata PLC is Sri Lanka's largest telecommunications services provider, leading the market in mobile, broadband, fixed line, digital pay television, and financial services (e-wallet/EZ Cash).",
      history: generateHistory(10.10, 30, 0.008, 0.0)
    },
    {
      symbol: "HNB.N0000",
      name: "Hatton National Bank PLC",
      sector: "Banking",
      price: 182.25,
      change: 1.53,
      volume: 420000,
      pe: 5.9,
      divYield: 7.8,
      eps: 30.89,
      bookValue: 245.00,
      beta: 0.98,
      roe: 12.6,
      marketCap: 104.9,
      description: "Hatton National Bank PLC (HNB) is a premier private sector commercial bank in Sri Lanka, boasting deep roots in retail, SME banking, corporate finance, and micro-lending.",
      history: generateHistory(178.00, 30, 0.012, 0.001)
    },
    {
      symbol: "LIOC.N0000",
      name: "Lanka IOC PLC",
      sector: "Energy",
      price: 112.75,
      change: 3.44,
      volume: 1850000,
      pe: 9.2,
      divYield: 5.5,
      eps: 12.25,
      bookValue: 82.50,
      beta: 1.45,
      roe: 14.8,
      marketCap: 60.1,
      description: "Lanka IOC PLC is an energy company operating in Sri Lanka engaged in retailing, bunkering, blending of lubricants, and distribution of petroleum products, operating under the Indian Oil Corporation.",
      history: generateHistory(107.00, 30, 0.022, 0.002)
    },
    {
      symbol: "MELS.N0000",
      name: "Melstacorp PLC",
      sector: "Food, Beverage & Tobacco",
      price: 85.50,
      change: 0.59,
      volume: 480000,
      pe: 9.5,
      divYield: 7.0,
      eps: 9.00,
      bookValue: 68.20,
      beta: 0.85,
      roe: 13.2,
      marketCap: 99.6,
      description: "Melstacorp PLC is an investment holding company with strong interests in beverages (via Distilleries Company of Sri Lanka), plantations, telecommunications, financial services, healthcare, and leisure.",
      history: generateHistory(84.00, 30, 0.011, 0.0005)
    },
    {
      symbol: "HHL.N0000",
      name: "Hemas Holdings PLC",
      sector: "Capital Goods",
      price: 78.00,
      change: -0.64,
      volume: 310000,
      pe: 11.2,
      divYield: 4.8,
      eps: 6.96,
      bookValue: 72.30,
      beta: 0.80,
      roe: 9.6,
      marketCap: 46.5,
      description: "Hemas Holdings PLC is a leading conglomerate focused on Consumer Brands (personal care, home care) and Healthcare (pharmaceutical distribution, hospitals), emphasizing wellness and premium value creation.",
      history: generateHistory(79.50, 30, 0.013, -0.0003)
    },
    {
      symbol: "LFIN.N0000",
      name: "L B Finance PLC",
      sector: "Diversified Financials",
      price: 68.50,
      change: 1.18,
      volume: 590000,
      pe: 6.5,
      divYield: 8.5,
      eps: 10.54,
      bookValue: 78.40,
      beta: 1.10,
      roe: 13.4,
      marketCap: 25.1,
      description: "L B Finance PLC is one of Sri Lanka's oldest and most trusted non-bank financial institutions, leading in leasing, gold loans, factoring, microfinance, and fixed deposits.",
      history: generateHistory(67.00, 30, 0.016, 0.0009)
    },
    {
      symbol: "SLTL.N0000",
      name: "Sri Lanka Telecom PLC",
      sector: "Telecommunication",
      price: 72.00,
      change: -1.78,
      volume: 180000,
      pe: 15.2,
      divYield: 2.5,
      eps: 4.74,
      bookValue: 65.00,
      beta: 0.85,
      roe: 7.3,
      marketCap: 130.0,
      description: "Sri Lanka Telecom PLC (SLT-Mobitel) is the national telecommunications provider in Sri Lanka, powering fixed broadband, mobile networks, fiber connectivity, and enterprise digital solutions.",
      history: generateHistory(74.00, 30, 0.014, -0.001)
    },
    {
      symbol: "CCS.N0000",
      name: "Ceylon Cold Stores PLC",
      sector: "Food, Beverage & Tobacco",
      price: 54.00,
      change: 0.37,
      volume: 680000,
      pe: 16.8,
      divYield: 4.2,
      eps: 3.21,
      bookValue: 35.50,
      beta: 0.75,
      roe: 9.0,
      marketCap: 51.3,
      description: "Ceylon Cold Stores PLC, operating under the 'Elephant House' brand, is a market leader in carbonated soft drinks, ice creams, and processed meats, and owns the Keells retail supermarket chain.",
      history: generateHistory(53.00, 30, 0.011, 0.0003)
    },
    {
      symbol: "CARG.N0000",
      name: "Cargills (Ceylon) PLC",
      sector: "Food & Staples Retailing",
      price: 340.00,
      change: 0.22,
      volume: 95000,
      pe: 18.2,
      divYield: 3.5,
      eps: 18.68,
      bookValue: 195.00,
      beta: 0.65,
      roe: 9.6,
      marketCap: 87.8,
      description: "Cargills (Ceylon) PLC is a leading retail, food manufacturing, and distribution group, operating the Cargills Food City supermarket chain, manufacturing ice creams, dairies, and meat products.",
      history: generateHistory(338.00, 30, 0.009, 0.0002)
    },
    {
      symbol: "BIL.N0000",
      name: "Browns Investments PLC",
      sector: "Diversified Financials",
      price: 5.40,
      change: -3.57,
      volume: 15450000,
      pe: 22.5,
      divYield: 0.0,
      eps: 0.24,
      bookValue: 4.80,
      beta: 1.80,
      roe: 5.0,
      marketCap: 77.5,
      description: "Browns Investments PLC is a highly active investment vehicle with major holdings in plantations, leisure, real estate, construction, and power generation in Sri Lanka, Maldives, and Sierra Leone.",
      history: generateHistory(5.70, 30, 0.035, -0.002)
    },
    {
      symbol: "AEL.N0000",
      name: "Access Engineering PLC",
      sector: "Construction & Capital Goods",
      price: 22.80,
      change: 2.70,
      volume: 2150000,
      pe: 7.8,
      divYield: 6.5,
      eps: 2.92,
      bookValue: 28.50,
      beta: 1.20,
      roe: 10.2,
      marketCap: 22.8,
      description: "Access Engineering PLC is a leading construction and engineering company in Sri Lanka, specializes in major infrastructure projects including flyovers, water supply, harbors, and buildings.",
      history: generateHistory(22.00, 30, 0.019, 0.0015)
    }
  ];

  const indices = {
    aspi: {
      name: "ASPI (All Share Price Index)",
      value: 11842.50,
      change: 85.30,
      changePercent: 0.73,
      history: generateHistory(11700, 30, 0.008, 0.0005)
    },
    spsl20: {
      name: "S&P SL20 Index",
      value: 3456.80,
      change: 32.10,
      changePercent: 0.94,
      history: generateHistory(3400, 30, 0.010, 0.0007)
    }
  };

  const news = [
    {
      id: 1,
      timestamp: "10 mins ago",
      source: "Lanka Business Online",
      title: "Colombo Stock Exchange ASPI hits 1-month high on institutional buying",
      snippet: "ASPI surged past the 11,800 psychological barrier as buying momentum accelerated in large-cap banking and capital goods sectors, led by COMB and JKH.",
      stock: "JKH.N0000"
    },
    {
      id: 2,
      timestamp: "1 hour ago",
      source: "Daily FT",
      title: "John Keells Holdings PLC details progress on West Container Terminal project",
      snippet: "JKH chairman confirmed that the deepwater West Container Terminal (WCT-1) at Colombo Port is progressing rapidly, scheduled to commence operational phases by early next year.",
      stock: "JKH.N0000"
    },
    {
      id: 3,
      timestamp: "3 hours ago",
      source: "EconomyNext",
      title: "Commercial Bank of Ceylon posts impressive Q1 results; net profits rise 14%",
      snippet: "Commercial Bank (COMB) posted record growth driven by healthy digital adoption rates, lower provisioning expenses, and robust loan expansions in agriculture and SME sectors.",
      stock: "COMB.N0000"
    },
    {
      id: 4,
      timestamp: "5 hours ago",
      source: "LBR",
      title: "Lanka IOC benefits from stable retail pricing; schedules dividend payment",
      snippet: "Lanka IOC (LIOC) declared a hefty interim dividend of LKR 6.50 per share following solid retail performance and expanded industrial lubricant supply contracts.",
      stock: "LIOC.N0000"
    },
    {
      id: 5,
      timestamp: "Yesterday",
      source: "Daily Mirror",
      title: "Dialog Axiata announces strategic digital healthcare platform expansions",
      snippet: "Dialog Axiata (DIAL) announced a fresh investment of LKR 1.2 Billion to scale up its telehealth and digital pharmacy divisions, broadening tech-led services nationwide.",
      stock: "DIAL.N0000"
    },
    {
      id: 6,
      timestamp: "2 days ago",
      source: "Sunday Times",
      title: "SEC issues new guidelines to boost retail market participation at CSE",
      snippet: "The Securities and Exchange Commission (SEC) launched a digital sandbox and streamlined mobile-based CDS account opening procedures to attract tech-savvy retail investors.",
      stock: null
    }
  ];

  // Official CSE transaction costs rates
  const FEE_RATES = {
    brokerFeePct: 0.64, // Standard retail broker fee for transaction values under LKR 100M
    cseCessPct: 0.084,  // CSE Cess
    secLevyPct: 0.072,  // SEC Levy
    cdsFeePct: 0.024,   // CDS Fee
  };

  /**
   * Calculates the transaction fees for a buying or selling order on the CSE.
   * Total fee rate: 0.64% + 0.084% + 0.072% + 0.024% = 0.82% of transaction value.
   */
  const calculateFees = (quantity, price) => {
    const value = quantity * price;
    
    // Brokerage fee (default 0.64% for simulated retail, could be negotiable for institutional but we model retail here)
    const brokerFee = value * (FEE_RATES.brokerFeePct / 100);
    const cseCess = value * (FEE_RATES.cseCessPct / 100);
    const secLevy = value * (FEE_RATES.secLevyPct / 100);
    const cdsFee = value * (FEE_RATES.cdsFeePct / 100);
    
    const totalFees = brokerFee + cseCess + secLevy + cdsFee;
    
    return {
      value: parseFloat(value.toFixed(2)),
      brokerFee: parseFloat(brokerFee.toFixed(2)),
      cseCess: parseFloat(cseCess.toFixed(2)),
      secLevy: parseFloat(secLevy.toFixed(2)),
      cdsFee: parseFloat(cdsFee.toFixed(2)),
      totalFees: parseFloat(totalFees.toFixed(2)),
      grandTotal: parseFloat((value + totalFees).toFixed(2)),
      netProceeds: parseFloat((value - totalFees).toFixed(2)) // relevant for sell order
    };
  };

  return {
    stocks,
    indices,
    news,
    FEE_RATES,
    calculateFees
  };
})();
