import Expander from "@/components/Expander";
import GanttElasticContext from "@/GanttElasticContext";
import { emitEvent } from "@/GanttElasticEvents";
import { Task } from "@/types";
import React, { useCallback, useContext, useMemo } from "react";
import invariant from "ts-invariant";
import ProgressBar from "./ProgressBar";
import ChartText from "./Text";

export interface TaskProps {
  task: Task;
}

const ChartTask: React.FC<TaskProps> = ({ task }) => {
  const { style, options, scroll } = useContext(GanttElasticContext);

  /**
   * Emit event
   *
   * @param {string} eventName
   * @param {Event} event
   */
  const onEmitEvent = useCallback(
    event => {
      if (!scroll.scrolling) {
        invariant.warn(event.type, task);
        emitEvent.emit(`chart-${task.type}-${event.type}`, {
          event,
          data: task
        });
        task.events &&
          task.events[event.type] &&
          task.events[event.type](event, task);
      }
    },
    [scroll, task]
  );

  /**
   * Should we display expander?
   *
   * @returns {boolean}
   */
  const renderExpander = useMemo(() => {
    const expander = options.chart.expander;
    const display =
      expander.display ||
      (expander.displayIfTaskListHidden && !options.taskList.display);

    return (
      <>
        {display && (
          <foreignObject
            className="gantt-elastic__chart-expander gantt-elastic__chart-expander--task"
            style={{
              ...style["chart-expander"],
              ...style["chart-expander--task"],
              ...task.style["chart-expander"]
            }}
            x={
              task.x -
              options.chart.expander.offset -
              options.chart.expander.size
            }
            y={task.y + (options.row.height - options.chart.expander.size) / 2}
            width={options.chart.expander.size}
            height={options.chart.expander.size}
          >
            <Expander tasks={[task]} type="chart"></Expander>
          </foreignObject>
        )}
      </>
    );
  }, [
    options.chart.expander,
    options.row.height,
    options.taskList.display,
    style,
    task
  ]);

  /**
   * svg
   */
  const renderSvg = useMemo(
    () => (
      <svg
        xmlns="http//www.w3.org/2000/svg"
        className="gantt-elastic__chart-row-bar gantt-elastic__chart-row-task"
        style={{
          ...style["chart-row-bar"],
          ...style["chart-row-task"],
          ...task.style["chart-row-bar"]
        }}
        x={task.x}
        y={task.y}
        width={task.width}
        height={task.height}
        viewBox={`0 0 ${task.width} ${task.height}`}
        onClick={onEmitEvent}
        // onMouseEnter={onEmitEvent}
        // onMouseOver={onEmitEvent}
        // onMouseOut={onEmitEvent}
        // onMouseMove={onEmitEvent}
        onMouseDown={onEmitEvent}
        onMouseUp={onEmitEvent}
        onWheel={onEmitEvent}
        onTouchStart={onEmitEvent}
        onTouchMove={onEmitEvent}
        onTouchEnd={onEmitEvent}
      >
        <defs>
          <clipPath id="clipPathId">
            <polygon
              points={`0,0 ${task.width},0 ${task.width},${task.height} 0,${task.height}`}
            ></polygon>
          </clipPath>
        </defs>
        <polygon
          className="gantt-elastic__chart-row-bar-polygon gantt-elastic__chart-row-task-polygon"
          style={{
            ...style["chart-row-bar-polygon"],
            ...style["chart-row-task-polygon"],
            ...task.style["base"],
            ...task.style["chart-row-bar-polygon"]
          }}
          points={`0,0 ${task.width},0 ${task.width},${task.height} 0,${task.height}`}
        ></polygon>
        <ProgressBar
          task={task}
          clip-path={`url(#gantt-elastic__task-clip-path-${task.id})`}
        ></ProgressBar>
      </svg>
    ),
    [onEmitEvent, style, task]
  );

  return (
    <g
      className="gantt-elastic__chart-row-bar-wrapper gantt-elastic__chart-row-task-wrapper"
      style={{
        ...style["chart-row-bar-wrapper"],
        ...style["chart-row-task-wrapper"],
        ...task.style["chart-row-bar-wrapper"]
      }}
    >
      {renderExpander}
      {renderSvg}
      {options.chart.text.display && <ChartText task={task}></ChartText>}
    </g>
  );
};

export default ChartTask;
