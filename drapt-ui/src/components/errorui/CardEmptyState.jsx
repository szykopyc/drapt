import InnerEmptyState from "./InnerEmptyState";
import { CardNoTitle } from "../baseui/CustomCard";
import { FaChartLine } from "react-icons/fa";

export default function CardEmptyState({
    title,
    message,
    icon = <FaChartLine className="text-4xl text-base-content/40" />,
    children,
}) {
    return (
        <CardNoTitle>
            <InnerEmptyState title={title} message={message} icon={icon}>
                {children}
            </InnerEmptyState>
        </CardNoTitle>
    );
}
