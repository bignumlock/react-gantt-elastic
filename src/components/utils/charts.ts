import dayjs from "dayjs";
import _ from "lodash";
import { StepOption } from "../interfaces";

/**
 * Determine if element is inside current view port
 *
 * @param left scroll.chart.left
 * @param right scroll.chart.right
 * @param x step.offset.px
 * @param width
 * @param buffer
 */
const isInsideViewPort = (
  left: number,
  right: number,
  x: number,
  width: number,
  buffer = 5000
): boolean => {
  return (
    (x + width + buffer >= left && x - buffer <= right) ||
    (x - buffer <= left && x + width + buffer >= right)
  );
};

/**
 * Get working days
 *
 * @param steps options.times.steps
 * @param workingDays options.calendar.workingDays
 */
const workingDays = (
  steps: StepOption[],
  workingDays: number[]
): StepOption[] => {
  return _.filter(steps, step => {
    return !workingDays.includes(dayjs(step.time).day());
  });
};

/**
 * Convert time (in milliseconds) to pixel offset inside chart
 *
 * @param ms
 * @param firstTime options.times.firstTime
 * @param timePerPixel options.times.timePerPixel
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

export { isInsideViewPort, workingDays, timeToPixelOffsetX };
