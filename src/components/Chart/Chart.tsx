import GanttElasticContext from "@/GanttElasticContext";
import _ from "lodash";
import React, { useContext, useEffect, useMemo, useRef } from "react";
import Calendar from "./Calendar/Calendar";
import DaysHighlight from "./DaysHighlight";
import DependencyLines from "./DependencyLines";
import Grid from "./Grid";
import Task from "./Row/Task";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ChartProps {}

const Chart: React.FC<ChartProps> = () => {
  const {
    style,
    visibleTasks,
    refs,
    calendar,
    height,
    width: fullWidth,
    rowsHeight,
    allVisibleTasksHeight,
    options
  } = useContext(GanttElasticContext);

  const divChart = useRef(null);
  const chartCalendarContainer = useRef(null);
  const chartGraphContainer = useRef(null);
  const chartGraph = useRef(null);
  const chartGraphSvg = useRef(null);

  useEffect(() => {
    refs.chart = divChart;
    refs.chartCalendarContainer = chartCalendarContainer;
    refs.chartGraphContainer = chartGraphContainer;
    refs.chartGraph = chartGraph;
    refs.chartGraphSvg = chartGraphSvg;
  }, [refs]);

  const renderTasks = useMemo(() => {
    return (
      <svg
        className="gantt-elastic__chart-graph-svg"
        style={{
          ...style["chart-graph-svg"]
        }}
        ref={chartGraphSvg}
        x="0"
        y="0"
        width={fullWidth + "px"}
        height={allVisibleTasksHeight + "px"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <DaysHighlight></DaysHighlight>
        <Grid></Grid>
        <DependencyLines></DependencyLines>
        {_.map(visibleTasks, task => {
          return (
            <g
              className="gantt-elastic__chart-row-wrapper"
              style={{
                ...style["chart-row-wrapper"]
              }}
              key={task.id}
            >
              <Task task={task}></Task>
            </g>
          );
        })}
      </svg>
    );
  }, [style, fullWidth, allVisibleTasksHeight, visibleTasks]);

  return useMemo(
    () => (
      <div
        className="gantt-elastic__chart"
        style={{ ...style["chart"] }}
        ref={divChart}
      >
        <div
          className="gantt-elastic__chart-calendar-container"
          ref={chartCalendarContainer}
          style={{
            ...style["chart-calendar-container"],
            height: calendar.height + "px",
            marginBottom: options.calendar.gap + "px"
          }}
        >
          <Calendar></Calendar>
        </div>
        <div
          className="gantt-elastic__chart-graph-container"
          ref={chartGraphContainer}
          style={{
            ...style["chart-graph-container"],
            height: height - calendar.height + "px"
          }}
        >
          <div
            style={{
              ...style["chart-area"],
              width: fullWidth + "px",
              height: rowsHeight + "px"
            }}
          >
            <div
              className="gantt-elastic__chart-graph"
              ref={chartGraph}
              style={{
                ...style["chart-graph"],
                height: "100%"
              }}
            >
              {renderTasks}
            </div>
          </div>
        </div>
      </div>
    ),
    [
      calendar.height,
      height,
      options.calendar.gap,
      renderTasks,
      rowsHeight,
      style,
      fullWidth
    ]
  );
};

export default Chart;
