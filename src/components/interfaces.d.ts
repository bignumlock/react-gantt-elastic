import { Task } from "@/types";

export interface CalendarRowItems {
  key: string;
  children: Array<CalendarRowText>;
}

export interface CalendarRowText {
  index: number;
  key: string;
  x: number;
  y: number;
  width: number;
  textWidth: number;
  choosenFormatName?: string;
  height: number;
  label: string;
}

export interface TaskMap {
  [key: string]: Task;
}

export interface RootTask {
  id: null;
  label: "root";
  children: [];
  allChildren: [];
  parents: [];
  parent: null;
  dependentOn: [];
  parentId: null;
  __root: boolean;
}

export interface Task {
  id: React.ReactText; // *
  dependencyLines: Array<{ points?: string; taskId: React.ReactText }>;
  dependentOn: Array<React.ReactText>;
  parentId: React.ReactText | null;
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
  parent: React.ReactText | null;
  parents: Array<React.ReactText>;
  allChildren: Array<React.ReactText>;
  children: Array<React.ReactText>;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface GanttElasticRefs {
  taskListWrapper?: React.RefObject<HTMLDivElement>;
  chartGraphSvg?: React.RefObject<HTMLDivElement>;
  taskList?: React.RefObject<HTMLDivElement>;
  svgChart?: React.RefObject<HTMLDivElement>;
  taskListItems?: React.RefObject<HTMLDivElement>;
  chartGraph?: React.RefObject<HTMLDivElement>;
  chartCalendarContainer?: React.RefObject<HTMLDivElement>;
  chartGraphContainer?: React.RefObject<HTMLDivElement>;
  chartScrollContainerVertical?: React.RefObject<HTMLDivElement>;
  chartScrollContainerHorizontal?: React.RefObject<HTMLDivElement>;
  mainView?: React.RefObject<HTMLDivElement>;
  chartContainer?: React.RefObject<HTMLDivElement>;
  chart?: React.RefObject<HTMLDivElement>;
}

export interface ScrollOption {
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
}

export interface TimeOption {
  firstTime: number;
  lastTime: number;
  totalViewDurationMs: number;
  totalViewDurationPx: number;
  steps: StepOption[];
}

export interface StepOption {
  time: number;
  offset: { ms: number; px: number };
  width: { ms: number; px: number };
}
export interface TaskListOption {
  columns: TaskListColumnOption[];
  width: number;
  finalWidth: number;
  widthFromPercentage: number;
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

export interface CalendarOption {
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
}
export interface State {
  // width: number;
  // height: number;
  // clientWidth: number;
  // outerHeight: number;
  // rowsHeight: number;
  // scrollBarHeight: number;
  // allVisibleTasksHeight: number;
  scroll: ScrollOption;
  times: TimeOption;
  taskList: TaskListOption;
  calendar: CalendarOption;
}

export interface Options {
  scroll: {
    dragXMoveMultiplier: number; //*
    dragYMoveMultiplier: number; //*
  };
  scope: {
    //*
    before: number;
    after: number;
  };
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
    expander: {
      type: string;
      size: number;
      columnWidth: number;
      padding: number;
      margin: number;
      straight: boolean;
    };
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
