import Expander from "@/components/Expander";
import { Task } from "@/components/interfaces";
import GanttElasticContext from "@/GanttElasticContext";
import { emitEvent } from "@/GanttElasticEvents";
import React, { useCallback, useContext, useMemo } from "react";
import { invariant } from "ts-invariant";
import ProgressBar from "../ProgressBar";
import ChartText from "../Text";

export interface MilestoneProps {
  task: Task;
}

const ChartMilestone: React.FC<MilestoneProps> = ({ task }) => {
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

  /**
   * Get points
   */
  const points = useMemo(() => {
    const fifty = task.height / 2;
    let offset = fifty;
    if (task.width / 2 - offset < 0) {
      offset = task.width / 2;
    }
    return `0,${fifty}
        ${offset},0
        ${task.width - offset},0
        ${task.width},${fifty}
        ${task.width - offset},${task.height}
        ${offset},${task.height}`;
  }, [task.height, task.width]);

  return useMemo(() => {
    const clipPathId = `gantt-elastic__milestone-clip-path-${task.id}`;

    const displayExpander =
      options.chart.expander.display ||
      (options.chart.expander.displayIfTaskListHidden &&
        !options.taskList.display);

    return (
      <g
        className="gantt-elastic__chart-row-bar-wrapper gantt-elastic__chart-row-milestone-wrapper"
        style={{
          ...style["chart-row-bar-wrapper"],
          ...style["chart-row-milestone-wrapper"],
          ...task.style["chart-row-bar-wrapper"]
        }}
      >
        {displayExpander && (
          <foreignObject
            className="gantt-elastic__chart-expander gantt-elastic__chart-expander--milestone"
            style={{
              ...style["chart-expander"],
              ...style["chart-expander--milestone"],
              ...task.style["chart-expander"]
            }}
            x={
              task.x -
              options.chart.expander.offset -
              options.chart.expander.size
            }
            y={task.y + (options.row.height - options.chart.expander.size) / 2}
            width={options.chart.expander.size}
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
          xmlns="http://www.w3.org/2000/svg"
          className="gantt-elastic__chart-row-bar gantt-elastic__chart-row-milestone"
          style={{
            ...style["chart-row-bar"],
            ...style["chart-row-milestone"],
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
            className="gantt-elastic__chart-row-bar-polygon gantt-elastic__chart-row-milestone-polygon"
            style={{
              ...style["chart-row-bar-polygon"],
              ...style["chart-row-milestone-polygon"],
              ...task.style["base"],
              ...task.style["chart-row-bar-polygon"]
            }}
            points={points}
          ></polygon>
          <ProgressBar
            task={task}
            clipPath={"url(#" + clipPathId + ")"}
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
    points,
    style,
    task
  ]);
};

export default ChartMilestone;
