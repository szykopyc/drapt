import { FaInfoCircle } from "react-icons/fa";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { ColouredText } from "./ColouredText";
import {
    ArrowsPointingOutIcon,
    ArrowsPointingInIcon,
} from "@heroicons/react/24/outline";

export default function MetricCard({
    metric,
    flexsize = 1,
    value,
    valuestatus = "positive",
    tooltip = null,
    expandButton = false,
    minimiseButton = false,
    onExpand,
    onMinimise,
    ...props
}) {
    const flexClasses = {
        1: "flex-[1]",
        2: "flex-[2]",
        3: "flex-[3]",
    };
    return (
        <div
            className={`card card-border border-primary bg-base-100 shadow-md hover:shadow-lg transition-shadow h-full ${
                flexClasses[flexsize] || "flex-[1]"
            }`}
            style={{ borderRadius: "var(--border-radius)" }}
            {...props}
        >
            <div className="card-body my-1">
                {metric && (
                    <div className="flex justify-between items-center">
                        <h2 className="card-title text-2xl">{metric}</h2>
                        {(tooltip || expandButton || minimiseButton) && (
                            <div className="flex flex-row gap-1">
                                {tooltip && (
                                    <Tippy
                                        content={tooltip}
                                        placement="top"
                                        animation="shift-away"
                                        arrow={true}
                                        interactive={false}
                                        delay={0}
                                    >
                                        <button className="w-5 h-5 flex items-center justify-center rounded-full text-info hover:bg-transparent focus:outline-none">
                                            <FaInfoCircle className="w-4 h-4 text-info" />
                                        </button>
                                    </Tippy>
                                )}
                                {expandButton && !minimiseButton && (
                                    <button
                                        type="button"
                                        className="w-5 h-5 flex items-center justify-center"
                                        onClick={onExpand}
                                        aria-label="Expand"
                                    >
                                        <ArrowsPointingOutIcon className="h-5 w-5" />
                                    </button>
                                )}
                                {!expandButton && minimiseButton && (
                                    <span className="w-5 h-5 flex items-center justify-center">
                                        <ArrowsPointingInIcon className="h-5 w-5" />
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                )}
                <div className="text-lg">
                    <ColouredText status={valuestatus}>{value}</ColouredText>
                </div>
            </div>
        </div>
    );
}
