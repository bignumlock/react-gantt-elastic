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
