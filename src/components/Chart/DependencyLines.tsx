import GanttElasticContext from "@/GanttElasticContext";
import _ from "lodash";
import React, { useContext, useMemo } from "react";
import { Task } from "../interfaces";

/**
 * Get path points
 */
const getPoints = (
  fromTaskId: string | number,
  toTaskId: string | number,
  isTaskVisible?: (task: Task) => boolean,
  getTask?: (id: string | number) => Task
): string | undefined => {
  if (getTask && isTaskVisible) {
    const fromTask = getTask(fromTaskId);
    const toTask = getTask(toTaskId);
    if (
      fromTask === null ||
      toTask === null ||
      !isTaskVisible(toTask) ||
      !isTaskVisible(fromTask)
    ) {
      return;
    }
    const startX = fromTask.x + fromTask.width;
    const startY = fromTask.y + fromTask.height / 2;
    const stopX = toTask.x;
    const stopY = toTask.y + toTask.height / 2;
    const distanceX = stopX - startX;
    let distanceY;
    let yMultiplier = 1;
    if (stopY >= startY) {
      distanceY = stopY - startY;
    } else {
      distanceY = startY - stopY;
      yMultiplier = -1;
    }
    const offset = 10;
    const roundness = 4;
    const isBefore = distanceX <= offset + roundness;
    let points = `M ${startX} ${startY}
          L ${startX + offset},${startY} `;
    if (isBefore) {
      points += `Q ${startX + offset + roundness},${startY} ${startX +
        offset +
        roundness},${startY + roundness * yMultiplier}
            L ${startX + offset + roundness},${startY +
        (distanceY * yMultiplier) / 2 -
        roundness * yMultiplier}
            Q ${startX + offset + roundness},${startY +
        (distanceY * yMultiplier) / 2} ${startX + offset},${startY +
        (distanceY * yMultiplier) / 2}
            L ${startX - offset + distanceX},${startY +
        (distanceY * yMultiplier) / 2}
            Q ${startX - offset + distanceX - roundness},${startY +
        (distanceY * yMultiplier) / 2} ${startX -
        offset +
        distanceX -
        roundness},${startY +
        (distanceY * yMultiplier) / 2 +
        roundness * yMultiplier}
            L ${startX - offset + distanceX - roundness},${stopY -
        roundness * yMultiplier}
            Q ${startX - offset + distanceX - roundness},${stopY} ${startX -
        offset +
        distanceX},${stopY}
            L ${stopX},${stopY}`;
    } else {
      points += `L ${startX + distanceX / 2 - roundness},${startY}
            Q ${startX + distanceX / 2},${startY} ${startX +
        distanceX / 2},${startY + roundness * yMultiplier}
            L ${startX + distanceX / 2},${stopY - roundness * yMultiplier}
            Q ${startX + distanceX / 2},${stopY} ${startX +
        distanceX / 2 +
        roundness},${stopY}
            L ${stopX},${stopY}`;
    }
    return points;
  }
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DaysHighlightProps {}

const DependencyLines: React.FC<DaysHighlightProps> = () => {
  const { style, allTasks, isTaskVisible, getTask } = useContext(
    GanttElasticContext
  );

  /**
   * Get tasks which are dependent on other tasks
   *
   * @returns {array}
   */
  const dependencyTasks = useMemo(() => {
    return _.filter(allTasks, task => !task.dependentOn)
      .map(task => {
        task.dependencyLines = _.map(task.dependentOn, id => ({
          points: getPoints(id, task.id, isTaskVisible, getTask),
          taskId: id
        }));
        return task;
      })
      .filter(task => task.dependencyLines);
  }, [allTasks, isTaskVisible, getTask]);

  return useMemo(() => {
    return (
      <svg
        x="0"
        y="0"
        width="100%"
        height="100%"
        className="gantt-elastic__chart-dependency-lines-container"
        style={{ ...style["chart-dependency-lines-container"] }}
      >
        {_.map(dependencyTasks, task => (
          <g key={task.id}>
            {_.map(task.dependencyLines, (dependencyLine, index) => (
              <path
                key={index}
                className="gantt-elastic__chart-dependency-lines-path"
                style={{
                  ...style["chart-dependency-lines-path"],
                  ...task.style["chart-dependency-lines-path"],
                  ...task.style[
                    "chart-dependency-lines-path-" + dependencyLine.taskId
                  ]
                }}
                d={dependencyLine.points}
              ></path>
            ))}
          </g>
        ))}
      </svg>
    );
  }, [dependencyTasks, style]);
};

export default DependencyLines;
