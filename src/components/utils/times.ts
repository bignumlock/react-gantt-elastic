import { DateFormat, DynamicStyle } from "@/types";
import dayjs from "dayjs";
import {
  CalendarItemWidths,
  CalendarRowItems,
  Formatted,
  Options,
  StepOption
} from "../interfaces";

export interface DateCount {
  count: number;
  type: string;
}

/**
 * RecalculateTimes function's part
 * @param totalViewDurationPx options.times.totalViewDurationPx
 * @param strokeWidth style["grid-line-vertical"]["strokeWidth"]
 * @return options.width
 */
const width: (totalViewDurationPx: number, strokeWidth: number) => number = (
  totalViewDurationPx,
  strokeWidth
) => {
  return totalViewDurationPx + strokeWidth;
};

/**
 * RecalculateTimes function's part
 * @param timeScale options.times.timeScale
 * @param timeZoom options.times.timeZoom
 *
 * @return options.times.timePerPixel
 */
const timePerPixel: (timeScale: number, timeZoom: number) => number = (
  timeScale,
  timeZoom
) => {
  const max = timeScale * 60;
  const min = timeScale;
  const steps = max / min;
  const percent = timeZoom / 100;
  return timeScale * steps * percent + Math.pow(2, timeZoom);
};

/**
 * RecalculateTimes function's part
 * @param firstTime options.times.firstTime
 * @param lastTime options.times.lastTime
 *
 * @return options.times.totalViewDurationMs
 */
const totalViewDurationMs: (
  firstTime: dayjs.ConfigType,
  lastTime: dayjs.ConfigType
) => number = (firstTime, lastTime) => {
  if (typeof firstTime === "number" && typeof lastTime === "number") {
    return lastTime - firstTime;
  }
  return dayjs(lastTime).diff(firstTime, "millisecond");
};

/**
 *
 * RecalculateTimes function's part
 * @param totalViewDurationMs options.times.totalViewDurationMs
 * @param timePerPixel options.times.timePerPixel
 *
 * @return options.times.totalViewDurationPx
 */
const totalViewDurationPx: (
  totalViewDurationMs: number,
  timePerPixel: number
) => number = (totalViewDurationMs, timePerPixel) => {
  return totalViewDurationMs / timePerPixel;
};

/**
 * Calculate steps
 * Steps are days by default
 * Each step contain information about time offset and pixel offset of this time inside gantt chart
 *
 */
const calculateSteps: (
  firstTime: number,
  lastTime: number,
  timePerPixel: number,
  totalViewDurationMs: number,
  totalViewDurationPx: number,
  stepDuration: dayjs.UnitType
) => StepOption[] = (
  firstTime,
  lastTime,
  timePerPixel = 0,
  totalViewDurationMs = 0,
  totalViewDurationPx = 0,
  stepDuration = "day"
) => {
  const steps: StepOption[] = [];

  steps.push({
    time: firstTime.valueOf(),
    offset: {
      ms: 0,
      px: 0
    },
    width: {
      ms: 0,
      px: 0
    }
  });
  for (
    let currentDate = dayjs(firstTime)
      .add(1, stepDuration)
      .startOf("day");
    currentDate.valueOf() <= lastTime;
    currentDate = currentDate.add(1, stepDuration).startOf("day")
  ) {
    const offsetMs = currentDate.diff(firstTime, "millisecond");
    const offsetPx = offsetMs / timePerPixel;
    const step = {
      time: currentDate.valueOf(),
      offset: {
        ms: offsetMs,
        px: offsetPx
      },
      width: { ms: 0, px: 0 }
    };
    const previousStep = steps[steps.length - 1];
    previousStep.width = {
      ms: offsetMs - previousStep.offset.ms,
      px: offsetPx - previousStep.offset.px
    };
    steps.push(step);
  }
  const lastStep = steps[steps.length - 1];
  lastStep.width = {
    ms: totalViewDurationMs - lastStep.offset.ms,
    px: totalViewDurationPx - lastStep.offset.px
  };
  return steps;
};

/**
 * Compute width of calendar hours column widths basing on text widths
 * @param hourFormats options.calendar.hour.format
 * @param localeName  options.locale.name
 * @param style
 * @param ctx
 */
