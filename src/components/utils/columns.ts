import { GanttElasticTaskListColumn } from "@/types";
import _ from "lodash";
import { Task, TaskListColumnOption } from "../interfaces";
import { getMaximalExpanderWidth, getTaskHeight } from "./tasks";

/**
 * Initialize columns
 *
 */
const initialzeColumns = (
  columns: GanttElasticTaskListColumn[]
): TaskListColumnOption[] => {
  return _.map(columns, (column, index) => {
    return {
      ...column,
      height: 0,
      finalWidth: 0,
      thresholdPercent: 100,
      widthFromPercentage: 0,
      expander: !!column.expander,
      style: column.style ?? {},
      _key: `${index}-${column.label}`
    };
  });
};

/**
 * Calculate task list columns dimensions
 *
 * @param columns
 * @param tasks
 * @param percent options.taskList.percent
 * @param padding options.taskList.expander.padding
 * @param margin options.taskList.expander.margin
 * @param height options.row.height
 * @param gap options.chart.grid.horizontal.gap
 * @param strokeWidth style["grid-line-horizontal"]["strokeWidth"]
 */
const calculateTaskListColumnsDimensions = (
  columns: TaskListColumnOption[],
  tasks: Task[],
  percent: number,
  padding: number,
  margin: number,
  height: number,
  gap: number,
  strokeWidth: number
): {
  columns: TaskListColumnOption[];
  widthFromPercentage: number;
  finalWidth: number;
  width: number;
} => {
  let final = 0;
  let percentage = 0;
  let totalWidth = 0;
  for (const column of columns) {
    if (column.expander) {
      column.widthFromPercentage =
        ((getMaximalExpanderWidth(tasks, padding, margin) + column.width) /
          100) *
        percent;
    } else {
      column.widthFromPercentage = (column.width / 100) * percent;
    }
    percentage += column.widthFromPercentage;
    column.finalWidth =
      (column.thresholdPercent * column.widthFromPercentage) / 100;
    final += column.finalWidth;
    column.height = getTaskHeight(height, gap, strokeWidth) - strokeWidth;
    totalWidth += column.width;
  }

  return {
    columns,
    widthFromPercentage: percentage,
    finalWidth: final,
    width: totalWidth
  };
};

export { calculateTaskListColumnsDimensions, initialzeColumns };
