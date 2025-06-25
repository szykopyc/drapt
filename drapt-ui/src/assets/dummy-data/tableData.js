export const dummyUserTableData = [
  // Executive Team (7 people: 2 Directors, 4 Vice Directors, 1 Developer)
  {
    id: 1,
    fullName: "Alice Director",
    username: "alicedirector",
    email: "alice.director@example.com",
    role: "Director",
    team: "Executive"
  },
  {
    id: 2,
    fullName: "Bob Director",
    username: "bobdirector",
    email: "bob.director@example.com",
    role: "Director",
    team: "Executive"
  },
  {
    id: 3,
    fullName: "Carol Vice Director",
    username: "carolvicedir",
    email: "carol.vd@example.com",
    role: "Vice Director",
    team: "Executive"
  },
  {
    id: 4,
    fullName: "David Vice Director",
    username: "davidvicedir",
    email: "david.vd@example.com",
    role: "Vice Director",
    team: "Executive"
  },
  {
    id: 5,
    fullName: "Eve Vice Director",
    username: "evevicedir",
    email: "eve.vd@example.com",
    role: "Vice Director",
    team: "Executive"
  },
  {
    id: 6,
    fullName: "Frank Vice Director",
    username: "frankvicedir",
    email: "frank.vd@example.com",
    role: "Vice Director",
    team: "Executive"
  },
  {
    id: 7,
    fullName: "Szymon Kopycinski",
    username: "szykopyc",
    email: "szymon@email.com",
    role: "Developer",
    team: "Executive"
  },

  // Managers (1 per team)
  {
    id: 8,
    fullName: "Ben Rayson",
    username: "benrayson",
    email: "ben.rayson@example.com",
    role: "Manager",
    team: "Industrial"
  },
  {
    id: 9,
    fullName: "Henry Manager",
    username: "henrymanager",
    email: "henry.manager@example.com",
    role: "Manager",
    team: "TMT"
  },
  {
    id: 10,
    fullName: "Ivy Manager",
    username: "ivymanager",
    email: "ivy.manager@example.com",
    role: "Manager",
    team: "Europe"
  },
  {
    id: 11,
    fullName: "Jack Manager",
    username: "jackmanager",
    email: "jack.manager@example.com",
    role: "Manager",
    team: "US & Canada"
  },
  {
    id: 12,
    fullName: "Kate Manager",
    username: "katemanager",
    email: "kate.manager@example.com",
    role: "Manager",
    team: "Metals, Mining and Commodities"
  }
]

export const dummyPortfolioMetrics = [
  { Metric: "Daily Portfolio Change (%)", Value: "+0.42%" },
  { Metric: "Sharpe Ratio", Value: "1.37" },
  { Metric: "Sortino Ratio", Value: "1.85" },
  { Metric: "VaR 95", Value: "-2.10%" },
  { Metric: "VaR 99", Value: "-3.45%" },
  { Metric: "Max Drawdown", Value: "-7.8%" },
  { Metric: "Alpha", Value: "+0.18" },
  { Metric: "Beta", Value: "0.92" }
];

