import dayjs from "dayjs";
import { Task, TaskListColumnOption } from "./components/interfaces";

declare interface DynamicStyle {
  [key: string]: {
    [key: string]: string | number;
  };
}

declare interface GanttElasticTask {
  id: string | number; // *
  parentId?: string | number;
  dependentOn?: string[] | number[];
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
    [key: string]: (
      event: React.MouseEvent | React.TouchEvent,
      task: Task
    ) => void;
  };
}

declare interface GanttElasticOptions {
  scroll?: {
    dragXMoveMultiplier?: number; //*
    dragYMoveMultiplier?: number; //*
  };
  scope?: {
    //*
    before: number;
    after: number;
  };
  times?: {
    timeScale?: number;
    timeZoom?: number; //*
    firstTime?: number;
    lastTime?: number;
    timePerPixel?: number; // 计算值，设置无效
    stepDuration?: dayjs.UnitType;
  };
  row: {
    height?: number; //*
  };
  maxRows?: number; //*
  maxHeight?: number; //*
  chart?: {
    grid?: {
      horizontal: {
        gap: number; //*
      };
    };
    progress?: {
      width?: number; //*
      height?: number; //*
      pattern?: boolean;
      bar?: boolean;
    };
    text?: {
      offset?: number; //*
      xPadding?: number; //*
      display?: boolean; //*
    };
    expander?: {
      type?: string;
      display?: boolean; //*
      displayIfTaskListHidden?: boolean; //*
      offset?: number; //*
      size?: number;
    };
  };
  taskList?: {
    display?: boolean; //*
    resizeAfterThreshold?: boolean; //*
    widthThreshold?: number; //*
    columns?: GanttElasticTaskListColumn[];
    percent?: number; //*
    minWidth?: number;
    expander?: {
      type?: string;
      size?: number;
      columnWidth?: number;
      padding?: number;
      margin?: number;
      straight?: boolean;
    };
  };
  calendar?: GanttElasticCalendar;
  locale?: ILocale;
}

declare interface GanttElasticTaskListColumn {
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

declare interface GanttElasticCalendar {
  workingDays?: number[]; //*
  gap?: number; //*
  strokeWidth?: number;
  hour?: {
    height?: number; //*
    display?: boolean; //*
    format?: DateFormat; //*
  };
  day?: {
    height?: number; //*
    display?: boolean; //*
    format?: DateFormat; //*
  };
  month?: {
    height?: number; //*
    display?: boolean; //*
    format?: DateFormat; //*
  };
}

declare interface DateFormat {
  long?: (date: dayjs.Dayjs) => string;
  medium?: (date: dayjs.Dayjs) => string;
  short?: (date: dayjs.Dayjs) => string;
  [key: string]: (date: dayjs.Dayjs) => string;
}
