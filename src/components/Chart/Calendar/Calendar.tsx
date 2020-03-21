import { CalendarRowItems, CalendarRowText } from "@/components/interfaces";
import {
  calculateCalendarDimensions,
  getMonthsCount,
  howManyDaysFit,
  howManyHoursFit,
  howManyMonthsFit
} from "@/components/utils/times";
import GanttElasticContext from "@/GanttElasticContext";
import dayjs from "dayjs";
import _ from "lodash";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef
} from "react";
import invariant from "ts-invariant";
import CalendarRow from "./CalendarRow";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CalendarProps {}

export interface CalendarState {
  hours: CalendarRowItems[];
  days: CalendarRowItems[];
  months: CalendarRowItems[];
}

const Calendar: React.FC<CalendarProps> = () => {
  const {
    refs,
    style,
    dispatch,
    options,
    chartWidth,
    times,
    calendar
  } = useContext(GanttElasticContext);

  // refs
  const chartCalendarContainerRef = useRef(null);

  useEffect(() => {
    refs.chartCalendarContainer = chartCalendarContainerRef;
  }, [refs]);

  /**
   * Generate hours
   *
   * @returns {array}
   */
  const hours = useMemo(() => {
    const allHours: CalendarRowItems[] = [];

    if (options.calendar.hour.display) {
      const { widths, maxWidths, formatted } = calendar.hour;
      const dayRowHeight = options.calendar.day.height;
      const monthRowHeight = options.calendar.month.height;
      const rowHeight = options.calendar.hour.height;
      const format = options.calendar.hour.format;
      const steps = times.steps;
      for (
        let hourIndex = 0, len = steps.length;
        hourIndex < len;
        hourIndex++
      ) {
        const hoursCount = howManyHoursFit(
          format,
          steps[hourIndex].width.px,
          maxWidths
        );
        if (hoursCount.count === 0) {
          continue;
        }
        const hours: CalendarRowItems = {
          key: hourIndex + "step",
          children: []
        };
        const hourStep = 24 / hoursCount.count;
        const hourWidthPx = steps[hourIndex].width.px / hoursCount.count;
        for (let i = 0, len = hoursCount.count; i < len; i++) {
          const hour = i * hourStep;
          let index = hourIndex;
          if (hourIndex > 0) {
            index = hourIndex - Math.floor(hourIndex / 24) * 24;
          }
          let textWidth = 0;
          if (typeof widths[index] !== "undefined") {
            textWidth = widths[index][hoursCount.type];
          }
          const x = steps[hourIndex].offset.px + hourWidthPx * i;

          hours.children.push({
            index: hourIndex,
            key: "h" + i,
            x,
            y: dayRowHeight + monthRowHeight,
            width: hourWidthPx,
            textWidth,
            height: rowHeight,
            label: formatted[hoursCount.type][hour]
          });
        }
        allHours.push(hours);
      }
    }
    return allHours;
  }, [
    calendar.hour,
    options.calendar.day.height,
    options.calendar.hour.display,
    options.calendar.hour.format,
    options.calendar.hour.height,
    options.calendar.month.height,
    times.steps
  ]);

  /**
   * Generate days
   *
   * @returns {array}
   */
  const days = useMemo(() => {
    let allDays: CalendarRowItems[] = [];

    if (options.calendar.day.display) {
      const { widths, maxWidths } = calendar.day;
      const monthRowHeight = options.calendar.month.height;
      const rowHeight = options.calendar.day.height;
      const format = options.calendar.day.format;
      const steps = times.steps;

      const localeName = options.locale.name;

      const days: CalendarRowText[] = [];
      const daysCount = howManyDaysFit(
        format,
        chartWidth,
        maxWidths,
        steps.length
      );
      if (daysCount.count === 0) {
        return allDays;
      }

      const dayStep = Math.ceil(steps.length / daysCount.count);
      for (
        let dayIndex = 0, len = steps.length;
        dayIndex < len;
        dayIndex += dayStep
      ) {
        let dayWidthPx = 0;
        // day could be shorter (daylight saving time) so join widths and divide
        for (let currentStep = 0; currentStep < dayStep; currentStep++) {
          if (typeof steps[dayIndex + currentStep] !== "undefined") {
            dayWidthPx += steps[dayIndex + currentStep].width.px;
          }
        }
        const date = dayjs(steps[dayIndex].time);
        let textWidth = 0;
        if (typeof widths[dayIndex] !== "undefined") {
          textWidth = widths[dayIndex][daysCount.type];
        }
        const x = steps[dayIndex].offset.px;
        days.push({
          index: dayIndex,
          key: steps[dayIndex].time + "d",
          x,
          y: monthRowHeight,
          width: dayWidthPx,
          textWidth,
          height: rowHeight,
          label: format[daysCount.type](date.locale(localeName))
        });
      }
      allDays = _.map(days, item => ({
        key: item.key,
        children: [item]
      }));
    }
    return allDays;
  }, [
    calendar.day,
    chartWidth,
    options.calendar.day.display,
    options.calendar.day.format,
    options.calendar.day.height,
    options.calendar.month.height,
    options.locale.name,
    times.steps
  ]);

  /**
   * Generate months
   *
   * @returns {array}
   */
  const months = useMemo(() => {
    let allMonths: CalendarRowItems[] = [];
    if (options.calendar.month.display) {
      const { widths, maxWidths } = calendar.month;
      const rowHeight = options.calendar.month.height;
      const format = options.calendar.month.format;
      const steps = times.steps;
      const firstTime = times.firstTime;
      const lastTime = times.lastTime;
      const localeName = options.locale.name;

      const months: CalendarRowText[] = [];

      const count = getMonthsCount(firstTime, lastTime);
      const monthsCount = howManyMonthsFit(
        format,
        chartWidth,
        maxWidths,
        count
      );
      if (monthsCount.count === 0) {
        return allMonths;
      }
      let currentDate = dayjs(firstTime);
      const _lastTime = dayjs(lastTime);
      for (let monthIndex = 0; monthIndex < monthsCount.count; monthIndex++) {
        let monthWidth = 0;
        let monthOffset = Number.MAX_SAFE_INTEGER;
        let finalDate = dayjs(currentDate)
          .add(1, "month")
          .startOf("month");
        if (finalDate.valueOf() > _lastTime.valueOf()) {
          finalDate = _lastTime;
        }
        // we must find first and last step to get the offsets / widths
        for (let step = 0, len = steps.length; step < len; step++) {
          const currentStep = steps[step];
          if (
            currentStep.time >= currentDate.valueOf() &&
            currentStep.time < finalDate.valueOf()
          ) {
            monthWidth += currentStep.width.px;
            if (currentStep.offset.px < monthOffset) {
              monthOffset = currentStep.offset.px;
            }
          }
        }
        let label = "";
        let choosenFormatName;
        for (const formatName in format) {
          if (maxWidths[formatName] + 2 <= monthWidth) {
            label = format[formatName](currentDate.locale(localeName));
            choosenFormatName = formatName;
          }
        }
        let textWidth = 0;
        if (typeof widths[monthIndex] !== "undefined" && choosenFormatName) {
          textWidth = widths[monthIndex][choosenFormatName];
        }
        const x = monthOffset;
        months.push({
          index: monthIndex,
          key: monthIndex + "m",
          x,
          y: 0,
          width: monthWidth,
          textWidth,
          choosenFormatName,
          height: rowHeight,
          label
        });
        currentDate = currentDate.add(1, "month").startOf("month");
        if (currentDate.valueOf() > _lastTime.valueOf()) {
          currentDate = _lastTime;
        }
      }
      allMonths = _.map(months, item => ({
        key: item.key,
        children: [item]
      }));
    }
    return allMonths;
  }, [
    calendar.month,
    chartWidth,
    options.calendar.month.display,
    options.calendar.month.format,
    options.calendar.month.height,
    options.locale.name,
    times.firstTime,
    times.lastTime,
    times.steps
  ]);

  useLayoutEffect(() => {
    const height = calculateCalendarDimensions(
      hours,
      days,
      months,
      options.asMutable({ deep: true })
    );
    if (calendar.height !== height) {
      invariant.warn(`set calendar's height:${height}`);
      dispatch &&
        dispatch({
          type: "update-calendar-height",
          payload: height
        });
    }
  }, [calendar.height, days, dispatch, hours, months, options]);

  return useMemo(
    () => (
      <div
        className="gantt-elastic__calendar-wrapper"
        style={{
          ...style["calendar-wrapper"],
          width: chartWidth + "px"
        }}
      >
        <div
          className="gantt-elastic__calendar"
          style={{
            ...style["calendar"],
            width: chartWidth + "px"
          }}
        >
          {options.calendar.month.display && (
            <CalendarRow items={months} which="month" />
          )}
          {options.calendar.day.display && (
            <CalendarRow items={days} which="day" />
          )}
          {options.calendar.hour.display && (
            <CalendarRow items={hours} which="hour" />
          )}
        </div>
      </div>
    ),
    [
      days,
      hours,
      months,
      chartWidth,
      options.calendar.day.display,
      options.calendar.hour.display,
      options.calendar.month.display,
      style
    ]
  );
};

export default Calendar;
