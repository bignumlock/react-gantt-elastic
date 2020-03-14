import GanttElasticContext from "@/GanttElasticContext";
import _ from "lodash";
import React, { useContext, useEffect, useMemo, useRef } from "react";
import TaskListHeader from "./TaskListHeader";
import TaskListItem from "./TaskListItem";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TaskListProps {}

const TaskList: React.FC<TaskListProps> = () => {
  const { style, visibleTasks, rowsHeight, refs } = useContext(
    GanttElasticContext
  );

  /**
   * refs
   */
  const taskListWrapperRef = useRef(null);
  const taskListRef = useRef(null);
  const taskListItemsRef = useRef(null);

  useEffect(() => {
    refs.taskListWrapper = taskListWrapperRef;
    refs.taskList = taskListRef;
    refs.taskListItems = taskListItemsRef;
  }, [refs]);

  return useMemo(
    () => (
      <div
        className="gantt-elastic__task-list-wrapper"
        ref={taskListWrapperRef}
        style={{
          ...style["task-list-wrapper"],
          width: "100%",
          height: "100%"
        }}
      >
        <div
          className="gantt-elastic__task-list"
          style={{
            ...style["task-list"]
          }}
          ref={taskListRef}
        >
          <TaskListHeader></TaskListHeader>
          <div
            className="gantt-elastic__task-list-items"
            ref={taskListItemsRef}
            style={{
              ...style["task-list-items"],
              height: rowsHeight + "px"
            }}
          >
            {_.map(visibleTasks, task => (
              <TaskListItem task={task} key={task.id}></TaskListItem>
            ))}
          </div>
        </div>
      </div>
    ),
    [rowsHeight, style, visibleTasks]
  );
};

export default TaskList;
