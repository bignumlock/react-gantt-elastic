/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import Immutable, { ImmutableObject } from "seamless-immutable";
import {
  CalendarOption,
  GanttElasticRefs,
  Options,
  ScrollOption,
  Task,
  TaskListOption,
  TimeOption
} from "./components/interfaces";
import { defaultOptions, defaultState } from "./components/utils/options";
import { DynamicStyle } from "./types";

export default React.createContext<{
  dispatch?: React.Dispatch<{ type: string; payload: any }>;
  isTaskVisible?: (task: Task) => boolean;
  getTask?: (taskId: string | number) => Task;
  ctx?: CanvasRenderingContext2D | null;
  refs: GanttElasticRefs;
  style: DynamicStyle;
  allTasks: Task[];
  visibleTasks: Task[];
  // calendar: ImmutableObject<CalendarOption>;
  options: ImmutableObject<Options>;
  scroll: ImmutableObject<ScrollOption>;
  times: ImmutableObject<TimeOption>;
  taskList: ImmutableObject<TaskListOption>;
  calendar: ImmutableObject<CalendarOption>;
  chartWidth: number;
  clientHeight: number;
  clientWidth: number;
  outerHeight: number;
  rowsHeight: number;
  scrollBarHeight: number;
  allVisibleTasksHeight: number;
}>({
  refs: {},
  allTasks: [],
  visibleTasks: [],
  style: {},
  chartWidth: 0,
  clientHeight: 0,
  clientWidth: 0,
  outerHeight: 0,
  rowsHeight: 0,
  scrollBarHeight: 0,
  allVisibleTasksHeight: 0,

  options: Immutable(defaultOptions),
  ...Immutable(defaultState)
});
