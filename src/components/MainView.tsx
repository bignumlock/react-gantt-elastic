import GanttElasticContext from "@/GanttElasticContext";
import { emitEvent } from "@/GanttElasticEvents";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import Chart from "./Chart/Chart";
import TaskList from "./TaskList/TaskList";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MainViewProps {}

interface MousePos {
  x: number;
  y: number;
  movementX: number;
  movementY: number;
  lastX: number;
  lastY: number;
  positiveX: number;
  positiveY: number;
  currentX: number;
  currentY: number;
}

const MainView: React.FC<MainViewProps> = () => {
  // gantt context
  const {
    style,
    refs,
    options,
    chartWidth,
    clientHeight,
    clientWidth,
    rowsHeight,
    scrollBarHeight,
    allVisibleTasksHeight,
    taskList,
    calendar
  } = useContext(GanttElasticContext);

  const [scroll] = useState({ scrolling: false });

  // Chart拖动事件数据，不需要重新渲染页面
  const [mousePos] = useState({
    x: 0,
    y: 0,
    movementX: 0,
    movementY: 0,
    lastX: 0,
    lastY: 0,
    positiveX: 0,
    positiveY: 0,
    currentX: 0,
    currentY: 0
  });

  /**
   * refs
   */
  const mainViewRef = useRef<HTMLDivElement>(null);
  const taskListRef = useRef<HTMLDivElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartScrollContainerVerticalRef = useRef<HTMLDivElement>(null);
  const chartScrollContainerHorizontalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    refs.mainView = mainViewRef;
    refs.taskList = taskListRef;
    refs.chartContainer = chartContainerRef;
    refs.chartScrollContainerVertical = chartScrollContainerVerticalRef;
    refs.chartScrollContainerHorizontal = chartScrollContainerHorizontalRef;
  }, [refs]);

  const {
    mouseMove,
    mouseUp,
    onHorizontalScroll,
    onVerticalScroll,
    chartWheel
  } = useMemo(() => {
    /**
     * Emit event when mouse is moving inside main view
     */
    const mouseMove = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ): void => {
      emitEvent.emit("main-view-mousemove", event);
    };

    /**
     * Emit mouseup event inside main view
     */
    const mouseUp = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ): void => {
      scroll.scrolling = false;
      emitEvent.emit("main-view-mouseup", event);
    };

    /**
     * Horizontal scroll event handler
     */
    const onHorizontalScroll = (event: React.UIEvent<HTMLDivElement>): void => {
      emitEvent.emit("chart-scroll-horizontal", event);
    };

    /**
     * Vertical scroll event handler
     */
    const onVerticalScroll = (event: React.UIEvent<HTMLDivElement>): void => {
      emitEvent.emit("chart-scroll-vertical", event);
    };

    /**
     * Mouse wheel event handler
     */
    const chartWheel = (event: React.WheelEvent<HTMLDivElement>): void => {
      emitEvent.emit("chart-wheel", event);
    };

    return {
      mouseMove,
      mouseUp,
      onHorizontalScroll,
      onVerticalScroll,
      chartWheel
    };
  }, [scroll]);

  /**
   * Chart mousedown event handler
   * Initiates drag scrolling mode
   */
  const chartMouseDown = useCallback(
    ev => {
      if (typeof ev.touches !== "undefined") {
        mousePos.x = mousePos.lastX = ev.touches[0].screenX;
        mousePos.y = mousePos.lastY = ev.touches[0].screenY;
        mousePos.movementX = 0;
        mousePos.movementY = 0;
        const horizontal = chartScrollContainerHorizontalRef.current;
        const vertical = chartScrollContainerVerticalRef.current;
        if (horizontal && vertical) {
          mousePos.currentX = horizontal.scrollLeft;
          mousePos.currentY = vertical.scrollTop;
        }
      }
      scroll.scrolling = true;
    },
    [
      mousePos.currentX,
      mousePos.currentY,
      mousePos.lastX,
      mousePos.lastY,
      mousePos.movementX,
      mousePos.movementY,
      mousePos.x,
      mousePos.y,
      scroll
    ]
  );

  /**
   * Chart mouseup event handler
   * Deactivates drag scrolling mode
   */
  const chartMouseUp = useCallback(
    ev => {
      scroll.scrolling = false;
    },
    [scroll]
  );

  /**
   * Chart mousemove event handler
   * When in drag scrolling mode this method calculate scroll movement
   */
  const chartMouseMove = useCallback(
    ev => {
      if (scroll.scrolling) {
        ev.preventDefault();
        // ev.stopImmediatePropagation();
        ev.stopPropagation();
        const touch = typeof ev.touches !== "undefined";
        let movementX, movementY;
        if (touch) {
          const screenX = ev.touches[0].screenX;
          const screenY = ev.touches[0].screenY;
          movementX = mousePos.x - screenX;
          movementY = mousePos.y - screenY;
          mousePos.lastX = screenX;
          mousePos.lastY = screenY;
        } else {
          movementX = ev.movementX;
          movementY = ev.movementY;
        }

        const horizontal = chartScrollContainerHorizontalRef.current;
        const vertical = chartScrollContainerVerticalRef.current;
        if (horizontal && vertical) {
          let x = 0,
            y = 0;
          if (touch) {
            x =
              mousePos.currentX +
              movementX * options.scroll.dragXMoveMultiplier;
          } else {
            x =
              horizontal.scrollLeft -
              movementX * options.scroll.dragXMoveMultiplier;
          }
          horizontal.scrollLeft = x;
          if (touch) {
            y =
              mousePos.currentY +
              movementY * options.scroll.dragYMoveMultiplier;
          } else {
            y =
              vertical.scrollTop -
              movementY * options.scroll.dragYMoveMultiplier;
          }
          vertical.scrollTop = y;
        }
      }
    },
    [
      mousePos.currentX,
      mousePos.currentY,
      mousePos.lastX,
      mousePos.lastY,
      mousePos.x,
      mousePos.y,
      options.scroll.dragXMoveMultiplier,
      options.scroll.dragYMoveMultiplier,
      scroll
    ]
  );

  return useMemo(
    () => (
      <div className="gantt-elastic__main-view" style={style["main-view"]}>
        <div
          className="gantt-elastic__main-container-wrapper"
          style={{
            ...style["main-container-wrapper"],
            height: clientHeight + "px"
          }}
        >
          <div
            className="gantt-elastic__main-container"
            style={{
              ...style["main-container"],
              width: clientWidth + "px",
              height: clientHeight + "px"
            }}
            ref={mainViewRef}
          >
            <div
              className="gantt-elastic__container"
              style={style["container"]}
              onMouseMove={mouseMove}
              onMouseUp={mouseUp}
            >
              {options.taskList.display && (
                <div
                  ref={taskListRef}
                  className="gantt-elastic__task-list-container"
                  style={{
                    ...style["task-list-container"],
                    width: taskList.finalWidth + "px",
                    height: clientHeight + "px"
                  }}
                >
                  <TaskList></TaskList>
                </div>
              )}
              <div
                className="gantt-elastic__main-view-container"
                ref={chartContainerRef}
                style={style["main-view-container"]}
                onMouseDown={chartMouseDown}
                onTouchStart={chartMouseDown}
                onMouseUp={chartMouseUp}
                onTouchEnd={chartMouseUp}
                onMouseMoveCapture={chartMouseMove}
                onTouchMoveCapture={chartMouseMove}
                onWheelCapture={chartWheel}
              >
                <Chart></Chart>
              </div>
            </div>
          </div>
          <div
            className="gantt-elastic__chart-scroll-container gantt-elastic__chart-scroll-container--vertical"
            ref={chartScrollContainerVerticalRef}
            style={{
              ...style["chart-scroll-container"],
              ...style["chart-scroll-container--vertical"],
              width: scrollBarHeight + "px",
              height: rowsHeight + "px",
              marginTop: calendar.height + options.calendar.gap + "px"
            }}
            onScroll={onVerticalScroll}
          >
            <div
              className="gantt-elastic__chart-scroll--vertical"
              style={{
                width: "1px",
                height: allVisibleTasksHeight + "px"
              }}
            ></div>
          </div>
        </div>
        <div
          className="gantt-elastic__chart-scroll-container gantt-elastic__chart-scroll-container--horizontal"
          ref={chartScrollContainerHorizontalRef}
          style={{
            ...style["chart-scroll-container"],
            ...style["chart-scroll-container--horizontal"],
            marginLeft: !options.taskList.display
              ? "0px"
              : taskList.finalWidth + "px"
          }}
          onScroll={onHorizontalScroll}
        >
          <div
            className="gantt-elastic__chart-scroll--horizontal"
            style={{
              height: "1px",
              width: chartWidth + "px"
            }}
          ></div>
        </div>
      </div>
    ),
    [
      allVisibleTasksHeight,
      calendar.height,
      chartMouseDown,
      chartMouseMove,
      chartMouseUp,
      chartWheel,
      clientWidth,
      clientHeight,
      mouseMove,
      mouseUp,
      onHorizontalScroll,
      onVerticalScroll,
      options.calendar.gap,
      options.taskList.display,
      rowsHeight,
      scrollBarHeight,
      style,
      taskList.finalWidth,
      chartWidth
    ]
  );
};

export default MainView;
