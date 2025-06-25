import { CardOne } from "../baseui/CustomCard";
import CustomButton from "../baseui/CustomButton";

export default function GlobalAnalysisCard({
    portfolioID,
    portfolioName,
    portfolioManager,
}) {
    return (
        <CardOne title={portfolioName}>
            <table className="w-full text-left">
                <colgroup>
                    <col className="w-1/2 md:w-[20%]" />
                    <col className="w-1/2 md:w-[80%]" />
                </colgroup>
                <tbody className="align-top">
                    <tr>
                        <td>Manager</td>
                        <td className="font-semibold">{portfolioManager}</td>
                    </tr>
                </tbody>
            </table>
            <CustomButton to={`/analyse/${portfolioID}`}>
                Analyse {portfolioName}
            </CustomButton>
        </CardOne>
    );
}
