import { dummyGlobalPortfolios } from "./tableData";
import { dummyPerformance, dummyDualChart } from "./chartData";

const portfolioAnalyseData = dummyGlobalPortfolios.map((portfolio) => ({
    portfolioID: portfolio.portfolioID,
    portfolioReturn: `${(Math.random() * 10 - 5).toFixed(2)}%`, // Random return between -5% and +5%
    portfolioBenchmarkComparison: dummyDualChart, // Use dummyDualChart for comparison
    portfolioSharpeMetric: (Math.random() * 1.5 + 0.5).toFixed(2), // Random Sharpe ratio between 0.5 and 2
    portfolioBeta: (Math.random() * 1 + 0.5).toFixed(2), // Random Beta between 0.5 and 1.5
    portfolioSortinoMetric: (Math.random() * 1.5 + 0.5).toFixed(2), // Random Sortino ratio between 0.5 and 2
    portfolioTreynorMetric: (Math.random() * 0.5 + 0.5).toFixed(2), // Random Treynor ratio between 0.5 and 1
    portfolioPerformanceChart: dummyPerformance, // Use dummyPerformance for performance chart
    portfolioMaxDrawdown: `${(Math.random() * -10).toFixed(2)}%`, // Random drawdown between -0% and -10%
    portfolioAlpha: `${(Math.random() * 2 - 1).toFixed(2)}`, // Random Alpha between -1 and +1
    portfolioVaR95: `${(Math.random() * -2 - 1).toFixed(2)}%`, // Random VaR 95 between -3% and -1%
    portfolioVaR99: `${(Math.random() * -3 - 2).toFixed(2)}%`, // Random VaR 99 between -5% and -2%
    portfolioCVaR95: `${(Math.random() * -3 - 3).toFixed(2)}%`, // Random CVaR 95 between -6% and -3%
}));

export default portfolioAnalyseData;