export const dummyNews = [
  {
    Portfolio: "Industrials",
    Headline: "Major Steel Producer Announces Plant Expansion in Midwest",
    Date: "2025-06-01"
  },
  {
    Portfolio: "Industrials",
    Headline: "Global Chip Shortage Eases, Boosting Manufacturing Output",
    Date: "2025-05-28"
  },
  {
    Portfolio: "Industrials",
    Headline: "US Government Approves $2B Infrastructure Grant for Rail Upgrades",
    Date: "2025-05-25"
  },
  {
    Portfolio: "Industrials",
    Headline: "Industrial Robotics Firm Unveils Next-Gen Automation Platform",
    Date: "2025-05-20"
  },
  {
    Portfolio: "Industrials",
    Headline: "Energy Prices Surge Amid Supply Chain Disruptions",
    Date: "2025-05-18"
  },
  {
    Portfolio: "Industrials",
    Headline: "Major Auto Manufacturer Reports Record Q1 Profits",
    Date: "2025-05-15"
  },
  {
    Portfolio: "Industrials",
    Headline: "Union Workers at Key Factory Vote to End Strike",
    Date: "2025-05-12"
  },
  {
    Portfolio: "Industrials",
    Headline: "New Environmental Regulations Impact Chemical Producers",
    Date: "2025-05-10"
  },
  {
    Portfolio: "Industrials",
    Headline: "Industrial Equipment Orders Rise Sharply in April",
    Date: "2025-05-08"
  },
  {
    Portfolio: "Industrials",
    Headline: "Leading Construction Firm Wins $500M Bridge Contract",
    Date: "2025-05-05"
  },
  {
    Portfolio: "Industrials",
    Headline: "Copper Prices Hit 3-Year High on Strong Demand",
    Date: "2025-05-03"
  },
  {
    Portfolio: "Industrials",
    Headline: "Major Logistics Company Expands Fleet with Electric Trucks",
    Date: "2025-05-01"
  },
  {
    Portfolio: "Industrials",
    Headline: "Factory Output in Asia Rebounds After Slowdown",
    Date: "2025-04-28"
  },
  {
    Portfolio: "Industrials",
    Headline: "Industrial Sector M&A Activity Hits Record Levels",
    Date: "2025-04-25"
  },
  {
    Portfolio: "Industrials",
    Headline: "New Tariffs Announced on Imported Machinery",
    Date: "2025-04-22"
  },
  {
    Portfolio: "Industrials",
    Headline: "Major Pipeline Project Receives Final Approval",
    Date: "2025-04-20"
  },
  {
    Portfolio: "Industrials",
    Headline: "Labor Costs Increase as Minimum Wage Rises",
    Date: "2025-04-18"
  },
  {
    Portfolio: "Industrials",
    Headline: "Industrial Conglomerate Launches Sustainability Initiative",
    Date: "2025-04-15"
  },
  {
    Portfolio: "Industrials",
    Headline: "Power Grid Upgrades Lead to Temporary Factory Shutdowns",
    Date: "2025-04-12"
  },
  {
    Portfolio: "Industrials",
    Headline: "Major Port Expansion to Boost Export Capacity",
    Date: "2025-04-10"
  }
];

