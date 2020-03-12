import React from "react";
import { DynamicStyle, Options, Task, TimeOption } from "./types";

interface ContextType {
  style: DynamicStyle;
  ctx?: CanvasRenderingContext2D | null;
  options: Options;
  allTasks: Task[];
  visibleTasks: Task[];
  times: TimeOption;
}

export default React.createContext<ContextType>({});
