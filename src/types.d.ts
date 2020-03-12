import dayjs from "dayjs";

// export interface TimeOption {
//   timeScale: number;
//   timeZoom: number; //*
//   timePerPixel: number;
//   firstTime: number;
//   lastTime: number;
//   firstTaskTime: dayjs.ConfigType | undefined;
//   lastTaskTime: dayjs.ConfigType | undefined;
//   totalViewDurationMs: number;
//   totalViewDurationPx: number;
//   stepDuration: dayjs.UnitType;
//   steps: StepOption[];
// }

// export interface ChartOption {
//   grid: {
//     horizontal: {
//       gap: number; //*
//     };
//   };
//   progress: {
//     width: number; //*
//     height: number; //*
//     pattern: boolean;
//     bar: boolean;
//   };
//   text: {
//     offset: 4; //*
//     xPadding: number; //*
//     display: boolean; //*
//   };
//   expander: {
//     type: string;
//     display: boolean; //*
//     displayIfTaskListHidden: boolean; //*
//     offset: number; //*
//     size: number;
//   };
// }

// export interface ScrollOption {
//   scrolling: boolean;
//   dragXMoveMultiplier: number; //*
//   dragYMoveMultiplier: number; //*
//   top: number;
//   left: number;
//   taskList: {
//     left: number;
//     right: number;
//     top: number;
//     bottom: number;
//   };
//   chart: {
//     left: number;
//     right: number;
//     percent: number;
//     timePercent: number;
//     top: number;
//     bottom: number;
//     time: number;
//     timeCenter: number;
//     dateTime: {
//       left: number;
//       right: number;
//     };
//   };
// }

// export interface TaskListOption {
//   display: boolean; //*
//   resizeAfterThreshold: boolean; //*
//   widthThreshold: number; //*
//   columns: TaskListColumnOption[]; //*;
//   percent: number; //*
//   width: number;
//   finalWidth: number;
//   widthFromPercentage: number;
//   minWidth: number;
//   expander: TaskListExpanderOption;
// }

// export interface TaskListExpanderOption {
//   type: string;
//   size: number;
//   columnWidth: number;
//   padding: number;
//   margin: number;
//   straight: boolean;
// }

// export interface CalendarOption {
//   workingDays: number[]; //*
//   gap: number; //*
//   height: number;
//   strokeWidth: number;
//   hour: {
//     height: number; //*
//     display: boolean; //*
//     widths: CalendarItemWidths[];
//     maxWidths: CalendarItemWidths;
//     formatted: Formatted;
//     format: DateFormat; //*
//   };
//   day: {
//     height: number; //*
//     display: boolean; //*
//     widths: CalendarItemWidths[];
//     maxWidths: CalendarItemWidths;
//     format: DateFormat; //*
//   };
//   month: {
//     height: number; //*
//     display: boolean; //*
//     widths: CalendarItemWidths[];
//     maxWidths: CalendarItemWidths;
//     format: DateFormat; //*
//   };
// }

// export interface HeaderOptions {
//   height: number;
//   marginBottom: number;
// }

// export interface Options {
//   width: number;
//   height: number;
//   clientWidth: number;
//   outerHeight: number;
//   rowsHeight: number;
//   allVisibleTasksHeight: number;
//   scrollBarHeight: number;
//   scroll: ScrollOption;
//   scope: ScopeOption;
//   times: TimeOption;
//   row: {
//     height: number; //*
//   };
//   maxRows?: number; //*
//   maxHeight?: number; //*
//   chart: ChartOption;
//   taskList: TaskListOption;
//   calendar: CalendarOption;
//   locale: ILocal;
//   localeName: string;
// }

export interface StepOption {
  time: number;
  offset: { ms: number; px: number };
  width: { ms: number; px: number };
}

export interface TaskListColumnOption {
  id: number;
  label: string;
  value: string | Function;
  width: number;
  height: number;
  style: DynamicStyle;
  finalWidth: number;
  thresholdPercent: number;
  widthFromPercentage: number;
  events?: {
    [key: string]: (a: {
      event: React.MouseEvent | React.TouchEvent;
      data: Task;
      column: TaskListColumnOption;
    }) => void;
  };
  expander: boolean;
  _key: string;
}

// export interface ScopeOption {
//   //*
//   before: number;
//   after: number;
// }

export interface DateFormat {
  long?: (date: dayjs.Dayjs) => string;
  medium?: (date: dayjs.Dayjs) => string;
  short?: (date: dayjs.Dayjs) => string;
  [key: string]: (date: dayjs.Dayjs) => string;
}

export interface CalendarItemWidths {
  short?: number;
  medium?: number;
  long?: number;
  [key: string]: number;
}

export interface Formatted {
  long: string[];
  medium: string[];
  short: string[];
  [key: string]: string[];
}

