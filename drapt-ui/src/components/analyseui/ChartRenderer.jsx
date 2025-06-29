import ChartCard from "./ChartCard";

export default function ChartRenderer({ title, data, tooltip, onExpand }) {
    return (
        <ChartCard
            title={title}
            data={data}
            size="large"
            tooltip={tooltip}
            expandButton={!!onExpand}
            onExpand={onExpand}
        />
    );
}