const computeHourWidths: (
  hourFormats: DateFormat,
  localeName: string,
  style: DynamicStyle,
  ctx: CanvasRenderingContext2D | null
) => {
  widths: CalendarItemWidths[];
  maxWidths: CalendarItemWidths;
  formatted: Formatted;
} = (hourFormats, localeName, style, ctx) => {
  const widths: CalendarItemWidths[] = [];
  const maxWidths: CalendarItemWidths = {};
  const formatted: Formatted = {
    long: [],
    medium: [],
    short: []
  };
  if (ctx) {
    //
    const baseStyle = {
      ...style["calendar-row-text"],
      ...style["calendar-row-text--hour"]
    };
    ctx.font = baseStyle["fontSize"] + " " + baseStyle["fontFamily"];

    let currentDate = dayjs("2020-01-01T00:00:00").locale(localeName); // any date will be good for hours

    // Initialize maxWidths
    for (const formatName in hourFormats) {
      maxWidths[formatName] = 0;
    }
    // 计算Hour文本显示宽度
    for (let hour = 0; hour < 24; hour++) {
      const width: CalendarItemWidths = { hour };
      for (const formatName in hourFormats) {
        const hourFormatted = hourFormats[formatName](currentDate);
        width[formatName] = ctx.measureText(hourFormatted).width;
        formatted[formatName].push(hourFormatted);
        // Calculate maxWidths
        if (width[formatName] > maxWidths[formatName]) {
          maxWidths[formatName] = width[formatName];
        }
      }
      widths.push(width);
      currentDate = currentDate.add(1, "hour");
    }
  }
  return { widths, maxWidths, formatted };
};

/**
 *
 * Compute calendar days column widths basing on text widths
 * @param steps options.times.steps
 * @param dayFormats options.calendar.day.format
 * @param localeName  options.locale.name
 * @param style
 * @param ctx
 */
const computeDayWidths: (
  steps: StepOption[],
  dayFormats: DateFormat,
  localeName: string,
  style: DynamicStyle,
  ctx: CanvasRenderingContext2D | null
) => {
  widths: CalendarItemWidths[];
  maxWidths: CalendarItemWidths;
} = (steps, dayFormats, localeName, style, ctx) => {
  const widths: CalendarItemWidths[] = [];
  const maxWidths: CalendarItemWidths = {};
  if (ctx) {
    //
    const baseStyle = {
      ...style["calendar-row-text"],
      ...style["calendar-row-text--day"]
    };
    ctx.font = baseStyle["fontSize"] + " " + baseStyle["fontFamily"];

    let currentDate = dayjs(steps[0].time).locale(localeName);

    // Initialize maxWidths
    for (const formatName in dayFormats) {
      maxWidths[formatName] = 0;
    }
    // 计算Day文本显示宽度
    for (let day = 0, daysLen = steps.length; day < daysLen; day++) {
      const width: CalendarItemWidths = { day };
      for (const formatName in dayFormats) {
        width[formatName] = ctx.measureText(
          dayFormats[formatName](currentDate)
        ).width;
        // Calculate maxWidths
        if (width[formatName] > maxWidths[formatName]) {
          maxWidths[formatName] = width[formatName];
        }
      }
      widths.push(width);
      currentDate = currentDate.add(1, "day");
    }
  }
  return { widths, maxWidths };
};

/**
 * Months count
 *
 * @description Returns number of different months in specified time range
 *
 * @param fromTime - date in ms
 * @param toTime - date in ms
 *
 * @returns {number} different months count
 */
const getMonthsCount = (
  fromTime: dayjs.ConfigType,
  toTime: dayjs.ConfigType
): number => {
  let currentMonth = dayjs(fromTime);
  const endMonth = dayjs(toTime);
  if (currentMonth.valueOf() > endMonth.valueOf()) {
    return 0;
  }
  let previousMonth = currentMonth.clone();
  let monthsCount = 1;
  while (currentMonth.valueOf() <= endMonth.valueOf()) {
    currentMonth = currentMonth.add(1, "day");
    if (previousMonth.month() !== currentMonth.month()) {
      monthsCount++;
    }
    previousMonth = currentMonth.clone();
  }
  return monthsCount;
};

/**
 * Compute month calendar columns widths basing on text widths
 * @param firstTime options.times.firstTime
 * @param lastTime options.times.lastTime
 * @param monthFormats options.calendar.month.format
 * @param localeName  options.locale.name
 * @param style
 * @param ctx
 */
