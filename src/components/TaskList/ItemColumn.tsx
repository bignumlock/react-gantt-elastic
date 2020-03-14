import GanttElasticContext from "@/GanttElasticContext";
import { emitEvent } from "@/GanttElasticEvents";
import React, { useContext, useMemo } from "react";
import { Task, TaskListColumnOption } from "../interfaces";

export interface TaskListItemProps {
  task: Task;
  column: TaskListColumnOption;
}

const ItemColumn: React.FC<TaskListItemProps> = ({
  task,
  column,
  children
}) => {
  const { style } = useContext(GanttElasticContext);

  return useMemo(() => {
    const itemColumnStyle = {
      ...style["task-list-item-column"],
      ...column.style["task-list-item-column"],
      width: column.finalWidth + "px",
      height: column.height + "px"
    };
    const wrapperStyle = {
      ...style["task-list-item-value-wrapper"],
      ...column.style["task-list-item-value-wrapper"]
    };

    const containerStyle = {
      ...style["task-list-item-value-container"],
      ...column.style["task-list-item-value-container"]
    };
    const valueStyle = {
      ...style["task-list-item-value"],
      ...column.style["task-list-item-value"]
    };

    /**
     * Emit event
     *
     * @param {Event} event
     */
    const onEmitEvent = (event: React.MouseEvent | React.TouchEvent): void => {
      const eventName = event.type;
      if (
        typeof column.events !== "undefined" &&
        typeof column.events[eventName] === "function"
      ) {
        column.events[eventName]({
          event,
          data: task,
          column: column
        });
      }
      emitEvent.emit(`taskList-${task.type}-${eventName}`, {
        event,
        data: task,
        column: column
      });
    };

    return (
      <div
        className="gantt-elastic__task-list-item-column"
        style={itemColumnStyle}
      >
        <div
          className="gantt-elastic__task-list-item-value-wrapper"
          style={wrapperStyle}
        >
          {children}
          <div
            className="gantt-elastic__task-list-item-value-container"
            style={containerStyle}
          >
            <div
              className="gantt-elastic__task-list-item-value"
              style={valueStyle}
              onClick={onEmitEvent}
              onMouseEnter={onEmitEvent}
              onMouseOver={onEmitEvent}
              onMouseOut={onEmitEvent}
              onMouseMove={onEmitEvent}
              onMouseDown={onEmitEvent}
              onMouseUp={onEmitEvent}
              onWheel={onEmitEvent}
              onTouchStart={onEmitEvent}
              onTouchMove={onEmitEvent}
              onTouchEnd={onEmitEvent}
            >
              {typeof column.value === "function"
                ? column.value(task)
                : task[column.value]}
            </div>
          </div>
        </div>
      </div>
    );
  }, [style, column, children, task]);
};

export default ItemColumn;
