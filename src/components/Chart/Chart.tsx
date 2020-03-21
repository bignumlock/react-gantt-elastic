import GanttElasticContext from "@/GanttElasticContext";
import _ from "lodash";
import React, { useContext, useEffect, useMemo, useRef } from "react";
import Calendar from "./Calendar/Calendar";
import DaysHighlight from "./DaysHighlight";
import DependencyLines from "./DependencyLines";
import Grid from "./Grid";
import Milestone from "./Row/Milestone";
import Project from "./Row/Project";
import Task from "./Row/Task";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ChartProps {}

const Chart: React.FC<ChartProps> = () => {
  const {
    style,
    visibleTasks,
    refs,
    calendar,
    clientHeight,
    chartWidth,
    rowsHeight,
    allVisibleTasksHeight,
    options
  } = useContext(GanttElasticContext);

  const chartRef = useRef(null);
  const chartCalendarContainerRef = useRef(null);
  const chartGraphContainerRef = useRef(null);
  const chartGraphRef = useRef(null);
  const chartGraphSvgRef = useRef(null);

  useEffect(() => {
    refs.chart = chartRef;
    refs.chartCalendarContainer = chartCalendarContainerRef;
    refs.chartGraphContainer = chartGraphContainerRef;
    refs.chartGraph = chartGraphRef;
    refs.chartGraphSvg = chartGraphSvgRef;
  }, [refs]);

  const renderTasks = useMemo(() => {
    return (
      <svg
        className="gantt-elastic__chart-graph-svg"
        style={{
          ...style["chart-graph-svg"]
        }}
        ref={chartGraphSvgRef}
        x="0"
        y="0"
        width={chartWidth + "px"}
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
              {task.type === "task" && <Task task={task}></Task>}
              {task.type === "project" && <Project task={task}></Project>}
              {task.type === "milestone" && <Milestone task={task}></Milestone>}
            </g>
          );
        })}
      </svg>
    );
  }, [style, chartWidth, allVisibleTasksHeight, visibleTasks]);

  return useMemo(
    () => (
      <div
        className="gantt-elastic__chart"
        style={{ ...style["chart"] }}
        ref={chartRef}
      >
        <div
          className="gantt-elastic__chart-calendar-container"
          ref={chartCalendarContainerRef}
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
          ref={chartGraphContainerRef}
          style={{
            ...style["chart-graph-container"],
            height: clientHeight - calendar.height + "px"
          }}
        >
          <div
            style={{
              ...style["chart-area"],
              width: chartWidth + "px",
              height: rowsHeight + "px"
            }}
          >
            <div
              className="gantt-elastic__chart-graph"
              ref={chartGraphRef}
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
      clientHeight,
      options.calendar.gap,
      renderTasks,
      rowsHeight,
      style,
      chartWidth
    ]
  );
};

export default Chart;