export const dummyPortfolioActions = [
  {
    ticker: "CAT",
    action: "BUY",
    quantity: 10,
    price: 250.00,
    date: "2024-06-01"
  },
  {
    ticker: "HON",
    action: "SELL",
    quantity: 5,
    price: 210.50,
    date: "2024-06-03"
  },
  {
    ticker: "GE",
    action: "BUY",
    quantity: 20,
    price: 160.75,
    date: "2024-06-05"
  },
  {
    ticker: "MMM",
    action: "BUY",
    quantity: 15,
    price: 105.30,
    date: "2024-06-07"
  },
  {
    ticker: "DE",
    action: "SELL",
    quantity: 8,
    price: 390.00,
    date: "2024-06-09"
  },
  {
    ticker: "LMT",
    action: "BUY",
    quantity: 12,
    price: 450.20,
    date: "2024-06-11"
  },
  {
    ticker: "BA",
    action: "SELL",
    quantity: 7,
    price: 210.10,
    date: "2024-06-13"
  },
  {
    ticker: "RTX",
    action: "BUY",
    quantity: 18,
    price: 98.40,
    date: "2024-06-14"
  },
  {
    ticker: "UNP",
    action: "BUY",
    quantity: 9,
    price: 230.00,
    date: "2024-06-15"
  },
  {
    ticker: "UPS",
    action: "SELL",
    quantity: 6,
    price: 170.25,
    date: "2024-06-16"
  },
  {
    ticker: "CSX",
    action: "BUY",
    quantity: 14,
    price: 34.10,
    date: "2024-06-17"
  },
  {
    ticker: "FDX",
    action: "BUY",
    quantity: 11,
    price: 265.00,
    date: "2024-06-18"
  },
  {
    ticker: "EMR",
    action: "SELL",
    quantity: 13,
    price: 105.50,
    date: "2024-06-19"
  },
  {
    ticker: "GD",
    action: "BUY",
    quantity: 10,
    price: 230.75,
    date: "2024-06-20"
  },
  {
    ticker: "NOC",
    action: "SELL",
    quantity: 8,
    price: 470.00,
    date: "2024-06-21"
  },
  {
    ticker: "CAT",
    action: "BUY",
    quantity: 10,
    price: 250.00,
    date: "2024-06-01"
  },
  {
    ticker: "HON",
    action: "SELL",
    quantity: 5,
    price: 210.50,
    date: "2024-06-03"
  },
  {
    ticker: "GE",
    action: "BUY",
    quantity: 20,
    price: 160.75,
    date: "2024-06-05"
  },
  {
    ticker: "MMM",
    action: "BUY",
    quantity: 15,
    price: 105.30,
    date: "2024-06-07"
  },
  {
    ticker: "DE",
    action: "SELL",
    quantity: 8,
    price: 390.00,
    date: "2024-06-09"
  },
  {
    ticker: "LMT",
    action: "BUY",
    quantity: 12,
    price: 450.20,
    date: "2024-06-11"
  },
  {
    ticker: "BA",
    action: "SELL",
    quantity: 7,
    price: 210.10,
    date: "2024-06-13"
  },
  {
    ticker: "RTX",
    action: "BUY",
    quantity: 18,
    price: 98.40,
    date: "2024-06-14"
  },
  {
    ticker: "UNP",
    action: "BUY",
    quantity: 9,
    price: 230.00,
    date: "2024-06-15"
  },
  {
    ticker: "UPS",
    action: "SELL",
    quantity: 6,
    price: 170.25,
    date: "2024-06-16"
  },
  {
    ticker: "CSX",
    action: "BUY",
    quantity: 14,
    price: 34.10,
    date: "2024-06-17"
  },
  {
    ticker: "FDX",
    action: "BUY",
    quantity: 11,
    price: 265.00,
    date: "2024-06-18"
  },
  {
    ticker: "EMR",
    action: "SELL",
    quantity: 13,
    price: 105.50,
    date: "2024-06-19"
  },
  {
    ticker: "GD",
    action: "BUY",
    quantity: 10,
    price: 230.75,
    date: "2024-06-20"
  },
  {
    ticker: "NOC",
    action: "SELL",
    quantity: 8,
    price: 470.00,
    date: "2024-06-21"
  },
  // --- Additional 10 actions below ---
  {
    ticker: "PH",
    action: "BUY",
    quantity: 16,
    price: 520.30,
    date: "2024-06-22"
  },
  {
    ticker: "ITW",
    action: "SELL",
    quantity: 9,
    price: 245.60,
    date: "2024-06-23"
  },
  {
    ticker: "ETN",
    action: "BUY",
    quantity: 13,
    price: 310.10,
    date: "2024-06-24"
  },
  {
    ticker: "ROK",
    action: "SELL",
    quantity: 7,
    price: 285.40,
    date: "2024-06-25"
  },
  {
    ticker: "PCAR",
    action: "BUY",
    quantity: 12,
    price: 105.90,
    date: "2024-06-26"
  },
  {
    ticker: "FAST",
    action: "SELL",
    quantity: 15,
    price: 65.20,
    date: "2024-06-27"
  },
  {
    ticker: "GWW",
    action: "BUY",
    quantity: 6,
    price: 950.00,
    date: "2024-06-28"
  },
  {
    ticker: "IR",
    action: "SELL",
    quantity: 10,
    price: 88.30,
    date: "2024-06-29"
  },
  {
    ticker: "XYL",
    action: "BUY",
    quantity: 11,
    price: 140.75,
    date: "2024-06-30"
  },
  {
    ticker: "DOV",
    action: "SELL",
    quantity: 8,
    price: 170.60,
    date: "2024-07-01"
  }
];

