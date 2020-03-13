import GanttElasticContext from "@/GanttElasticContext";
import { Task } from "@/types";
import _ from "lodash";
import React, { useContext, useMemo } from "react";
import Expander from "../Expander";
import ItemColumn from "./ItemColumn";

export interface TaskListItemProps {
  task: Task;
}

const TaskListItem: React.FC<TaskListItemProps> = ({ task }) => {
  const { style, options, taskList } = useContext(GanttElasticContext);

  const renderColunms = useMemo(() => {
    const tasks = [task];

    return _.map(taskList.columns, (column, index) => (
      <ItemColumn task={task} column={column} key={`${column.id}-${index}`}>
        {column.expander && (
          <Expander
            tasks={tasks}
            type="taskList"
            options={options.taskList.expander}
          ></Expander>
        )}
      </ItemColumn>
    ));
  }, [task, taskList.columns]);

  return (
    <div
      className="gantt-elastic__task-list-item"
      style={{
        ...style["task-list-item"]
      }}
    >
      {renderColunms}
    </div>
  );
};

export default TaskListItem;
