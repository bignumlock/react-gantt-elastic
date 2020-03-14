import { GanttElasticOptions } from "@/types";
import dayjs from "dayjs";
import locale from "dayjs/locale/zh-cn";
import { Options, State } from "../interfaces";

const defaultOptions: Options = {
  // width: 0,
  // height: 0,
  // clientWidth: 0,
  // outerHeight: 0,
  // rowsHeight: 0,
  // scrollBarHeight: 0,
  // allVisibleTasksHeight: 0,
  scroll: {
    dragXMoveMultiplier: 3, //*
    dragYMoveMultiplier: 2 //*
  },
  scope: {
    //*
    before: 1,
    after: 1
  },
  times: {
    firstTime: 0,
    lastTime: 0,
    timeScale: 60 * 1000,
    timeZoom: 17, //*
    timePerPixel: 0,
    stepDuration: "day"
  },
  row: {
    height: 24 //*
  },
  maxRows: 20, //*
  maxHeight: 0, //*
  chart: {
    grid: {
      horizontal: {
        gap: 6 //*
      }
    },
    progress: {
      width: 20, //*
      height: 6, //*
      pattern: true,
      bar: false
    },
    text: {
      offset: 4, //*
      xPadding: 10, //*
      display: true //*
    },
    expander: {
      type: "chart",
      display: false, //*
      displayIfTaskListHidden: true, //*
      offset: 4, //*
      size: 18
    }
  },
  taskList: {
    display: true, //*
    resizeAfterThreshold: true, //*
    widthThreshold: 75, //*
    columns: [
      {
        id: 0,
        label: "ID",
        value: "value",
        width: 40,
        style: {}
      },
      {
        id: 1,
        label: "Task Name",
        value: "value",
        width: 200,
        style: {}
      }
    ],
    percent: 100, //*
    minWidth: 18,
    expander: {
      type: "task-list",
      size: 16,
      columnWidth: 24,
      padding: 16,
      margin: 10,
      straight: false
    }
  },
  calendar: {
    workingDays: [1, 2, 3, 4, 5], //*
    gap: 6, //*
    strokeWidth: 1,
    hour: {
      height: 20, //*
      display: true, //*
      format: {
        //*
        long(date: dayjs.Dayjs): string {
          return date.format("HH:mm");
        },
        medium(date: dayjs.Dayjs): string {
          return date.format("HH:mm");
        },
        short(date: dayjs.Dayjs): string {
          return date.format("HH");
        }
      }
    },
    day: {
      height: 20, //*
      display: true, //*
      format: {
        long(date: dayjs.Dayjs): string {
          return date.format("DD dddd");
        },
        medium(date: dayjs.Dayjs): string {
          return date.format("DD ddd");
        },
        short(date: dayjs.Dayjs): string {
          return date.format("DD");
        }
      }
    },
    month: {
      height: 20, //*
      display: true, //*
      format: {
        //*
        short(date: dayjs.Dayjs): string {
          return date.format("MM");
        },
        medium(date: dayjs.Dayjs): string {
          return date.format("MMM 'YY");
        },
        long(date: dayjs.Dayjs): string {
          return date.format("MMMM YYYY");
        }
      }
    }
  },
  locale
};

/**
 * Helper function to fill out empty options in user settings
 *
 * @param {object} userOptions - initial user options that will merge with those below
 * @returns {object} merged options
 */
const getOptions = (userOptions?: Partial<GanttElasticOptions>): Options => {
  let localeName = "en";
  if (
    userOptions &&
    typeof userOptions.locale !== "undefined" &&
    typeof userOptions.locale.name !== "undefined"
  ) {
    localeName = userOptions.locale.name;
  }
  return {
    ...defaultOptions
  };
};

const defaultState: State = {
  width: 0,
  // height: 0,
  // clientWidth: 0,
  // outerHeight: 0,
  // rowsHeight: 0,
  // scrollBarHeight: 0,
  // allVisibleTasksHeight: 0,

  scroll: {
    scrolling: false,
    top: 0,
    left: 0,
    taskList: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    chart: {
      left: 0,
      right: 0,
      percent: 0,
      timePercent: 0,
      top: 0,
      bottom: 0,
      time: 0,
      timeCenter: 0,
      dateTime: {
        left: 0,
        right: 0
      }
    }
  },
  times: {
    firstTime: 0,
    lastTime: 0,
    totalViewDurationMs: 0,
    totalViewDurationPx: 0,
    steps: []
  },
  taskList: {
    columns: [],
    width: 0,
    finalWidth: 0,
    widthFromPercentage: 0
  },
  calendar: {
    height: 0,
    hour: {
      widths: [],
      maxWidths: { short: 0, medium: 0, long: 0 },
      formatted: {
        long: [],
        medium: [],
        short: []
      }
    },
    day: {
      widths: [],
      maxWidths: { short: 0, medium: 0, long: 0 }
    },
    month: {
      widths: [],
      maxWidths: { short: 0, medium: 0, long: 0 }
    }
  }
};

export { getOptions, defaultState, defaultOptions };
