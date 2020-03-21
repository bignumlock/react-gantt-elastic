import { Task } from "@/components/interfaces";
import GanttElasticContext from "@/GanttElasticContext";
import React, { useContext, useMemo } from "react";

export interface TaskProps {
  task: Task;
}

const ChartText: React.FC<TaskProps> = ({ task }) => {
  const { style, options, ctx } = useContext(GanttElasticContext);

  /**
   * Get width
   *
   * @returns {number}
   */
  const width = useMemo(() => {
    if (ctx) {
      const textStyle = style["chart-row-text"];
      ctx.font = `${textStyle["fontWight"]} ${textStyle["fontSize"]} ${textStyle["fontFamily"]}`;
      const textWidth = ctx.measureText(task.label).width;
      return textWidth + options.chart.text.xPadding * 2;
    }
  }, [ctx, options.chart.text.xPadding, style, task.label]);

  return useMemo(() => {
    const height = task.height + options.chart.grid.horizontal.gap * 2;

    return (
      <svg
        className="gantt-elastic__chart-row-text-wrapper"
        style={{ ...style["chart-row-text-wrapper"] }}
        x={task.x + task.width + options.chart.text.offset}
        y={task.y - options.chart.grid.horizontal.gap}
        width={width}
        height={height}
      >
        <foreignObject x="0" y="0" width="100%" height={height}>
          <div
            // xmlns="http//www.w3.org/1999/xhtml"
            className="gantt-elastic__chart-row-text"
            style={{ ...style["chart-row-text"] }}
          >
            <div
              className="gantt-elastic__chart-row-text-content gantt-elastic__chart-row-text-content--text"
              style={{
                ...style["chart-row-text-content"],
                ...style["chart-row-text-content--text"],
                height: "100%",
                lineHeight: height + "px"
              }}
            >
              <div>{task.label}</div>
            </div>
          </div>
        </foreignObject>
      </svg>
    );
  }, [
    options.chart.grid.horizontal.gap,
    options.chart.text.offset,
    style,
    task.height,
    task.label,
    task.width,
    task.x,
    task.y,
    width
  ]);
};

export default ChartText;