export const dummyRecentOrders = [
  {
    ticker: "CAT",
    action: "BUY",
    orderStatus: "PENDING",
    quantity: 10,
    price: 250.00,
    date: "2024-06-01"
  },
  {
    ticker: "HON",
    action: "SELL",
    orderStatus: "PENDING",
    quantity: 5,
    price: 210.50,
    date: "2024-06-03"
  },
  {
    ticker: "GE",
    action: "BUY",
    orderStatus: "PENDING",
    quantity: 20,
    price: 160.75,
    date: "2024-06-05"
  },
  {
    ticker: "MMM",
    action: "BUY",
    orderStatus: "EXECUTED",
    quantity: 15,
    price: 105.30,
    date: "2024-06-07"
  },
  {
    ticker: "DE",
    action: "SELL",
    orderStatus: "EXECUTED",
    quantity: 8,
    price: 390.00,
    date: "2024-06-09"
  },
  {
    ticker: "LMT",
    action: "BUY",
    orderStatus: "EXECUTED",
    quantity: 12,
    price: 450.20,
    date: "2024-06-11"
  },
  {
    ticker: "BA",
    action: "SELL",
    orderStatus: "EXECUTED",
    quantity: 7,
    price: 210.10,
    date: "2024-06-13"
  },
  {
    ticker: "RTX",
    action: "BUY",
    orderStatus: "EXECUTED",
    quantity: 18,
    price: 98.40,
    date: "2024-06-14"
  },
  {
    ticker: "UNP",
    action: "BUY",
    orderStatus: "EXECUTED",
    quantity: 9,
    price: 230.00,
    date: "2024-06-15"
  },
  {
    ticker: "UPS",
    action: "SELL",
    orderStatus: "EXECUTED",
    quantity: 6,
    price: 170.25,
    date: "2024-06-16"
  },
  {
    ticker: "CSX",
    action: "BUY",
    orderStatus: "EXECUTED",
    quantity: 14,
    price: 34.10,
    date: "2024-06-17"
  },
  {
    ticker: "FDX",
    action: "BUY",
    orderStatus: "EXECUTED",
    quantity: 11,
    price: 265.00,
    date: "2024-06-18"
  },
  {
    ticker: "EMR",
    action: "SELL",
    orderStatus: "EXECUTED",
    quantity: 13,
    price: 105.50,
    date: "2024-06-19"
  },
  {
    ticker: "GD",
    action: "BUY",
    orderStatus: "EXECUTED",
    quantity: 10,
    price: 230.75,
    date: "2024-06-20"
  },
  {
    ticker: "NOC",
    action: "SELL",
    orderStatus: "EXECUTED",
    quantity: 8,
    price: 470.00,
    date: "2024-06-21"
  },
  {
    ticker: "CAT",
    action: "BUY",
    orderStatus: "PENDING",
    quantity: 10,
    price: 250.00,
    date: "2024-06-01"
  },
  {
    ticker: "HON",
    action: "SELL",
    orderStatus: "PENDING",
    quantity: 5,
    price: 210.50,
    date: "2024-06-03"
  },
  {
    ticker: "GE",
    action: "BUY",
    orderStatus: "PENDING",
    quantity: 20,
    price: 160.75,
    date: "2024-06-05"
  },
  {
    ticker: "MMM",
    action: "BUY",
    orderStatus: "EXECUTED",
    quantity: 15,
    price: 105.30,
    date: "2024-06-07"
  },
  {
    ticker: "DE",
    action: "SELL",
    orderStatus: "EXECUTED",
    quantity: 8,
    price: 390.00,
    date: "2024-06-09"
  },
  {
    ticker: "LMT",
    action: "BUY",
    orderStatus: "EXECUTED",
    quantity: 12,
    price: 450.20,
    date: "2024-06-11"
  },
  {
    ticker: "BA",
    action: "SELL",
    orderStatus: "EXECUTED",
    quantity: 7,
    price: 210.10,
    date: "2024-06-13"
  },
  {
    ticker: "RTX",
    action: "BUY",
    orderStatus: "EXECUTED",
    quantity: 18,
    price: 98.40,
    date: "2024-06-14"
  },
  {
    ticker: "UNP",
    action: "BUY",
    orderStatus: "EXECUTED",
    quantity: 9,
    price: 230.00,
    date: "2024-06-15"
  },
  {
    ticker: "UPS",
    action: "SELL",
    orderStatus: "EXECUTED",
    quantity: 6,
    price: 170.25,
    date: "2024-06-16"
  },
  {
    ticker: "CSX",
    action: "BUY",
    orderStatus: "EXECUTED",
    quantity: 14,
    price: 34.10,
    date: "2024-06-17"
  },
  {
    ticker: "FDX",
    action: "BUY",
    orderStatus: "EXECUTED",
    quantity: 11,
    price: 265.00,
    date: "2024-06-18"
  },
  {
    ticker: "EMR",
    action: "SELL",
    orderStatus: "EXECUTED",
    quantity: 13,
    price: 105.50,
    date: "2024-06-19"
  },
  {
    ticker: "GD",
    action: "BUY",
    orderStatus: "EXECUTED",
    quantity: 10,
    price: 230.75,
    date: "2024-06-20"
  },
  {
    ticker: "NOC",
    action: "SELL",
    orderStatus: "EXECUTED",
    quantity: 8,
    price: 470.00,
    date: "2024-06-21"
  },
  {
    ticker: "PH",
    action: "BUY",
    orderStatus: "EXECUTED",
    quantity: 16,
    price: 520.30,
    date: "2024-06-22"
  },
  {
    ticker: "ITW",
    action: "SELL",
    orderStatus: "EXECUTED",
    quantity: 9,
    price: 245.60,
    date: "2024-06-23"
  },
  {
    ticker: "ETN",
    action: "BUY",
    orderStatus: "EXECUTED",
    quantity: 13,
    price: 310.10,
    date: "2024-06-24"
  },
  {
    ticker: "ROK",
    action: "SELL",
    orderStatus: "EXECUTED",
    quantity: 7,
    price: 285.40,
    date: "2024-06-25"
  },
  {
    ticker: "PCAR",
    action: "BUY",
    orderStatus: "EXECUTED",
    quantity: 12,
    price: 105.90,
    date: "2024-06-26"
  },
  {
    ticker: "FAST",
    action: "SELL",
    orderStatus: "EXECUTED",
    quantity: 15,
    price: 65.20,
    date: "2024-06-27"
  },
  {
    ticker: "GWW",
    action: "BUY",
    orderStatus: "EXECUTED",
    quantity: 6,
    price: 950.00,
    date: "2024-06-28"
  },
  {
    ticker: "IR",
    action: "SELL",
    orderStatus: "EXECUTED",
    quantity: 10,
    price: 88.30,
    date: "2024-06-29"
  },
  {
    ticker: "XYL",
    action: "BUY",
    orderStatus: "EXECUTED",
    quantity: 11,
    price: 140.75,
    date: "2024-06-30"
  },
  {
    ticker: "DOV",
    action: "SELL",
    orderStatus: "EXECUTED",
    quantity: 8,
    price: 170.60,
    date: "2024-07-01"
  }
];

