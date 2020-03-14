import GanttElasticContext from "@/GanttElasticContext";
import dayjs from "dayjs";
import _ from "lodash";
import React, { useContext, useMemo } from "react";

/**
 * Show working days?
 *
 * @returns {bool}
 */
const showWorkingDays = (workingDays: number[]): boolean => {
  if (
    typeof workingDays !== "undefined" &&
    Array.isArray(workingDays) &&
    workingDays.length
  ) {
    return true;
  }
  return false;
};

/**
 * Get key
 *
 * @param {object} day
 * @returns {string} key ideintifier for loop
 */
function getKey(
  time: string | number | Date | dayjs.Dayjs | undefined
): string {
  return dayjs(time).format("YYYY-MM-DD");
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DaysHighlightProps {}

const DaysHighlight: React.FC<DaysHighlightProps> = () => {
  const { style, options, times } = useContext(GanttElasticContext);

  const { workingDays } = options.calendar;

  return useMemo(() => {
    /**
     * Get working days
     */
    const workingSteps = _.filter(times.steps, step => {
      return !workingDays.includes(dayjs(step.time).day());
    });

    return (
      <g
        className="gantt-elastic__chart-days-highlight-container"
        style={{ ...style["chart-days-highlight-container"] }}
      >
        {showWorkingDays(workingDays.asMutable()) &&
          _.map(workingSteps, day => (
            <rect
              className="gantt-elastic__chart-days-highlight-rect"
              key={getKey(day.time)}
              x={day.offset.px}
              y="0"
              width={day.width.px}
              height="100%"
              style={{
                ...style["chart-days-highlight-rect"]
              }}
            ></rect>
          ))}
      </g>
    );
  }, [style, times.steps, workingDays]);
};

export default DaysHighlight;
