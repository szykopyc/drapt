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
            <CardOne id={"portfolioScope"} title={"Portfolio Scope"} badge={"Core"}>
                <p>View your portfolio's from a high-level.</p>
            </CardOne>
            <CardOne id={"tradeBooker"} title={"Trade Booker"} badge={"Core"}>
                <p>Book, modify, and remove trades on portfolio's you have authorisation to modify.</p>
            </CardOne>
            <CardOne id={"portfolioAdmin"} title={"Portfolio Administration"} badge={"Core"}>
                <p>Create, modify, and delete portfolio's if you have the correct authorisation.</p>
                <p>Upload and export portfolio's in CSV file format.</p>
            </CardOne>
            <CardTwo id={"nlpNews"} title={"NLPNews Engine"} badge={"Bonus"}>
                <p>Natural Language Proccessing Engine giving you key insights regarding how top news headlines will affect your portfolio's.</p>
            </CardTwo>
        </MainBlock>
    );
}