export const dummyPositionMonitoringTable = [
  {
    positionID: 0o1,
    positionTicker: "AVAV",
    positionQuantity: 13,
    entryPrice: 57.89,
    currentPrice: 67.64,
    positionPnLNominal: 9.74,
    positionPnLPercentage: 0.1682,
    positionStatus: "Open",
    positionEntryDate: "2025-06-20"
  },
  {
    positionID: 0o2,
    positionTicker: "AAPL",
    positionQuantity: 25,
    entryPrice: 145.20,
    currentPrice: 158.30,
    positionPnLNominal: 326.25,
    positionPnLPercentage: 0.0901,
    positionStatus: "Open",
    positionEntryDate: "2025-06-19"
  },
  {
    positionID: 0o3,
    positionTicker: "TSLA",
    positionQuantity: 10,
    entryPrice: 700.00,
    currentPrice: 650.00,
    positionPnLNominal: -500.00,
    positionPnLPercentage: -0.0714,
    positionStatus: "Open",
    positionEntryDate: "2025-06-18"
  },
  {
    positionID: 0o4,
    positionTicker: "MSFT",
    positionQuantity: 18,
    entryPrice: 250.00,
    currentPrice: 265.50,
    positionPnLNominal: 279.00,
    positionPnLPercentage: 0.062,
    positionStatus: "Open",
    positionEntryDate: "2025-06-17"
  },
  {
    positionID: 0o5,
    positionTicker: "NFLX",
    positionQuantity: 7,
    entryPrice: 500.00,
    currentPrice: 495.00,
    positionPnLNominal: -35.00,
    positionPnLPercentage: -0.01,
    positionStatus: "Closed",
    positionEntryDate: "2025-06-16"
  },
    {
    positionID: 0o7,
    positionTicker: "AMZN",
    positionQuantity: 5,
    entryPrice: 3300.00,
    currentPrice: 3200.00,
    positionPnLNominal: -500.00,
    positionPnLPercentage: -0.0303,
    positionStatus: "Closed",
    positionEntryDate: "2025-06-14"
  },
  {
    positionID: 1,
    positionTicker: "NVDA",
    positionQuantity: 20,
    entryPrice: 600.00,
    currentPrice: 650.00,
    positionPnLNominal: 1000.00,
    positionPnLPercentage: 0.0833,
    positionStatus: "Closed",
    positionEntryDate: "2025-06-13"
  },
  {
    positionID: 11,
    positionTicker: "BABA",
    positionQuantity: 15,
    entryPrice: 200.00,
    currentPrice: 180.00,
    positionPnLNominal: -300.00,
    positionPnLPercentage: -0.10,
    positionStatus: "Closed",
    positionEntryDate: "2025-06-12"
  }
]

