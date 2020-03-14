import { CalendarRowItems } from "@/components/interfaces";
import GanttElasticContext from "@/GanttElasticContext";
import _ from "lodash";
import React, { useContext, useMemo } from "react";
import RowText from "./RowText";

interface CalendarRowProps {
  items: Array<CalendarRowItems>;
  which: string;
}

const CalendarRow: React.FC<CalendarRowProps> = ({ items, which }) => {
  const { style } = useContext(GanttElasticContext);

  return useMemo(() => {
    const rowStyle = {
      ...style["calendar-row"],
      ...style["calendar-row--" + which]
    };

    const rectStyle = {
      ...style["calendar-row-rect"],
      ...style["calendar-row-rect--" + which]
    };

    return (
      <div
        className={
          "gantt-elastic__calendar-row gantt-elastic__calendar-row--" + which
        }
        style={rowStyle}
      >
        {_.map(items, item => (
          <div
            key={item.key}
            className={
              "gantt-elastic__calendar-row-rect gantt-elastic__calendar-row-rect--" +
              which
            }
            style={rectStyle}
          >
            {_.map(item.children, child => (
              <RowText key={child.key} item={child} which={which}></RowText>
            ))}
          </div>
        ))}
      </div>
    );
  }, [items, style, which]);
};

export default CalendarRow;
