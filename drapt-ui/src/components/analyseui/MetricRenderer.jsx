import MetricCard from "./MetricCard";

export default function MetricRenderer({
    metric,
    value,
    valuestatus,
    tooltip,
    onExpand,
    isExpanded = false,
}) {
    return (
        <MetricCard
            metric={metric}
            value={value}
            tooltip={tooltip}
            expandButton={!!onExpand}
            valuestatus={valuestatus}
            onExpand={onExpand}
            isExpanded={isExpanded}
        />
    );
}
