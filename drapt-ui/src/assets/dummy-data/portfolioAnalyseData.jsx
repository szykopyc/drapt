import { dummyGlobalPortfolios } from "./tableData";
import { dummyPerformance, dummyDualChart } from "./chartData";

const portfolioAnalyseData = dummyGlobalPortfolios.map((portfolio) => ({
    portfolioID: portfolio.portfolioID,
    portfolioReturn: `${(Math.random() * 10 - 5).toFixed(2)}%`,
    portfolioBenchmarkComparison: dummyDualChart,
    portfolioSharpeMetric: (Math.random() * 1.5 + 0.5).toFixed(2),
    portfolioBeta: (Math.random() * 1 + 0.5).toFixed(2),
    portfolioSortinoMetric: (Math.random() * 1.5 + 0.5).toFixed(2),
    portfolioTreynorMetric: (Math.random() * 0.5 + 0.5).toFixed(2),
    portfolioPerformanceChart: dummyPerformance,
    portfolioMaxDrawdown: `${(Math.random() * -10).toFixed(2)}%`,
    portfolioAlpha: `${(Math.random() * 2 - 1).toFixed(2)}`,
    portfolioVaR95: `${(Math.random() * -2 - 1).toFixed(2)}%`,
    portfolioVaR99: `${(Math.random() * -3 - 2).toFixed(2)}%`,
    portfolioCVaR95: `${(Math.random() * -3 - 3).toFixed(2)}%`,
}));

export default portfolioAnalyseData;