export const dummyGlobalPortfolios = [
  {
    portfolioID: "industrial",
    portfolioName: "Industrial",
    portfolioType: "Equity",
    portfolioManager: "Szymon Kopyciński",
    portfolioCreationDate: "14/06/2025",
    portfolioLastModified: "14/06/2025",
    currentPortfolioValue: 3300,
    portfolio1MChange: 3.1,
    portfolio1MVolatility: 14.56,
    portfolioHoldingsNumber: 12
  },
  {
    portfolioID: "technology",
    portfolioName: "Technology",
    portfolioType: "Equity",
    portfolioManager: "Alex Nowak",
    portfolioCreationDate: "10/05/2025",
    portfolioLastModified: "13/06/2025",
    currentPortfolioValue: 4200,
    portfolio1MChange: 4.8,
    portfolio1MVolatility: 16.23,
    portfolioHoldingsNumber: 15
  },
  {
    portfolioID: "fixedincome",
    portfolioName: "Fixed Income",
    portfolioType: "Bond",
    portfolioManager: "Maria Kowalska",
    portfolioCreationDate: "01/04/2025",
    portfolioLastModified: "12/06/2025",
    currentPortfolioValue: 2750,
    portfolio1MChange: 1.2,
    portfolio1MVolatility: 7.89,
    portfolioHoldingsNumber: 8
  },
  {
    portfolioID: "emergingmarkets",
    portfolioName: "Emerging Markets",
    portfolioType: "Equity",
    portfolioManager: "John Maynard Keynes",
    portfolioCreationDate: "22/03/2025",
    portfolioLastModified: "14/06/2025",
    currentPortfolioValue: 3900,
    portfolio1MChange: 5.3,
    portfolio1MVolatility: 18.11,
    portfolioHoldingsNumber: 14
  },
  {
    portfolioID: "realestate",
    portfolioName: "Real Estate",
    portfolioType: "REIT",
    portfolioManager: "Anna Zielińska",
    portfolioCreationDate: "15/02/2025",
    portfolioLastModified: "13/06/2025",
    currentPortfolioValue: 5100,
    portfolio1MChange: 2.7,
    portfolio1MVolatility: 10.45,
    portfolioHoldingsNumber: 10
  },
  // --- New dummy portfolios below ---
  {
    portfolioID: "healthcare",
    portfolioName: "Healthcare",
    portfolioType: "Equity",
    portfolioManager: "Lucas Müller",
    portfolioCreationDate: "05/03/2025",
    portfolioLastModified: "13/06/2025",
    currentPortfolioValue: 3700,
    portfolio1MChange: 2.9,
    portfolio1MVolatility: 12.34,
    portfolioHoldingsNumber: 11
  },
  {
    portfolioID: "energy",
    portfolioName: "Energy",
    portfolioType: "Equity",
    portfolioManager: "Jim Simons",
    portfolioCreationDate: "28/01/2025",
    portfolioLastModified: "12/06/2025",
    currentPortfolioValue: 4600,
    portfolio1MChange: 3.7,
    portfolio1MVolatility: 15.22,
    portfolioHoldingsNumber: 13
  },
  {
    portfolioID: "consumerstaples",
    portfolioName: "Consumer Staples",
    portfolioType: "Equity",
    portfolioManager: "Thomas Dubois",
    portfolioCreationDate: "18/02/2025",
    portfolioLastModified: "13/06/2025",
    currentPortfolioValue: 3400,
    portfolio1MChange: 1.8,
    portfolio1MVolatility: 9.87,
    portfolioHoldingsNumber: 9
  }
]