import { GanttElasticTask } from "@/types";
import dayjs from "dayjs";
import _ from "lodash";
import { Task } from "../interfaces";

/**
 * Fill out empty task properties and make it reactive
 */
const fillTasks = (inTask: Partial<GanttElasticTask>): Task => {
  const task: Task = {
    id: 0,
    type: "task",
    startTime: 0,
    endTime: 0,
    start: 0,
    label: "task",
    progress: 0,
    end: 0,
    duration: 0,
    children: [],
    allChildren: [],
    parents: [],
    parent: null,
    dependentOn: [],
    dependencyLines: [],
    parentId: null,
    style: {},
    collapsed: false,
    mouseOver: false,
    height: 0,
    width: 0,
    y: 0,
    x: 0,
    ...inTask
  };

  if (_.isEmpty(task.parentId)) {
    task.parentId = 0;
  }
  if (_.isEmpty(task.startTime)) {
    task.startTime = dayjs(task.start).valueOf();
  }
  if (_.isEmpty(task.endTime) && task.end) {
    task.endTime = dayjs(task.end).valueOf();
  } else if (_.isEmpty(task.endTime) && task.duration) {
    task.endTime = task.startTime + task.duration;
  }
  if (_.isEmpty(task.duration) && task.endTime) {
    task.duration = task.endTime - task.startTime;
  }
  return task;
};

/**
 * Make task tree, after reset - look above
 *
 * @param {object} task
 * @returns {object} tasks with children and parents
 */
const makeTaskTree = (task: Task, tasks: Task[]): Task => {
  for (let i = 0, len = tasks.length; i < len; i++) {
    let current = tasks[i];
    // 当taskId是空时，task时rootTask，如果parentId也是空时，则应该时rootTask的子元素
    if (current.parentId === task.id) {
      if (task.parents.length) {
        task.parents.forEach(parent => current.parents.push(parent));
      }
      // eslint-disable-next-line no-prototype-builtins
      if (!task.propertyIsEnumerable("__root")) {
        current.parents.push(task.id);
        current.parent = task.id;
      } else {
        current.parents = [];
        current.parent = null;
      }
      current = makeTaskTree(current, tasks);
      task.allChildren.push(current.id);
      task.children.push(current.id);
      current.allChildren.forEach(childId => task.allChildren.push(childId));
    }
  }
  return task;
};

/**
 * Convert time (in milliseconds) to pixel offset inside chart
 *
 */
const timeToPixelOffsetX = (
  ms: number,
  firstTime: number,
  timePerPixel: number
): number => {
  let x = ms - firstTime;
  if (x) {
    x = x / timePerPixel;
  }
  return x;
};

/**
 * recalculate task variables
 *
 * @param allTasks
 * @param firstTime options.times.firstTime,
 * @param timePerPixel options.times.timePerPixel
 * @param rowHeight options.row.height
 * @param horizontalGap options.chart.grid.horizontal.gap
 * @param strokeWidth
 */
const recalculateTasks = (
  allTasks: Task[],
  firstTime: number,
  timePerPixel: number,
  rowHeight: number,
  horizontalGap: number,
  strokeWidth: number
): Task[] => {
  return _.map(allTasks, (task, index) => {
    let width = task.duration / timePerPixel - strokeWidth;
    if (width < 0) {
      width = 0;
    }
    const x = timeToPixelOffsetX(task.startTime, firstTime, timePerPixel);
    const y = (rowHeight + horizontalGap * 2) * index + horizontalGap;
    return {
      ...task,
      width,
      height: rowHeight,
      x,
      y
    };
  });
};

/**
 * Get maximal level of nested task children
 *
 * @param tasks
 */
const getMaximalLevel = (tasks: Task[]): number => {
  let maximalLevel = 0;
  _.forEach(tasks, task => {
    if (task.parents.length > maximalLevel) {
      maximalLevel = task.parents.length;
    }
  });
  return maximalLevel - 1;
};
/**
 * Get maximal expander width - to calculate straight task list text
 *
 * @param tasks
 * @param padding options.taskList.expander.padding
 * @param margin options.taskList.expander.margin
 */
const getMaximalExpanderWidth = (
  tasks: Task[],
  padding: number,
  margin: number
): number => {
  return getMaximalLevel(tasks) * padding + margin;
};

/**
 * Get one task height
 * @param height options.row.height
 * @param gap options.chart.grid.horizontal.gap
 * @param strokeWidth style["grid-line-horizontal"]["strokeWidth"]
 * @param withStroke
 */
const getTaskHeight = (
  height: number,
  gap: number,
  strokeWidth: number,
  withStroke = false
): number => {
  if (withStroke) {
    return (
      height + gap * 2 + strokeWidth
      // parseInt(`${style["grid-line-horizontal"]["strokeWidth"]}`)
    );
  }
  return height + gap * 2;
};

/**
 * Get specified tasks height
 *
 * @param visibleTasks
 * @param height options.row.height
 * @param gap options.chart.grid.horizontal.gap
 * @param strokeWidth style["grid-line-horizontal"]["strokeWidth"]
 */
const getTasksHeight = (
  visibleTasks: Task[],
  height: number,
  gap: number,
  strokeWidth: number
): number => {
  return visibleTasks.length * getTaskHeight(height, gap, strokeWidth);
};

/**
 * Get gantt total height
 * @param visibleTasks
 * @param rowHeight options.row.height
 * @param gridHorizontalGap options.chart.grid.horizontal.gap
 * @param calendarGap options.calendar.gap
 * @param calendarStrokeWidth options.calendar.strokeWidth
 * @param calendarHeight options.calendar.height
 * @param scrollBarHeight options.scrollBarHeight
 * @param outer
 */
const getHeight = (
  visibleTasks: Task[],
  rowHeight: number,
  gridHorizontalGap: number,
  calendarGap: number,
  calendarStrokeWidth: number,
  calendarHeight: number,
  scrollBarHeight: number,
  outer = false
): number => {
  let height =
    visibleTasks.length * (rowHeight + gridHorizontalGap * 2) +
    calendarHeight +
    calendarStrokeWidth +
    calendarGap;
  if (outer) {
    height += scrollBarHeight;
  }
  return height;
};

export {
  recalculateTasks,
  getMaximalLevel,
  getHeight,
  getTasksHeight,
  getTaskHeight,
  getMaximalExpanderWidth,
  fillTasks,
  makeTaskTree
};
