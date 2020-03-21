import dayjs from "dayjs";
import _ from "lodash";
import React, {
  CSSProperties,
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState
} from "react";
import ResizeObserver from "resize-observer-polyfill";
import Immutable, { ImmutableObject } from "seamless-immutable";
import invariant from "ts-invariant";
import {
  GanttElasticRefs,
  State,
  Task,
  TaskMap
} from "./components/interfaces";
import MainView from "./components/MainView";
import { timeToPixelOffsetX } from "./components/utils/charts";
import {
  calculateTaskListColumnsDimensions,
  initialzeColumns
} from "./components/utils/columns";
import { defaultState, getOptions } from "./components/utils/options";
import { prepareStyle } from "./components/utils/style";
import {
  fillTasks,
  getHeight,
  getTasksHeight,
  makeTaskTree,
  recalculateTasks
} from "./components/utils/tasks";
import {
  calculateSteps,
  calculateTimePerPixel,
  calculateTotalViewDurationMs,
  calculateTotalViewDurationPx,
  calculateWidth,
  computeDayWidths,
  computeHourWidths,
  computeMonthWidths
} from "./components/utils/times";
import GanttElasticContext from "./GanttElasticContext";
import { emitEvent } from "./GanttElasticEvents";
import { DynamicStyle, GanttElasticOptions, GanttElasticTask } from "./types";

const ctx = document.createElement("canvas").getContext("2d");

interface ComponentProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  style?: CSSProperties;
}

export interface GanttElasticProps extends ComponentProps {
  // 如果没有设置开始时间和结束时间，通过计算tasks的最小开始时间和最大结束时间作为Chart显示时间范围
  // firstTime?: dayjs.ConfigType | undefined; // Gantt图开始时间
  // lastTime?: dayjs.ConfigType | undefined; // Gantt图结束时间
  // columns: Array<GanttElasticTaskListColumn>;
  tasks: Partial<GanttElasticTask>[];
  options?: Partial<GanttElasticOptions>;
  dynamicStyle?: DynamicStyle;
}

type GanttElasticState = {
  resizeObserver?: ResizeObserver;
  chartWidth: number;
  // clientWidth: number;
} & State;

const reducer: Reducer<
  ImmutableObject<GanttElasticState>,
  { type: string; payload: any }
> = (state, action) => {
  const immutableState = Immutable.isImmutable(state)
    ? state
    : Immutable(state);
  if (action.type === "scroll") {
    // const scroll = Immutable.merge(state.scroll, );
    // return Immutable.merge(state, { ...action.payload });
  } else if (action.type === "update-calendar-height") {
    return immutableState.setIn(["calendar", "height"], action.payload);
  } else if (action.type === "resize") {
    return immutableState.setIn(["clientWidth"], action.payload);
  }
  return immutableState.merge(action.payload, { deep: true });
};

