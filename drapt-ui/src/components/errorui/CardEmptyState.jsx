import InnerEmptyState from "./InnerEmptyState";
import { CardNoTitle } from "../baseui/CustomCard";

export default function CardEmptyState({ title, message, children }) {
    return (
        <CardNoTitle>
            <InnerEmptyState title={title} message={message}>
                {children}
            </InnerEmptyState>
        </CardNoTitle>
    );
}
