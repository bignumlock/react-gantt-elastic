import { DynamicStyle } from "@/types";

const getStyle = (
  fontSize = "12px",
  fontFamily = "Arial, sans-serif"
): DynamicStyle => {
  return {
    "main-view": {
      background: "#FFFFFF"
    },
    "main-container-wrapper": {
      overflow: "hidden",
      borderTop: "1px solid #eee",
      borderBottom: "1px solid #eee"
    },
    "main-container": {
      float: "left",
      maxWidth: "100%"
    },
    "main-view-container": {},
    container: {
      display: "flex",
      maxWidth: "100%",
      height: "100%"
    },
    "calendar-wrapper": {
      userSelect: "none"
    },
    calendar: {
      width: "100%",
      background: "#f3f5f7",
      display: "block"
    },
    "calendar-row": {
      display: "flex",
      justifyContent: "space-evenly"
    },
    "calendar-row--month": {},
    "calendar-row--day": {},
    "calendar-row--hour": {
      borderBottom: "1px solid #eee"
    },
    "calendar-row-rect": {
      background: "transparent",
      display: "flex"
    },
    "calendar-row-rect--month": {},
    "calendar-row-rect--day": {},
    "calendar-row-rect--hour": {},
    "calendar-row-rect-child": {
      display: "block",
      borderRightWidth: "1px", // Calendar
      borderRightColor: "#dadada",
      borderRightStyle: "solid",
      position: "relative"
    },
    "calendar-row-rect-child--month": {},
    "calendar-row-rect-child--day": { textAlign: "center" },
    "calendar-row-rect-child--hour": { textAlign: "center" },
    "calendar-row-text": {
      fontFamily, // GanttElastic
      fontSize, //GanttElastic
      color: "#606060",
      display: "inline-block",
      position: "relative"
    },
    "calendar-row-text--month": {},
    "calendar-row-text--day": {},
    "calendar-row-text--hour": {},
    "task-list-wrapper": {},
    "task-list": { background: "transparent", borderColor: "#eee" },
    "task-list-header": {
      display: "flex",
      userSelect: "none",
      verticalAlign: "middle",
      borderBottom: "1px solid #eee",
      borderLeft: "1px solid #eee"
    },
    "task-list-header-column": {
      borderLeft: "1px solid #00000050",
      boxSizing: "border-box",
      display: "flex",
      background: "#f3f5f7",
      borderColor: "transparent"
    },
    "task-list-expander-wrapper": {
      display: "inline-flex",
      flexShrink: 0,
      boxSizing: "border-box",
      margin: "0 0 0 10px"
    },
    "task-list-expander-content": {
      display: "inline-flex",
      cursor: "pointer",
      margin: "auto 0px",
      boxSizing: "border-box",
      userSelect: "none"
    },
    "task-list-expander-line": {
      fill: "transparent",
      stroke: "#000000",
      strokeWidth: 1,
      strokeLinecap: "round"
    },
    "task-list-expander-border": {
      fill: "#ffffffa0",
      stroke: "#000000A0"
    },
    "chart-expander-wrapper": {
      display: "block",
      lineHeight: 1,
      boxSizing: "border-box",
      margin: "0"
    },
    "chart-expander-content": {
      display: "inline-flex",
      cursor: "pointer",
      margin: "auto 0px",
      boxSizing: "border-box",
      userSelect: "none"
    },
    "chart-expander-line": {
      fill: "transparent",
      stroke: "#000000",
      strokeWidth: 1,
      strokeLinecap: "round"
    },
    "chart-expander-border": {
      fill: "#ffffffa0",
      stroke: "#000000A0"
    },
    "task-list-container": {},
    "task-list-header-label": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      fontFamily,
      fontSize,
      boxSizing: "border-box",
      margin: "auto 6px",
      flexGrow: 1,
      verticalAlign: "middle"
    },
    "task-list-header-resizer-wrapper": {
      background: "transparent",
      height: "100%",
      width: "6px",
      cursor: "col-resize",
      display: "inline-flex",
      verticalAlign: "center"
    },
    "task-list-header-resizer": { margin: "auto 0px" },
    "task-list-header-resizer-dot": {
      width: "3px",
      height: "3px",
      background: "#ddd",
      borderRadius: "100%",
      margin: "4px 0px"
    },
    "task-list-items": {
      overflow: "hidden"
    },
    "task-list-item": {
      borderTop: "1px solid #eee",
      borderRight: "1px solid #eee",
      boxSizing: "border-box",
      display: "flex",
      background: "transparent"
    },
    "task-list-item-column": {
      display: "inline-flex",
      flexShrink: 0,
      borderLeft: "1px solid #00000050",
      boxSizing: "border-box",
      borderColor: "#eee"
    },
    "task-list-item-value-wrapper": {
      overflow: "hidden",
      display: "flex",
      width: "100%"
    },
    "task-list-item-value-container": {
      margin: "auto 0px",
      overflow: "hidden"
    },
    "task-list-item-value": {
      display: "block",
      flexShrink: 100,
      fontFamily,
      fontSize,
      marginTop: "auto",
      marginBottom: "auto",
      marginLeft: "6px", // TaskList
      marginRight: "6px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      lineHeight: "1.5em",
      wordBreak: "keep-all",
      whiteSpace: "nowrap",
      color: "#606060",
      background: "#FFFFFF"
    },
    "grid-lines": {},
    "grid-line-horizontal": {
      stroke: "#00000010",
      strokeWidth: 1
    },
    "grid-line-vertical": {
      stroke: "#00000010",
      strokeWidth: 1
    },
    "grid-line-time": {
      stroke: "#FF000080",
      strokeWidth: 1
    },
    chart: {
      userSelect: "none",
      overflow: "hidden"
    },
    "chart-calendar-container": {
      userSelect: "none",
      overflow: "hidden",
      maxWidth: "100%",
      borderRight: "1px solid #eee"
    },
    "chart-graph-container": {
      userSelect: "none",
      overflow: "hidden",
      maxWidth: "100%",
      borderRight: "1px solid #eee"
    },
    "chart-area": {},
    "chart-graph": {
      overflow: "hidden"
    },
    "chart-row-text-wrapper": {},
    "chart-row-text": {
      background: "#ffffffa0",
      borderRadius: "10px",
      fontFamily,
      fontSize,
      fontWeight: "normal",
      color: "#000000a0",
      height: "100%",
      display: "inline-block"
    },
    "chart-row-text-content": {
      padding: "0px 6px"
    },
    "chart-row-text-content--text": {},
    "chart-row-text-content--html": {},
    "chart-row-wrapper": {},
    "chart-row-bar-wrapper": {},
    "chart-row-bar": {},
    "chart-row-bar-polygon": {
      stroke: "#E74C3C",
      strokeWidth: 1,
      fill: "#F75C4C"
    },
    "chart-row-project-wrapper": {},
    "chart-row-project": {},
    "chart-row-project-polygon": {},
    "chart-row-milestone-wrapper": {},
    "chart-row-milestone": {},
    "chart-row-milestone-polygon": {},
    "chart-row-task-wrapper": {},
    "chart-row-task": {},
    "chart-row-task-polygon": {},
    "chart-row-progress-bar-wrapper": {},
    "chart-row-progress-bar": {},
    "chart-row-progress-bar-line": {
      stroke: "#ffffff25",
      strokeWidth: 20
    },
    "chart-row-progress-bar-solid": {
      fill: "#0EAC51",
      height: "20%"
    },
    "chart-row-progress-bar-pattern": {
      fill: "url(#diagonalHatch)",
      transform: "translateY(0.1) scaleY(0.8)"
    },
    "chart-row-progress-bar-outline": {
      stroke: "#E74C3C",
      strokeWidth: 1
    },
    "chart-dependency-lines-wrapper": {},
    "chart-dependency-lines-path": {
      fill: "transparent",
      stroke: "#FFa00090",
      strokeWidth: 2
    },
    "chart-scroll-container": {},
    "chart-scroll-container--horizontal": {
      overflow: "auto",
      maxWidth: "100%"
    },
    "chart-scroll-container--vertical": {
      overflowY: "auto",
      overflowX: "hidden",
      maxHeight: "100%",
      float: "right"
    },
    "chart-days-highlight-rect": {
      fill: "#f3f5f780"
    },
    "slot-header-beforeOptions": {
      display: "inline-block"
    }
  };
};

const prepareStyle = (userStyle?: DynamicStyle): DynamicStyle => {
  let fontSize: any = "12px";
  let fontFamily = window
    .getComputedStyle(document.body)
    .getPropertyValue("font-family")
    .toString();
  if (typeof userStyle !== "undefined") {
    if (typeof userStyle.fontSize !== "undefined") {
      fontSize = userStyle.fontSize;
    }
    if (typeof userStyle.fontFamily !== "undefined") {
      fontFamily = `${userStyle.fontFamily}`;
    }
  }
  // return getStyle(fontSize, fontFamily);
  return getStyle(fontSize, fontFamily);
};

export { getStyle, prepareStyle };