const GanttElastic: React.FC<GanttElasticProps> = ({
  header,
  footer,
  options: userOptions,
  tasks: userTasks,
  dynamicStyle: userDynamicStyle,
  style: userStyle,
  children
}) => {
  // refs
  const [refs] = useState<GanttElasticRefs>({});

  const [
    { calendar, times, taskList, scroll, chartWidth, ...others },
    dispatch
  ] = useReducer(
    reducer,
    Immutable({ ...defaultState, chartWidth: 0 }),
    init => init
  );

  // refs
  const ganttElastic = useRef<HTMLDivElement>(null);

  const clientWidth = ganttElastic.current?.clientWidth ?? 0;

  /**
   * Initialize Options
   */
  const options = useMemo(() => {
    const options = Immutable(getOptions(userOptions)).merge(
      userOptions ?? {},
      { deep: true } // perform a deep merge
    );

    dayjs.locale(options.locale.asMutable({ deep: true }), undefined, true);
    dayjs.locale(options.locale.name);
    // ****recalculate time variables
    const timePerPixel = calculateTimePerPixel(
      options.times.timeScale,
      options.times.timeZoom
    );
    return options.setIn(["times", "timePerPixel"], timePerPixel);
  }, [userOptions]);

  /**
   * Initialize Style
   */
  const style = useMemo(() => {
    const dynamicStyle: DynamicStyle = Immutable(
      prepareStyle(userDynamicStyle)
    ).merge(
      userDynamicStyle ?? {},
      { deep: true } // perform a deep merge
    );

    return dynamicStyle;
  }, [userDynamicStyle]);

  // 初始化userTasks，计算task的最小开始时间和最大结束时间
  const { allTasks, tasksById, firstTime, lastTime } = useMemo(() => {
    const tasksById: TaskMap = {};
    const newTasks: Task[] = [];
    let firstTaskTime = Number.MAX_SAFE_INTEGER;
    let lastTaskTime = 0;
    // Mapping Tasks
    _.forEach(userTasks, task => {
      const newTask: Task = fillTasks(task);
      tasksById[newTask.id] = newTask;
      newTasks.push(newTask);

      if (newTask.startTime < firstTaskTime) {
        firstTaskTime = newTask.startTime;
      }
      if (newTask.startTime + newTask.duration > lastTaskTime) {
        lastTaskTime = newTask.startTime + newTask.duration;
      }
    });

    const taskTree = makeTaskTree(
      {
        id: 0,
        label: "root",
        start: 0,
        startTime: 0,
        duration: 0,
        children: [],
        allChildren: [],
        parents: [],
        parent: null,
        dependentOn: [],
        parentId: null,
        end: 0,
        endTime: 0,
        progress: 0,
        type: "rootTask",
        collapsed: false,
        mouseOver: false,
        height: 0,
        width: 0,
        y: 0,
        x: 0,
        __root: true,
        style: {},
        dependencyLines: []
      },
      newTasks
    );

    // 如果没有指定开始时间或结束时间，用任务队列的最小开始时间或最大结束时间
    const first = dayjs(options.times.firstTime || firstTaskTime)
      .locale(options.locale.name)
      .subtract(options.scope.before, "day")
      .startOf("day");
    const last = dayjs(options.times.lastTime || lastTaskTime)
      .locale(options.locale.name)
      .add(options.scope.after, "day")
      .endOf("day");

    invariant.warn(
      `firstTime->`,
      first.format("YYYY-MM-DD HH:mm:ss SSS [Z] A"),
      `lastTime->`,
      last.format("YYYY-MM-DD HH:mm:ss SSS [Z] A")
    );

    const firstTime = first.valueOf();
    const lastTime = last.valueOf();

    const strokeWidth = parseInt(
      `${style["grid-line-vertical"]["strokeWidth"]}`
    );

    // 依赖timePerPixel的参数计算task的x、y、width和height等属性
    const allTasks = recalculateTasks(
      _.map(taskTree.allChildren, childId => tasksById[childId]),
      firstTime,
      options.times.timePerPixel,
      options.row.height,
      options.chart.grid.horizontal.gap,
      strokeWidth
    );

    return {
      tasksById,
      allTasks,
      firstTime,
      lastTime
    };
  }, [
    options.chart.grid.horizontal.gap,
    options.locale.name,
    options.row.height,
    options.scope.after,
    options.scope.before,
    options.times.firstTime,
    options.times.lastTime,
    options.times.timePerPixel,
    style,
    userTasks
  ]);

  // 依赖tallTasks的`firstTaskTime`和`lastTaskTime`计算时间与像素的参数
  useEffect(() => {
    // ****recalculate time variables
    // const timePerPixel = calculateTimePerPixel(
    //   options.times.timeScale,
    //   options.times.timeZoom
    // );
    const totalViewDurationMs = calculateTotalViewDurationMs(
      firstTime,
      lastTime
    );
    const totalViewDurationPx = calculateTotalViewDurationPx(
      totalViewDurationMs,
      options.times.timePerPixel
    );
    // 根据时间计算chart的宽度，只要时间范围不变化就不需要重新计算
    const chartWidth = calculateWidth(
      totalViewDurationPx,
      parseInt(`${style["grid-line-vertical"]["strokeWidth"]}`)
    );

    const steps = calculateSteps(
      firstTime,
      lastTime,
      options.times.timePerPixel,
      totalViewDurationMs,
      totalViewDurationPx,
      options.times.stepDuration
    );
    // recalculate time variables*****

    // Compute calendar hours column widths basing on text widths
    const hourVariables = computeHourWidths(
      options.calendar.hour.format,
      options.locale.name,
      style,
      ctx
    );
    // Compute calendar days column widths basing on text widths
    const dayVariables = computeDayWidths(
      steps,
      options.calendar.day.format,
      options.locale.name,
      style,
      ctx
    );
    // Compute month calendar columns widths basing on text widths
    const monthVariables = computeMonthWidths(
      firstTime,
      lastTime,
      options.calendar.month.format,
      options.locale.name,
      style,
      ctx
    );

    dispatch({
      type: "initialize",
      payload: {
        times: {
          firstTime,
          lastTime,
          totalViewDurationMs,
          totalViewDurationPx,
          steps
        },
        chartWidth,
        calendar: {
          hour: hourVariables,
          day: dayVariables,
          month: monthVariables
        }
      }
    });
  }, [
    firstTime,
    lastTime,
    options.calendar.day.format,
    options.calendar.hour.format,
    options.calendar.month.format,
    options.locale.name,
    options.times.stepDuration,
    options.times.timePerPixel,
    style
  ]);

  // 初始化columns和显示属性的计算
  useEffect(() => {
    const columns = initialzeColumns(
      options.taskList.columns.asMutable({ deep: true })
    );
    const taskListVariables = calculateTaskListColumnsDimensions(
      columns,
      allTasks,
      options.taskList.percent,
      options.taskList.expander.padding,
      options.taskList.expander.margin,
      options.row.height,
      options.chart.grid.horizontal.gap,
      parseInt(`${style["grid-line-horizontal"]["strokeWidth"]}`)
    );

    dispatch({
      type: "initialize",
      payload: {
        taskList: taskListVariables
      }
    });
  }, [
    allTasks,
    options.chart.grid.horizontal.gap,
    options.row.height,
    options.taskList.columns,
    options.taskList.expander.margin,
    options.taskList.expander.padding,
    options.taskList.percent,
    style
  ]);

  /**
   * Calculate height of scrollbar in current browser
   *
   * @returns {number}
   */
  const getScrollBarHeight = useCallback(() => {
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.height = "100px";
    outer.style.msOverflowStyle = "scrollbar";
    document.body.appendChild(outer);
    const noScroll = outer.offsetHeight;
    outer.style.overflow = "scroll";
    const inner = document.createElement("div");
    inner.style.height = "100%";
    outer.appendChild(inner);
    const withScroll = inner.offsetHeight;
    outer.parentNode?.removeChild(outer);
    const height = noScroll - withScroll;
    // style["chart-scroll-container--vertical"]["marginLeft"] = `-${height}px`;
    return height;
  }, []);

  /**
   * Get task by id
   *
   * @param {any} taskId
   * @returns {object|null} task
   */
  const getTask = useCallback(
    (taskId: number | string | null) => {
      if (taskId && typeof tasksById[taskId] !== "undefined") {
        return tasksById[taskId];
      }
      return null;
    },
    [tasksById]
  );

  /**
   * Is task visible
   *
   * @param {Number|String|Task} task
   */
  const isTaskVisible = useCallback(
    task => {
      if (typeof task === "number" || typeof task === "string") {
        task = getTask(task);
      }
      for (let i = 0, len = task.parents.length; i < len; i++) {
        if (getTask(task.parents[i])?.collapsed) {
          return false;
        }
      }
      return true;
    },
    [getTask]
  );

  // 根据visibleTasks计算高度，总是会变化的
  const {
    visibleTasks,
    clientHeight,
    scrollBarHeight,
    allVisibleTasksHeight,
    outerHeight,
    rowsHeight
  } = useMemo(() => {
    const strokeWidth = parseInt(
      `${style["grid-line-horizontal"]["strokeWidth"]}`
    );
    const visibleTasks = _.filter(allTasks, task => isTaskVisible(task));
    const maxRows = visibleTasks.slice(0, options.maxRows);
    let rowsHeight = getTasksHeight(
      maxRows,
      options.row.height,
      options.chart.grid.horizontal.gap,
      strokeWidth
    );
    let heightCompensation = 0;
    if (options.maxHeight && rowsHeight > options.maxHeight) {
      heightCompensation = rowsHeight - options.maxHeight;
      rowsHeight = options.maxHeight;
    }
    const scrollBarHeight = getScrollBarHeight();
    const clientHeight =
      getHeight(
        maxRows,
        options.row.height,
        options.chart.grid.horizontal.gap,
        options.calendar.gap,
        options.calendar.strokeWidth,
        calendar.height,
        scrollBarHeight
      ) - heightCompensation;
    const allVisibleTasksHeight = getTasksHeight(
      visibleTasks,
      options.row.height,
      options.chart.grid.horizontal.gap,
      strokeWidth
    );
    const outerHeight =
      getHeight(
        maxRows,
        options.row.height,
        options.chart.grid.horizontal.gap,
        options.calendar.gap,
        options.calendar.strokeWidth,
        calendar.height,
        scrollBarHeight,
        true
      ) - heightCompensation;

    return {
      visibleTasks,
      clientHeight,
      allVisibleTasksHeight,
      outerHeight,
      rowsHeight,
      scrollBarHeight
    };
  }, [
    allTasks,
    calendar.height,
    getScrollBarHeight,
    isTaskVisible,
    options.calendar.gap,
    options.calendar.strokeWidth,
    options.chart.grid.horizontal.gap,
    options.maxHeight,
    options.maxRows,
    options.row.height,
    style
  ]);

  /**
   * Get svg
   *
   * @returns {string} html svg image of gantt
   */
  const getSVG = useCallback(() => {
    const { mainView } = refs;
    return mainView?.current?.outerHTML;
  }, [refs]);

  /**
   * Get image
   *
   * @param {string} type image format
   * @returns {Promise} when resolved returns base64 image string of gantt
   */
  const getImage = useCallback(
    (type = "image/png") => {
      return new Promise(resolve => {
        const svg = getSVG();
        if (svg) {
          const { mainView } = refs;
          const img = new Image();
          img.onload = (): void => {
            const canvas = document.createElement("canvas");
            if (mainView?.current) {
              canvas.width = mainView.current.clientWidth;
              canvas.height = rowsHeight;
              canvas.getContext("2d")?.drawImage(img, 0, 0);
              resolve(canvas.toDataURL(type));
            }
          };
          img.src = "data:image/svg+xml," + encodeURIComponent(svg);
        }
      });
    },
    [getSVG, refs, rowsHeight]
  );

  /**
   * Convert pixel offset inside chart to corresponding time offset in milliseconds
   *
   * @param {number} pixelOffsetX
   * @returns {int} milliseconds
   */
  const pixelOffsetXToTime = useCallback(
    pixelOffsetX => {
      const offset =
        pixelOffsetX +
        parseInt(`${style["grid-line-vertical"]["strokeWidth"]}`) / 2;
      return offset * options.times.timePerPixel + times.firstTime;
    },
    [style, times.firstTime, options.times.timePerPixel]
  );

  /**
   * Synchronize scrollTop property when row height is changed
   */
  const syncScrollTop = useCallback(() => {
    const { taskListItems, chartGraph, chartScrollContainerVertical } = refs;
    if (
      taskListItems &&
      taskListItems.current &&
      chartGraph &&
      chartGraph.current &&
      chartScrollContainerVertical &&
      chartScrollContainerVertical.current &&
      chartGraph.current.scrollTop !== taskListItems.current.scrollTop
    ) {
      taskListItems.current.scrollTop = chartScrollContainerVertical.current.scrollTop =
        chartGraph.current.scrollTop;
      // scroll.top = taskListItems.current.scrollTop = chartScrollContainerVertical.current.scrollTop =
      //   chartGraph.current.scrollTop;
    }
  }, [refs]);

  /**
   * Scroll chart or task list to specified pixel values
   *
   * @param {number|null} left
   * @param {number|null} top
   */
  const scrollTo = useCallback(
    (left = null, top = null) => {
      const {
        taskListItems,
        chartGraph,
        chartScrollContainerVertical,
        chartCalendarContainer,
        chartGraphContainer,
        chartScrollContainerHorizontal
      } = refs;
      if (
        left !== null &&
        chartCalendarContainer?.current &&
        chartGraphContainer?.current &&
        chartScrollContainerHorizontal?.current
      ) {
        chartCalendarContainer.current.scrollLeft = left;
        chartGraphContainer.current.scrollLeft = left;
        chartScrollContainerHorizontal.current.scrollLeft = left;
        // scroll.left = left;
      }
      if (
        top !== null &&
        chartGraph?.current &&
        taskListItems?.current &&
        chartScrollContainerVertical?.current
      ) {
        chartScrollContainerVertical.current.scrollTop = top;
        chartGraph.current.scrollTop = top;
        taskListItems.current.scrollTop = top;
        // scroll.top = top;
        syncScrollTop();
      }
    },
    [refs, syncScrollTop]
  );

  /**
   * After same as above but with different arguments - normalized
   *
   * @param {number} left
   * @param {number} top
   */
  const _onScrollChart = useCallback(
    (left, top) => {
      if (scroll.chart.left === left && scroll.chart.top === top) {
        return;
      }
      const _scroll = {
        top,
        left,
        chart: {
          left: 0,
          right: 0,
          percent: 0,
          top: 0,
          time: 0,
          timeCenter: 0,
          dateTime: { left: 0, right: 0 }
        }
      };
      const { chartContainer, chart } = refs;
      const chartContainerWidth = chartContainer?.current?.clientWidth ?? 0;
      _scroll.chart.left = left;
      _scroll.chart.right = left + chartContainerWidth;
      _scroll.chart.percent = (left / times.totalViewDurationPx) * 100;
      _scroll.chart.top = top;
      _scroll.chart.time = pixelOffsetXToTime(left);
      _scroll.chart.timeCenter = pixelOffsetXToTime(
        left + chartContainerWidth / 2
      );
      _scroll.chart.dateTime.left = dayjs(_scroll.chart.time).valueOf();
      _scroll.chart.dateTime.right = dayjs(
        pixelOffsetXToTime(left + chart?.current?.clientWidth)
      ).valueOf();
      _scroll.top = top;
      _scroll.left = left;

      dispatch({ type: "", payload: { scroll: _scroll } });

      scrollTo(left, top);
    },
    [
      pixelOffsetXToTime,
      refs,
      scroll.chart.left,
      scroll.chart.top,
      scrollTo,
      times.totalViewDurationPx
    ]
  );

  /**
   * Scroll current chart to specified time (in milliseconds)
   *
   * @param {int} time
   */
  const scrollToTime = useCallback(
    time => {
      const { chartContainer } = refs;
      if (chartContainer?.current) {
        let pos = timeToPixelOffsetX(
          time,
          times.firstTime,
          options.times.timePerPixel
        );
        const chartContainerWidth = chartContainer.current.clientWidth;
        pos = pos - chartContainerWidth / 2;
        if (pos > chartWidth) {
          pos = chartWidth - chartContainerWidth;
        }
        scrollTo(pos);
      }
    },
    [chartWidth, options.times.timePerPixel, refs, scrollTo, times.firstTime]
  );

  /**
   * After some actions like time zoom change we need to recompensate scroll position
   * so as a result everything will be in same place
   */
  const fixScrollPos = useCallback(() => {
    scrollToTime(scroll.chart.timeCenter);
  }, [scroll.chart.timeCenter, scrollToTime]);

  /**
   * Mouse wheel event handler
   */
  const onWheelChart = useCallback(
    ev => {
      const { chartGraph, chartScrollContainerHorizontal } = refs;
      const chartClientWidth =
        chartScrollContainerHorizontal?.current?.clientWidth ?? 0;
      const chartScrollWidth =
        chartScrollContainerHorizontal?.current?.scrollWidth ?? 0;
      if (!ev.shiftKey && ev.deltaX === 0) {
        let top = scroll.top + ev.deltaY;
        const chartClientHeight = rowsHeight;
        const scrollHeight =
          chartGraph?.current?.scrollHeight ?? 0 - chartClientHeight;
        if (top < 0) {
          top = 0;
        } else if (top > scrollHeight) {
          top = scrollHeight;
        }
        scrollTo(null, top);
      } else if (ev.shiftKey && ev.deltaX === 0) {
        let left = scroll.left + ev.deltaY;

        const scrollWidth = chartScrollWidth - chartClientWidth;
        if (left < 0) {
          left = 0;
        } else if (left > scrollWidth) {
          left = scrollWidth;
        }
        scrollTo(left);
      } else {
        let left = scroll.left + ev.deltaX;
        const scrollWidth = chartScrollWidth - chartClientWidth;
        if (left < 0) {
          left = 0;
        } else if (left > scrollWidth) {
          left = scrollWidth;
        }
        scrollTo(left);
      }
    },
    [refs, rowsHeight, scroll, scrollTo]
  );

  /**
   * Chart scroll event handler
   *
   * @param {event} ev
   */
  const onScrollChart = useCallback(
    ev => {
      const {
        chartScrollContainerVertical,
        chartScrollContainerHorizontal
      } = refs;
      _onScrollChart(
        chartScrollContainerHorizontal?.current?.scrollLeft,
        chartScrollContainerVertical?.current?.scrollTop
      );
    },

    [_onScrollChart, refs]
  );

  /**
   * Listen to specified event names
   */
  useEffect(() => {
    emitEvent.on("chart-scroll-horizontal", onScrollChart);
    emitEvent.on("chart-scroll-vertical", onScrollChart);
    emitEvent.on("chart-wheel", onWheelChart);
    return (): void => {
      emitEvent.removeAllListeners("taskList-collapsed-change");
      emitEvent.removeAllListeners("chart-scroll-horizontal");
      emitEvent.removeAllListeners("chart-scroll-vertical");
      emitEvent.removeAllListeners("chart-wheel");
    };
  }, [onScrollChart, onWheelChart]);

  // 渲染时跳转到当前时间
  const render = times && times.steps && times.steps.length > 0;
  useEffect(() => {
    render && scrollToTime(new Date().getTime());
  }, [render, scrollToTime]);

  return (
    <GanttElasticContext.Provider
      value={{
        options,
        style,
        ctx,
        refs,
        dispatch,
        isTaskVisible,
        getTask,
        visibleTasks,
        allTasks,
        chartWidth,
        clientHeight,
        clientWidth,
        outerHeight,
        rowsHeight,
        scrollBarHeight,
        allVisibleTasksHeight,
        calendar,
        times,
        scroll,
        taskList,
        ...others
      }}
    >
      <div
        className="gantt-elastic"
        style={{
          width: "100%",
          ...userStyle
        }}
        ref={ganttElastic}
      >
        {header}
        {render && <MainView />}
        {children}
        {footer}
      </div>
    </GanttElasticContext.Provider>
  );
};

// export default forwardRef(props => <GanttElastic {...props}></GanttElastic>);
export default GanttElastic;
