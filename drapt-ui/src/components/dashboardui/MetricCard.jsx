import { FaInfoCircle } from 'react-icons/fa';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { ColouredText } from "./ColouredText";  

export default function MetricCard({ metric, flexsize = 1, value, valuestatus="positive", tooltip=null}) {
  const flexClasses = {
    1: "flex-[1]",
    2: "flex-[2]",
    3: "flex-[3]",
  };
  return (
    <div className={`card card-border border-primary bg-base-100 shadow-md hover:shadow-lg transition-shadow ${flexClasses[flexsize] || "flex-[1]"}`}>
      <div className="card-body my-1">
        {metric && (
          <div className="flex items-center gap-2">
            <h2 className="card-title text-2xl">{metric}</h2>
            {tooltip && (
              <Tippy
                content={tooltip}
                placement="top"
                animation="shift-away"
                arrow={true}
                interactive={false}
                delay={0}
                // flip and boundary handling is automatic by default
                // You can also customize boundary:
                // boundary="viewport" or "window" etc.
              >
                <button className="w-5 h-5 flex items-center justify-center rounded-full text-info hover:bg-transparent focus:outline-none">
                  <FaInfoCircle className="w-4 h-4 text-info" />
                </button>
              </Tippy>
            )}
          </div>
        )}
        <div className="text-lg">
          <ColouredText status={valuestatus}>
            {value}
          </ColouredText>
        </div>
      </div>
    </div>
  );
}