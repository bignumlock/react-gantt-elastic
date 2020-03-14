import GanttElasticContext from "@/GanttElasticContext";
import { emitEvent } from "@/GanttElasticEvents";
import _ from "lodash";
import React, { useContext, useMemo } from "react";
import { Task } from "./interfaces";

/**
 * Is current expander collapsed?
 *
 * @param tasks
 */
function collapseState(tasks: Array<Task>): boolean {
  if (tasks.length === 0) {
    return false;
  }
  let collapsed = 0;
  for (let i = 0, len = tasks.length; i < len; i++) {
    if (tasks[i].collapsed) {
      collapsed++;
    }
  }
  return collapsed === tasks.length;
}

/**
 * Get specific class prefix
 *
 * @param type
 * @param full
 */
function getClassPrefix(type: string, full = true): string {
  return `${full ? "gantt-elastic__" : ""}${type}-expander`;
}

export interface ExpanderProps {
  type: string;
  options: {
    type: string;
    size: number;
    padding: number;
    margin: number;
  };
  tasks: Array<Task>;
}

const state = {
  border: 0.5,
  borderStyle: {
    strokeWidth: 0.5
  },
  lineOffset: 5
};

const Expander: React.FC<ExpanderProps> = ({ type, tasks, options }) => {
  const { style, dispatch } = useContext(GanttElasticContext);

  const { collapsed, toggle, allChildren } = useMemo(() => {
    const collapsed = collapseState(tasks);
    /**
     * Toggle expander
     */
    const toggle = (): void => {
      if (tasks.length === 0) {
        return;
      }
      // const collapse = !collapsed;
      // tasks.forEach(task => {
      //   task.collapsed = collapse;
      // });
      // dispatch({
      //   type: "taskList-collapsed-change",
      //   payload: {}
      // });
      emitEvent.emit("taskList-collapsed-change", tasks, !collapsed);
    };
    /**
     * Get all tasks
     */
    const allChildren: Array<string | number> = [];
    _.forEach(tasks, task => {
      _.forEach(task.allChildren, childId => {
        allChildren.push(childId);
      });
    });

    return { collapsed, toggle, allChildren };
  }, [tasks]);

  return useMemo(() => {
    const fullClassPrefix = getClassPrefix(options.type);
    const notFullClassPrefix = getClassPrefix(options.type, false);

    const taskListStyle =
      type !== "taskList"
        ? {}
        : {
            paddingLeft:
              tasks[0]?.parents.length * options.padding +
              options.margin +
              "px",
            margin: "auto 0"
          };
    return (
      <div
        className={fullClassPrefix + "-wrapper"}
        style={{
          ...style[notFullClassPrefix + "-wrapper"],
          ...taskListStyle
        }}
      >
        {allChildren.length > 0 && (
          <svg
            className={fullClassPrefix + "-content"}
            style={{ ...style[notFullClassPrefix + "-content"] }}
            width={options.size}
            height={options.size}
            onClick={toggle}
          >
            <rect
              className={fullClassPrefix + "-border"}
              style={{
                ...style[notFullClassPrefix + "-border"],
                ...state.borderStyle
              }}
              x={state.border}
              y={state.border}
              width={options.size - state.border * 2}
              height={options.size - state.border * 2}
              rx="2"
              ry="2"
            ></rect>
            <line
              className={fullClassPrefix + "-line"}
              style={{ ...style[notFullClassPrefix + "-line"] }}
              x1={state.lineOffset}
              y1={options.size / 2}
              x2={options.size - state.lineOffset}
              y2={options.size / 2}
            ></line>
            {collapsed && (
              <line
                className={fullClassPrefix + "-line"}
                style={{ ...style[notFullClassPrefix + "-line"] }}
                x1={options.size / 2}
                y1={state.lineOffset}
                x2={options.size / 2}
                y2={options.size - state.lineOffset}
              ></line>
            )}
          </svg>
        )}
      </div>
    );
  }, [
    allChildren.length,
    collapsed,
    options.margin,
    options.padding,
    options.size,
    options.type,
    style,
    tasks,
    toggle,
    type
  ]);
};

export default Expander;
