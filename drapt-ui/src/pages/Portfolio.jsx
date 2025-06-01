import MainCard from "../components/dashboardui/MainCard";
import MetricCard from "../components/dashboardui/MetricCard";
import { MainBlock } from "../components/baseui/MainBlock";
import { BeginText } from "../components/baseui/BeginText";
import { CardOne, CardTwo } from '../components/baseui/CustomCard';

export default function Portfolio() {
    return (
        <MainBlock>
            <BeginText title={"Portfolio"}>
                <p>This is where you will be able to view, modify, and create new portfolios for analysis.</p>
            </BeginText>
            <div className="divider my-1"></div>
            <CardOne id={"undercreation"} title={"This page is under development."}>
                <p>This section is under development.</p>
            </CardOne>
        </MainBlock>
    );
}