export interface Task {
  dependencyLines: Array<{ points?: string; taskId: string | number }>;
  dependentOn: Array<string | number>;
  id: string | number; // *
  parentId: string | number | null;
  start: dayjs.ConfigType; // *
  startTime: number;
  end: dayjs.ConfigType;
  endTime: number;
  label: string; // *
  duration: number; // *
  progress: number; // *
  type: string;
  style: DynamicStyle;
  collapsed: boolean;
  // extends
  // parent: Task | null | string | number;
  // parents: Task[] | string[] | number[];
  // allChildren: Task[] | string[] | number[];
  // children: Task[] | string[] | number[];
  parent: string | number | null;
  parents: Array<string | number>;
  allChildren: Array<string | number>;
  children: Array<string | number>;
  mouseOver: boolean;
  height: number;
  width: number;
  y: number;
  x: number;
  __root?: boolean;
  events?: {
    [key: string]: (
      event: React.MouseEvent | React.TouchEvent,
      task: Task
    ) => void;
  };
}

export interface DynamicStyle {
  // "grid-line-horizontal"?: {
  //   stroke: string;
  //   strokeWidth: number;
  // };
  [key: string]: {
    // [key: string]: CSSProperties;
    [key: string]: string | number;
  };
}

export interface GanttElasticState {
  width: number;
  // height: number;
  // clientWidth: number;
  // outerHeight: number;
  // rowsHeight: number;
  // scrollBarHeight: number;
  // allVisibleTasksHeight: number;
  scroll: {
    scrolling: boolean;
    top: number;
    left: number;
    taskList: {
      left: number;
      right: number;
      top: number;
      bottom: number;
    };
    chart: {
      left: number;
      right: number;
      percent: number;
      timePercent: number;
      top: number;
      bottom: number;
      time: number;
      timeCenter: number;
      dateTime: {
        left: number;
        right: number;
      };
    };
  };
  times: {
    firstTime: number;
    lastTime: number;
    totalViewDurationMs: number;
    totalViewDurationPx: number;
    steps: StepOption[];
  };
  taskList: {
    columns: TaskListColumnOption[];
    width: number;
    finalWidth: number;
    widthFromPercentage: number;
  };
  calendar: {
    height: number;
    hour: {
      widths: CalendarItemWidths[];
      maxWidths: CalendarItemWidths;
      formatted: Formatted;
    };
    day: {
      widths: CalendarItemWidths[];
      maxWidths: CalendarItemWidths;
    };
    month: {
      widths: CalendarItemWidths[];
      maxWidths: CalendarItemWidths;
    };
  };
}

export interface GanttElasticTask {
  id: string | number; // *
  parentId?: string | number;
  dependentOn?: string[];
  start: dayjs.ConfigType; // *
  startTime?: number;
  end?: dayjs.ConfigType;
  endTime?: number;
  label: string; // *
  duration: number; // *
  progress: number; // *
  type?: string;
  style?: DynamicStyle;
  collapsed?: boolean;
  events?: {
    [key: string]: (a: {
      event: React.MouseEvent | React.TouchEvent;
      task: Task;
    }) => void;
  };
}

export interface GanttElasticOptions {
  scroll: {
    dragXMoveMultiplier: number; //*
    dragYMoveMultiplier: number; //*
  };
  scope: ScopeOption;
  times: {
    timeScale: number;
    timeZoom: number; //*
    firstTime: number;
    lastTime: number;
    timePerPixel: number; // 计算值，设置无效
    stepDuration: dayjs.UnitType;
  };
  row: {
    height: number; //*
  };
  maxRows: number; //*
  maxHeight: number; //*
  chart: {
    grid: {
      horizontal: {
        gap: number; //*
      };
    };
    progress: {
      width: number; //*
      height: number; //*
      pattern: boolean;
      bar: boolean;
    };
    text: {
      offset: number; //*
      xPadding: number; //*
      display: boolean; //*
    };
    expander: {
      type: string;
      display: boolean; //*
      displayIfTaskListHidden: boolean; //*
      offset: number; //*
      size: number;
    };
  };
  taskList: {
    display: boolean; //*
    resizeAfterThreshold: boolean; //*
    widthThreshold: number; //*
    columns: GanttElasticTaskListColumn[];
    percent: number; //*
    minWidth: number;
    expander: TaskListExpanderOption;
  };
  calendar: {
    workingDays: number[]; //*
    gap: number; //*
    strokeWidth: number;
    hour: {
      height: number; //*
      display: boolean; //*
      format: DateFormat; //*
    };
    day: {
      height: number; //*
      display: boolean; //*
      format: DateFormat; //*
    };
    month: {
      height: number; //*
      display: boolean; //*
      format: DateFormat; //*
    };
  };
  locale: ILocale;
}

export interface GanttElasticTaskListColumn {
  id: number;
  label: string;
  value: string | Function;
  style?: DynamicStyle;
  width: number;
  events?: {
    [key: string]: (a: {
      event: React.MouseEvent | React.TouchEvent;
      data: Task;
      column: TaskListColumnOption;
    }) => void;
  };
  expander?: boolean;
}