const computeMonthWidths = (
  firstTime: dayjs.ConfigType,
  lastTime: dayjs.ConfigType,
  monthFormats: DateFormat,
  localeName: string,
  style: DynamicStyle,
  ctx: CanvasRenderingContext2D | null
): { widths: CalendarItemWidths[]; maxWidths: CalendarItemWidths } => {
  const widths: CalendarItemWidths[] = [];
  const maxWidths: CalendarItemWidths = {};
  if (ctx) {
    const baseStyle = {
      ...style["calendar-row-text"],
      ...style["calendar-row-text--month"]
    };
    ctx.font = baseStyle["fontSize"] + " " + baseStyle["fontFamily"];

    let currentDate = dayjs(firstTime).locale(localeName);
    const count = getMonthsCount(firstTime, lastTime);

    // Initialize maxWidths
    for (const formatName in monthFormats) {
      maxWidths[formatName] = 0;
    }
    // 计算Month文本显示宽度
    for (let month = 0; month < count; month++) {
      const width: CalendarItemWidths = {
        month
      };
      for (const formatName in monthFormats) {
        width[formatName] = ctx.measureText(
          monthFormats[formatName](currentDate)
        ).width;
        // Calculate maxWidths
        if (width[formatName] > maxWidths[formatName]) {
          maxWidths[formatName] = width[formatName];
        }
      }
      widths.push(width);
      currentDate = currentDate.add(1, "month");
    }
  }
  return { widths, maxWidths };
};

/**
 * How many hours will fit?
 *
 * @param dateFormats options.calendar.hour.format
 * @param fullCellWidth options.times.steps[dayIndex].width.px
 * @param maxWidths options.calendar.hour.maxWidths
 */
const howManyHoursFit = (
  dateFormats: DateFormat,
  fullCellWidth: number,
  maxWidths: CalendarItemWidths
): DateCount => {
  const stroke = 1;
  const additionalSpace = stroke + 2;
  for (let hours = 24; hours > 1; hours = Math.ceil(hours / 2)) {
    for (const formatName in dateFormats) {
      if (
        (maxWidths[formatName] + additionalSpace) * hours <= fullCellWidth &&
        hours > 1
      ) {
        return {
          count: hours,
          type: formatName
        };
      }
    }
  }
  return {
    count: 0,
    type: ""
  };
};

/**
 * How many days will fit?
 *
 * @param dateFormats options.calendar.day.format
 * @param fullWidth options.width
 * @param maxWidths options.calendar.day.maxWidths
 * @param steps
 */
const howManyDaysFit = (
  dateFormats: DateFormat,
  fullWidth: number,
  maxWidths: CalendarItemWidths,
  stepLength: number
): DateCount => {
  const stroke = 1;
  const additionalSpace = stroke + 2;

  for (let days = stepLength; days > 1; days = Math.ceil(days / 2)) {
    for (const formatName in dateFormats) {
      if (
        (maxWidths[formatName] + additionalSpace) * days <= fullWidth &&
        days > 1
      ) {
        return {
          count: days,
          type: formatName
        };
      }
    }
  }
  return {
    count: 0,
    type: ""
  };
};

/**
 * How many months will fit?
 *
 * @param dateFormats options.calendar.month.format
 * @param fullWidth options.width
 * @param maxWidths options.calendar.month.maxWidths
 * @param monthsCount
 */
const howManyMonthsFit = (
  dateFormats: DateFormat,
  fullWidth: number,
  maxWidths: CalendarItemWidths,
  monthsCount: number
): DateCount => {
  const stroke = 1;
  const additionalSpace = stroke + 2;

  if (monthsCount === 1) {
    for (const formatName in dateFormats) {
      if (maxWidths[formatName] + additionalSpace <= fullWidth) {
        return {
          count: 1,
          type: formatName
        };
      }
    }
  }
  for (let months = monthsCount; months > 1; months = Math.ceil(months / 2)) {
    for (const formatName in dateFormats) {
      if (
        (maxWidths[formatName] + additionalSpace) * months <= fullWidth &&
        months > 1
      ) {
        return {
          count: months,
          type: formatName
        };
      }
    }
  }
  return {
    count: 0,
    type: Object.keys(dateFormats)[0]
  };
};

/**
 * Sum all calendar rows height and return result
 *
 * @param hours
 * @param days
 * @param months
 * @param options
 */
const calculateCalendarDimensions = (
  hours: CalendarRowItems[],
  days: CalendarRowItems[],
  months: CalendarRowItems[],
  options: Options
): number => {
  let height = 0;
  if (options.calendar.hour.display && hours && hours.length > 0) {
    height += options.calendar.hour.height;
  }
  if (options.calendar.day.display && days && days.length > 0) {
    height += options.calendar.day.height;
  }
  if (options.calendar.month.display && months && months.length > 0) {
    height += options.calendar.month.height;
  }
  return height;
};

export {
  timePerPixel as calculateTimePerPixel,
  totalViewDurationMs as calculateTotalViewDurationMs,
  totalViewDurationPx as calculateTotalViewDurationPx,
  width as calculateWidth,
  getMonthsCount,
  calculateSteps,
  computeHourWidths,
  computeDayWidths,
  computeMonthWidths,
  calculateCalendarDimensions,
  howManyHoursFit,
  howManyDaysFit,
  howManyMonthsFit
};
