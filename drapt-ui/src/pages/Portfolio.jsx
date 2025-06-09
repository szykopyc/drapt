import { MainBlock } from "../components/baseui/MainBlock";
import { BeginText } from "../components/baseui/BeginText";
import { CardOne, CardTwo } from '../components/baseui/CustomCard';
import { CustomUL, CustomLI } from "../components/baseui/CustomList";

export default function Portfolio() {
    return (
        <MainBlock>
            <BeginText title={"Portfolio"}>
                <p>This is where you will be able to view, modify, and create new portfolio's for analysis.</p>
            </BeginText>
            <div className="divider my-0"></div>
            <CardOne id={"ideas"} title={"Ideas for this page"} badge={"Ideas"}>
                <p>Below are some ideas for this page.</p>
                <CustomUL>
                    <CustomLI>View your portfolios available to you.</CustomLI>
                    <CustomLI>Book, modify and remove trades on portfolios with the correct auth.</CustomLI>
                    <CustomLI>Create, modify and delete portfolios with the correct auth.</CustomLI>
                    <CustomLI>Get an overview of all teams portfolios if you are on the Executive Team.</CustomLI>
                    <CustomLI>Performance attribution by geography and region.</CustomLI>
                </CustomUL>
            </CardOne>
            <CardTwo title={"Bonus Ideas"} badge={"Bonus Ideas"}>
                <p>These features are only to be considered once core functionality of this page is achieved.</p>
                <CustomUL>
                    <CustomLI>NLP engine processing live news headlines, and telling you which portfolios may be impacted, with 5 sentiment scores (strong bullish, bullish, neutral, bearish, strong bearish).</CustomLI>
                    <CustomLI>Performance attribution, breaking down portfolio performance by asset, sector or region.</CustomLI>
                    <CustomLI>Downloadable reports.</CustomLI>
                </CustomUL>
            </CardTwo>
        </MainBlock>
    );
}