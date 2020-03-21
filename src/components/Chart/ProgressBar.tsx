import { Task } from "@/components/interfaces";
import GanttElasticContext from "@/GanttElasticContext";
import React, { useContext, useMemo } from "react";

export interface ProgressBarProps {
  task: Task;
  clipPath: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ task, ...props }) => {
  const { style, options } = useContext(GanttElasticContext);

  return useMemo(() => {
    // Get progress width
    const progressWidth = task.progress + "%";
    // Get line points
    const start = (task.width / 100) * task.progress;
    const linePoints = `M ${start} 0 L ${start} ${task.height}`;

    return (
      <g
        className="gantt-elastic__chart-row-progress-bar-wrapper"
        style={{
          ...style["chart-row-progress-bar-wrapper"],
          ...task.style["chart-row-progress-bar-wrapper"]
        }}
        {...props}
      >
        <defs>
          <pattern
            id="diagonalHatch"
            width={options.chart.progress.width}
            height={options.chart.progress.width}
            patternTransform="rotate(45 0 0)"
            patternUnits="userSpaceOnUse"
          >
            <line
              className="chart-row-progress-bar-line"
              style={{
                ...style["chart-row-progress-bar-line"],
                ...task.style["chart-row-progress-bar-line"]
              }}
              x1="0"
              y1="0"
              x2="0"
              y2={options.chart.progress.width}
            />
          </pattern>
        </defs>
        {options.chart.progress.bar && (
          <rect
            className="gantt-elastic__chart-row-progress-bar-solid"
            style={{
              ...style["chart-row-progress-bar-solid"],
              ...task.style["chart-row-progress-bar-solid"]
            }}
            x="0"
            y="0"
            width={progressWidth}
          ></rect>
        )}
        {options.chart.progress.pattern && (
          <g>
            <rect
              className="gantt-elastic__chart-row-progress-bar-pattern"
              style={{
                ...style["chart-row-progress-bar-pattern"],
                ...task.style["chart-row-progress-bar-pattern"]
              }}
              x={progressWidth}
              y="0"
              width={`${100 - task.progress}%`}
              height="100%"
            ></rect>
            <path
              className="gantt-elastic__chart-row-progress-bar-outline"
              style={{
                ...style["chart-row-progress-bar-outline"],
                ...task.style["base"],
                ...task.style["chart-row-progress-bar-outline"]
              }}
              d={linePoints}
            ></path>
          </g>
        )}
      </g>
    );
  }, [
    options.chart.progress.bar,
    options.chart.progress.pattern,
    options.chart.progress.width,
    style,
    task.height,
    task.progress,
    task.style,
    task.width
  ]);
};

export default ProgressBar;
