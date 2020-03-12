import { CalendarRowText } from "@/components/interfaces";
import { isInsideViewPort } from "@/components/utils/charts";
import GanttElasticContext from "@/GanttElasticContext";
import React, { useContext, useMemo } from "react";

export interface CalendarRowTextProps {
  item: CalendarRowText;
  which: string;
}

const RowText: React.FC<CalendarRowTextProps> = ({ item, which }) => {
  const { style, scroll } = useContext(GanttElasticContext);

  const rectChildStyle = useMemo(
    () => ({
      ...style["calendar-row-rect-child"],
      ...style["calendar-row-rect-child--" + which],
      width: item.width + "px",
      height: item.height + "px"
    }),
    [item.height, item.width, style, which]
  );

  const textStyle = useMemo(() => {
    const basicStyle = {
      ...style["calendar-row-text"],
      ...style["calendar-row-text--" + which]
    };

    if (which === "month") {
      let x = item.x + item.width / 2 - item.textWidth / 2;
      if (
        which === "month" &&
        isInsideViewPort(
          scroll.chart.left,
          scroll.chart.right,
          item.x,
          item.width,
          0
        )
      ) {
        const scrollWidth = scroll.chart.right - scroll.chart.left;
        x = scroll.chart.left + scrollWidth / 2 - item.textWidth / 2 + 2;
        if (x + item.textWidth + 2 > item.x + item.width) {
          x = item.x + item.width - item.textWidth - 2;
        } else if (x < item.x) {
          x = item.x + 2;
        }
      }
      basicStyle.left = x - item.x + "px";
    }
    return basicStyle;
  }, [
    item.textWidth,
    item.width,
    item.x,
    scroll.chart.left,
    scroll.chart.right,
    style,
    which
  ]);

  return (
    <div
      className={
        "gantt-elastic__calendar-row-rect-child gantt-elastic__calendar-row-rect-child--" +
        which
      }
      style={rectChildStyle}
    >
      <div
        className={
          "gantt-elastic__calendar-row-text gantt-elastic__calendar-row-text--" +
          which
        }
        style={textStyle}
      >
        {item.label}
      </div>
    </div>
  );
};

export default RowText;
