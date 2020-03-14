import GanttElasticContext from "@/GanttElasticContext";
import _ from "lodash";
import React, { useContext, useMemo } from "react";
import Expander from "../Expander";
import { Task } from "../interfaces";
import ItemColumn from "./ItemColumn";

export interface TaskListItemProps {
  task: Task;
}

const TaskListItem: React.FC<TaskListItemProps> = ({ task }) => {
  const { style, options, taskList } = useContext(GanttElasticContext);

  return useMemo(() => {
    const tasks = [task];
    return (
      <div
        className="gantt-elastic__task-list-item"
        style={{
          ...style["task-list-item"]
        }}
      >
        {_.map(taskList.columns, (column, index) => (
          <ItemColumn
            task={task}
            column={column.asMutable({ deep: true })}
            key={`${column.id}-${index}`}
          >
            {column.expander && (
              <Expander
                tasks={tasks}
                type="taskList"
                options={options.taskList.expander}
              ></Expander>
            )}
          </ItemColumn>
        ))}
      </div>
    );
  }, [options.taskList.expander, style, task, taskList.columns]);
};

export default TaskListItem;
