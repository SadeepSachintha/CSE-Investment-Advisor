---
title: CSE Investment Advisor by SS Labz
emoji: 📈
colorFrom: indigo
colorTo: blue
sdk: static
pinned: false
---

<div align="center">
  
  # 📈 Colombo Stock Exchange (CSE) Investment Advisor by SS Labz
  
  [![Hugging Face Space](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-Space-indigo)](https://huggingface.co/spaces/dwssp/cse-investment-advisor)
  [![Platform: Web](https://img.shields.io/badge/Platform-Static%20Web-cyan)](#)
  [![Stack: HTML5%20%7C%20CSS3%20%7C%20JS](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20JS-blue)](#)
  [![License: MIT](https://img.shields.io/badge/License-MIT-emerald)](#)

  **A state-of-the-art interactive virtual trading sandbox, statutory commission calculator, and AI-powered financial advisor for Sri Lankan equity markets. Developed and branded by SS Labz.**
  
  [**Live Hugging Face Space Demonstration**](https://huggingface.co/spaces/dwssp/cse-investment-advisor)

</div>

---

## 🌟 Application Core Views

### 1. 📊 Live Market Pulse (Dashboard)
- **Indices Sparklines**: Intraday index tracking for the benchmark **ASPI (All Share Price Index)** and the blue-chip **S&P SL20** using Chart.js canvases.
- **Movers Leaderboards**: Live lists ranking the top 4 **Gainers**, **Losers**, and **Most Active** counters.
- **Session Timers**: Clock indicator tracking the official CSE trading hours (09:30 AM to 02:30 PM, Mon-Fri) showing session status countdowns.
- **News Stream**: Instant feed tracking disclosures, quarterly profits, and macroeconomic catalysts.

### 2. 🔍 GICS Stock Explorer
- Pre-populated, high-fidelity metrics database of the **16 highest liquid blue-chips** across capital goods, utilities, diversified financials, telecommunications, food retailing, and banking.
- Interactive keyword searches, GICS sector filters, and multi-variable sorting (P/E ratio, Dividend yield, Market capitalization).
- **Technical Drawer Popups**: Renders a 30-day interactive historical price line-chart, corporate profiling summary, and valuation ratios.

### 3. 💼 Virtual Trading Portfolio
- Loaded with a default persistent balance of **LKR 1,000,000.00** in virtual trading capital.
- Tracks real-time valuation of held equities, total costs, portfolio worth, and unrealized profit/loss percentages.
- **Sector Diversification Doughnut Chart**: Interactive risk assessment breaking down exposure ratios across diverse industries.
- **Local Persistence**: All purchases, average cost basis metrics, sales, and capital balances are stored directly in `localStorage` to endure hard page reloads.

### 4. 💬 "Ariya" AI Financial Assistant
- High-fidelity conversational chatbot interface geared with quantitative Sri Lankan market intelligence.
- **Quick Action Commands**:
  - `Evaluate My Portfolio`: Performs mathematical evaluations of your assets (risk Beta, sector concentration alerts, average yields).
  - `Find Dividend Stars`: Filters the database to isolate robust dividend-paying counters.
  - `Value Investing Screen`: Graham-style screening (P/E < 10x, Beta < 1.1x, P/BV < 1.2x).
  - `Market Outlook`: Dynamic macroeconomic updates regarding policy rates, IMF, and debt restructures.
- Mentions of tickers (e.g. `"JKH"`, `"COMB"`, `"LOLC"`) trigger automated individual counter briefs and advisor recommendations.

### 5. 🧮 Statutory Brokerage Calculator
- Models exact statutory transaction charges enforced on the CSE (totaling **0.82%** of volume on either entry or exit trades):
  * **Brokerage Commission**: 0.640%
  * **CSE Cess**: 0.084%
  * **SEC Levy**: 0.072%
  * **CDS Fee**: 0.024%
- Includes a **Break-Even Spread Analyzer**, highlighting the minimum target appreciation percentage required to secure positive net returns.

---

## 🛠️ File Structure

The project has been organized with clean separation of concerns:

- `index.html`: Semantic SPA document with all layout placeholders, chat bubbles, standalone calculator inputs, and detail panels.
- `style.css`: Glassmorphic styling system detailing linear indigo/cyan animations, glow filters, scrollbars, and grids.
- `data.js`: Central seed database of stock listings, historical data points, fee ratios, news stories, and transaction formulas.
- `advisor.js`: Conversational financial advisory scanner, screener algorithms, and macro outlook logs.
- `app.js`: Dynamic controller managing browser local storage syncs, router binds, input event listeners, and Chart.js animations.

---

## ⚡ Deployment & Git Management

Since your workspace is linked to both **GitHub** and **Hugging Face Spaces**, you can push updates to both platforms seamlessly using these local terminal commands:

### Pushing to GitHub
```powershell
git add .
git commit -m "docs: expand README with comprehensive educational guide and badges"
git push origin main
```

### Deploying to Hugging Face Spaces
```powershell
git push -f hf main
```

---

## 📖 Sri Lankan Capital Markets Guide

*   **ASPI (All Share Price Index)**: Measures the price movements of all listed shares on the CSE. It is market capitalization-weighted.
*   **S&P SL20**: Contains the 20 largest and most liquid companies listed on the CSE, representing the elite tier of Sri Lankan corporates.
*   **Broker Commission Schedules**: For retail transactions under LKR 100 Million, standard brokerage charges are fixed at **0.640%**. For transactions over LKR 100 Million, commissions are negotiable.
*   **T+3 Settlement**: Buying shares reserves them in your Central Depository Systems (CDS) account, but financial settlement concludes 3 working days after the transaction date.
