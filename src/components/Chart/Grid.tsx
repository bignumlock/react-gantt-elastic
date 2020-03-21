import GanttElasticContext from "@/GanttElasticContext";
import _ from "lodash";
import React, { useContext, useEffect, useMemo, useRef } from "react";
import { isInsideViewPort, timeToPixelOffsetX } from "../utils/charts";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ChartProps {}

const Grid: React.FC<ChartProps> = () => {
  const {
    style,
    options,
    refs,
    visibleTasks,
    allTasks,
    times,
    scroll,
    chartWidth,
    allVisibleTasksHeight
  } = useContext(GanttElasticContext);
  const allTaskCount = allTasks.length;
  // refs
  const svgChartRef = useRef(null);

  useEffect(() => {
    refs.svgChart = svgChartRef;
  }, [refs]);

  const strokeWidth = useMemo(
    () => parseInt(`${style["grid-line-vertical"]["strokeWidth"]}`),
    [style]
  );

  /**
   * Generate vertical lines of the grid
   */
  const renderVerticalLines = useMemo(() => {
    const lines: JSX.Element[] = [];
    _.forEach(times.steps, step => {
      if (
        isInsideViewPort(
          scroll.chart.left,
          scroll.chart.right,
          step.offset.px,
          1
        )
      ) {
        lines.push(
          <line
            className="gantt-elastic__grid-line-vertical"
            style={{ ...style["grid-line-vertical"] }}
            key={step.time}
            x1={step.offset.px}
            y1={0}
            x2={step.offset.px}
            y2={
              allTaskCount *
                (options.row.height + options.chart.grid.horizontal.gap * 2) +
              strokeWidth
            }
          ></line>
        );
      }
    });
    return <React.Fragment>{lines}</React.Fragment>;
  }, [
    allTaskCount,
    options.chart.grid.horizontal.gap,
    options.row.height,
    scroll.chart.left,
    scroll.chart.right,
    strokeWidth,
    style,
    times.steps
  ]);

  /**
   * Generate horizontal lines of the grid
   */
  const renderHorizontalLines = useMemo(() => {
    return (
      <>
        {_.map(visibleTasks, (_: object, index: number) => {
          const y =
            index *
              (options.row.height + options.chart.grid.horizontal.gap * 2) +
            strokeWidth / 2;

          return (
            <line
              className="gantt-elastic__grid-line-horizontal"
              style={{ ...style["grid-line-horizontal"] }}
              key={`h1${index}`}
              x1={0}
              y1={y}
              x2={"100%"}
              y2={y}
            ></line>
          );
        })}
      </>
    );
  }, [
    options.chart.grid.horizontal.gap,
    options.row.height,
    strokeWidth,
    style,
    visibleTasks
  ]);

  /**
   * Get current time line position
   *
   * @returns {object}
   */
  const timeLinePosition = useMemo(() => {
    const d = new Date();
    const current = d.getTime();
    const currentOffset = timeToPixelOffsetX(
      current,
      times.firstTime,
      options.times.timePerPixel
    );
    const timeLine = {
      x: 0,
      y1: 0,
      y2: "100%",
      dateTime: "",
      time: current
    };
    timeLine.x = currentOffset;
    timeLine.dateTime = d.toLocaleDateString();
    return timeLine;
  }, [options.times.timePerPixel, times.firstTime]);

  return useMemo(
    () => (
      <svg
        className="gantt-elastic__grid-lines-wrapper"
        style={{ ...style["grid-lines-wrapper"] }}
        ref={svgChartRef}
        x="0"
        y="0"
        width={chartWidth}
        height={allVisibleTasksHeight}
        xmlns="http//www.w3.org/2000/svg"
      >
        <g
          className="gantt-elastic__grid-lines"
          style={{ ...style["grid-lines"] }}
        >
          {renderHorizontalLines}
          {renderVerticalLines}
          <line
            className="gantt-elastic__grid-line-time"
            style={{ ...style["grid-line-time"] }}
            x1={timeLinePosition.x}
            y1={timeLinePosition.y1}
            x2={timeLinePosition.x}
            y2={timeLinePosition.y2}
          ></line>
        </g>
      </svg>
    ),
    [
      allVisibleTasksHeight,
      renderHorizontalLines,
      renderVerticalLines,
      style,
      timeLinePosition.x,
      timeLinePosition.y1,
      timeLinePosition.y2,
      chartWidth
    ]
  );
};

export default Grid;
