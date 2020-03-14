import GanttElasticContext from "@/GanttElasticContext";
import { emitEvent } from "@/GanttElasticEvents";
import _ from "lodash";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import Expander from "../Expander";
import { TaskListColumnOption } from "../interfaces";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TaskListHeaderProps {}

const TaskListHeader: React.FC<TaskListHeaderProps> = () => {
  const { style, taskList, allTasks, calendar, options } = useContext(
    GanttElasticContext
  );

  const [resizer] = useState<{
    moving?: TaskListColumnOption;
    x: number;
    initialWidth: number;
  }>({
    // moving: false,
    x: 0,
    initialWidth: 0
  });

  /**
   * Resizer mouse down event handler
   */
  const resizerMouseDown = useCallback(
    column => {
      return (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        if (!resizer.moving) {
          resizer.moving = column;
          resizer.x = event.clientX;
          resizer.initialWidth = column.width;
          emitEvent.emit("taskList-column-width-change-start", resizer.moving);
        }
      };
    },
    [resizer]
  );

  /**
   * Resizer mouse move event handler
   */
  const resizerMouseMove = useCallback(
    event => {
      if (resizer.moving) {
        const lastWidth = resizer.moving.width;
        resizer.moving.width = resizer.initialWidth + event.clientX - resizer.x;
        if (resizer.moving.width < options.taskList.minWidth) {
          resizer.moving.width = options.taskList.minWidth;
        }
        if (lastWidth !== resizer.moving.width) {
          // set({ ...resizer });
          // dispatch({
          //   payload: {
          //     options: {
          //       ...options,
          //       taskList: { ...taskList, columns: [...taskList.columns] }
          //     }
          //   }
          // });
          emitEvent.emit("taskList-column-width-change", resizer.moving);
        }
      }
    },
    [resizer.initialWidth, resizer.moving, resizer.x, options.taskList.minWidth]
  );

  /**
   * Resizer mouse up event handler
   */
  const resizerMouseUp = useCallback((): void => {
    if (resizer.moving) {
      resizer.moving = undefined;
      emitEvent.emit("taskList-column-width-change-stop", resizer.moving);
    }
  }, [resizer]);

  useEffect(() => {
    document.addEventListener("mouseup", resizerMouseUp);
    document.addEventListener("mousemove", resizerMouseMove);
    emitEvent.on("main-view-mousemove", resizerMouseMove);
    emitEvent.on("main-view-mouseup", resizerMouseUp);
    return (): void => {
      document.removeEventListener("mouseup", resizerMouseUp);
      document.removeEventListener("mousemove", resizerMouseMove);
      emitEvent.removeAllListeners("main-view-mousemove");
      emitEvent.removeAllListeners("main-view-mouseup");
    };
  }, [resizerMouseMove, resizerMouseUp]);

  return useMemo(
    () => (
      <div
        className="gantt-elastic__task-list-header"
        style={{
          ...style["task-list-header"],
          height: `${calendar.height}px`,
          marginBottom: `${options.calendar.gap}px`
        }}
      >
        {_.map(taskList.columns, column => {
          return (
            <div
              className="gantt-elastic__task-list-header-column"
              style={{
                ...style["task-list-header-column"],
                ...column.style["task-list-header-column"],
                width: column.finalWidth + "px"
              }}
              key={column._key}
            >
              {column.expander && (
                <Expander
                  type="taskList"
                  tasks={_.filter(
                    allTasks,
                    task => task.allChildren.length > 0
                  )}
                  options={options.taskList.expander}
                ></Expander>
              )}
              <div
                className="gantt-elastic__task-list-header-label"
                style={{
                  ...style["task-list-header-label"],
                  ...column.style["task-list-header-label"]
                }}
                onMouseUp={resizerMouseUp}
              >
                {column.label}
              </div>
              <div
                className="gantt-elastic__task-list-header-resizer-wrapper"
                style={{
                  ...style["task-list-header-resizer-wrapper"],
                  ...column.style["task-list-header-resizer-wrapper"]
                }}
                onMouseDown={resizerMouseDown(column)}
              >
                <div
                  className="gantt-elastic__task-list-header-resizer"
                  style={{
                    ...style["task-list-header-resizer"],
                    ...column.style["task-list-header-resizer"]
                  }}
                >
                  <div
                    className="gantt-elastic__task-list-header-resizer-dot"
                    style={{
                      ...style["task-list-header-resizer-dot"],
                      ...column.style["task-list-header-resizer-dot"]
                    }}
                  ></div>
                  <div
                    className="gantt-elastic__task-list-header-resizer-dot"
                    style={{
                      ...style["task-list-header-resizer-dot"],
                      ...column.style["task-list-header-resizer-dot"]
                    }}
                  ></div>
                  <div
                    className="gantt-elastic__task-list-header-resizer-dot"
                    style={{
                      ...style["task-list-header-resizer-dot"],
                      ...column.style["task-list-header-resizer-dot"]
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    ),
    [
      allTasks,
      calendar.height,
      options.calendar.gap,
      options.taskList.expander,
      resizerMouseDown,
      resizerMouseUp,
      style,
      taskList.columns
    ]
  );
};

export default TaskListHeader;
