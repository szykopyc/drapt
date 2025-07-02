import { MainBlock } from "../baseui/MainBlock";
import { BeginText } from "../baseui/BeginText";
import { CreatePortfolioCard } from "../portfolioui/CreatePortfolioCard";

export default function CreatePortfolioPanel() {
    return (
        <MainBlock>
            <BeginText title={"Create Portfolio"}>
                <p>
                    Initialise a portfolio to be tracked by{" "}
                    <span className="text-accent font-semibold">Drapt</span>.
                </p>
            </BeginText>
            <div className="divider my-0"></div>
            <CreatePortfolioCard></CreatePortfolioCard>
        </MainBlock>
    );
}
