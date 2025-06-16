import { MainBlock } from "../components/baseui/MainBlock";
import { BeginText } from "../components/baseui/BeginText";
import GlobalAnalysisCard from "../components/analyseui/GlobalAnalysisCard";

export default function AnalyseIndex(){
    return (
        <MainBlock>
            <BeginText title={"Global Portfolio Analysis"}>
                <p>Please choose a portfolio to analyse.</p>
            </BeginText>
            <div className="divider my-0"></div>
            <GlobalAnalysisCard
                portfolioID={"industrials"}
                portfolioName={"Industrials"}
                portfolioType={"Equity"}
                portfolioManager={"Szymon Kopyciński"}
                portfolioCreationDate={"14/06/2025"}
                portfolioLastModified={"14/06/2025"}
                currentPortfolioValue={3300}
                portfolio1MChange={3.1}
                portfolio1MVolatility={14.56}
                portfolioHoldingsNumber={12}
            />
            <GlobalAnalysisCard
                portfolioID={"technology"}
                portfolioName={"Technology"}
                portfolioType={"Equity"}
                portfolioManager={"Alex Nowak"}
                portfolioCreationDate={"10/05/2025"}
                portfolioLastModified={"13/06/2025"}
                currentPortfolioValue={4200}
                portfolio1MChange={4.8}
                portfolio1MVolatility={16.23}
                portfolioHoldingsNumber={15}
            />
            <GlobalAnalysisCard
                portfolioID={"fixedincome"}
                portfolioName={"Fixed Income"}
                portfolioType={"Bond"}
                portfolioManager={"Maria Kowalska"}
                portfolioCreationDate={"01/04/2025"}
                portfolioLastModified={"12/06/2025"}
                currentPortfolioValue={2750}
                portfolio1MChange={1.2}
                portfolio1MVolatility={7.89}
                portfolioHoldingsNumber={8}
            />
            <GlobalAnalysisCard
                portfolioID={"emergingmarkets"}
                portfolioName={"Emerging Markets"}
                portfolioType={"Equity"}
                portfolioManager={"John Smith"}
                portfolioCreationDate={"22/03/2025"}
                portfolioLastModified={"14/06/2025"}
                currentPortfolioValue={3900}
                portfolio1MChange={5.3}
                portfolio1MVolatility={18.11}
                portfolioHoldingsNumber={14}
            />
            <GlobalAnalysisCard
                portfolioID={"realestate"}
                portfolioName={"Real Estate"}
                portfolioType={"REIT"}
                portfolioManager={"Anna Zielińska"}
                portfolioCreationDate={"15/02/2025"}
                portfolioLastModified={"13/06/2025"}
                currentPortfolioValue={5100}
                portfolio1MChange={2.7}
                portfolio1MVolatility={10.45}
                portfolioHoldingsNumber={10}
            />
        </MainBlock>
    );
}