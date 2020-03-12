import GanttElasticContext from "@/GanttElasticContext";
import { emitEvent } from "@/GanttElasticEvents";
import { Task, TaskListColumnOption } from "@/types";
import React, { useCallback, useContext, useMemo } from "react";

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

  /**
   * Emit event
   *
   * @param {Event} event
   */
  const onEmitEvent = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      const eventName = event.type;
      if (
        typeof column.events !== "undefined" &&
        typeof column.events[eventName] === "function"
      ) {
        column.events[eventName]({ event, data: task, column: column });
      }
      emitEvent.emit(`taskList-${task.type}-${eventName}`, {
        event,
        data: task,
        column: column
      });
    },
    [task, column]
  );

  const itemStyles = useMemo(() => {
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
    return { itemColumnStyle, wrapperStyle, containerStyle, valueStyle };
  }, [style, column]);

  return (
    <div
      className="gantt-elastic__task-list-item-column"
      style={itemStyles.itemColumnStyle}
    >
      <div
        className="gantt-elastic__task-list-item-value-wrapper"
        style={itemStyles.wrapperStyle}
      >
        {children}
        <div
          className="gantt-elastic__task-list-item-value-container"
          style={itemStyles.containerStyle}
        >
          <div
            className="gantt-elastic__task-list-item-value"
            style={itemStyles.valueStyle}
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
};

export default ItemColumn;
