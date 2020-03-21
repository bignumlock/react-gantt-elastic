import Expander from "@/components/Expander";
import { Task } from "@/components/interfaces";
import GanttElasticContext from "@/GanttElasticContext";
import { emitEvent } from "@/GanttElasticEvents";
import React, { useCallback, useContext, useMemo } from "react";
import invariant from "ts-invariant";
import ProgressBar from "../ProgressBar";
import ChartText from "../Text";

export interface TaskProps {
  task: Task;
}

const ChartTask: React.FC<TaskProps> = ({ task }) => {
  const { style, options } = useContext(GanttElasticContext);

  /**
   * Emit event
   *
   * @param {string} eventName
   * @param {Event} event
   */
  const onEmitEvent = useCallback(
    event => {
      invariant.warn(event.type, task);
      emitEvent.emit(`chart-${task.type}-${event.type}`, {
        event,
        data: task
      });
      task.events &&
        task.events[event.type] &&
        task.events[event.type](event, task);
    },
    [task]
  );

  return useMemo(() => {
    const points = `0,0 ${task.width},0 ${task.width},${task.height} 0,${task.height}`;

    const clipPathId = `gantt-elastic__project-clip-path-${task.id}`;

    const displayExpander =
      options.chart.expander.display ||
      (options.chart.expander.displayIfTaskListHidden &&
        !options.taskList.display);

    return (
      <g
        className="gantt-elastic__chart-row-bar-wrapper gantt-elastic__chart-row-task-wrapper"
        style={{
          ...style["chart-row-bar-wrapper"],
          ...style["chart-row-task-wrapper"],
          ...task.style["chart-row-bar-wrapper"]
        }}
      >
        {displayExpander && (
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
            <Expander
              tasks={[task]}
              type="chart"
              options={{
                type: options.chart.expander.type,
                size: options.chart.expander.size,
                padding: 0,
                margin: 0
              }}
            ></Expander>
          </foreignObject>
        )}
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
            <clipPath id={clipPathId}>
              <polygon points={points}></polygon>
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
            points={points}
          ></polygon>
          <ProgressBar
            task={task}
            clipPath={`url(#${clipPathId})`}
          ></ProgressBar>
        </svg>
        {options.chart.text.display && <ChartText task={task}></ChartText>}
      </g>
    );
  }, [
    onEmitEvent,
    options.chart.expander.display,
    options.chart.expander.displayIfTaskListHidden,
    options.chart.expander.offset,
    options.chart.expander.size,
    options.chart.expander.type,
    options.chart.text.display,
    options.row.height,
    options.taskList.display,
    style,
    task
  ]);
};

export default ChartTask;
