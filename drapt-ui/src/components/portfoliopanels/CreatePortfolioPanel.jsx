import MainBlock from "../layout/MainBlock";
import { BeginText } from "../baseui/BeginText";
import { CreatePortfolioCard } from "../portfolioui/CreatePortfolioCard";
import { Toaster } from "react-hot-toast";

export default function CreatePortfolioPanel() {
    return (
        <MainBlock>
            <BeginText title={"Initialise Portfolio"}>
                <p>
                    Initialise a portfolio to be tracked by{" "}
                    <span className="text-accent font-semibold">Drapt</span>.
                    This is only the initial portfolio setup, afterwards finish
                    the setup in Portfolio Administration.
                </p>
            </BeginText>
            <div className="divider my-0"></div>
            <CreatePortfolioCard></CreatePortfolioCard>
            <Toaster />
        </MainBlock>
    );
}
