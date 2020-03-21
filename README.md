<h1>Gantt-elastic - Javascript Gantt Chart (editable, responsive)</h1>
<h2>Javascript Gantt Chart for React, jquery, vanilla js and other frameworks</h2>

<br>

<div style="display:block;text-align:center">
<img src="https://api.codacy.com/project/badge/Grade/de39273bf6c84e81a4da175907122d5a">
<img src="https://snyk.io/test/github/neuronetio/gantt-elastic/badge.svg">
<img src="https://img.badgesize.io/neuronetio/gantt-elastic/master/dist/GanttElastic.umd.min.js.png?compression=gzip&label=gzipped">
<img src="https://img.shields.io/npm/dm/gantt-elastic.svg">
<img src="https://img.shields.io/npm/l/gantt-elastic.svg">
<img src="https://badge.fury.io/js/gantt-elastic.svg">
<a href="https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Fneuronetio%2Fgantt-elastic"><img alt="Twitter" src="https://img.shields.io/twitter/url/https/github.com/neuronetio/gantt-elastic?style=social"></a>
</div>

<p>
Keywords: [ gantt, javascript gantt, gantt chart,js gantt,react gantt,project manager,gantt project manager,responsive gantt ]
</p>

<h2><a href="https://neuronet.io/gantt-elastic/" target="_blank">Gantt-elastic demo here</a></h2>

![preview img](https://github.com/neuronetio/gantt-elastic/raw/master/gantt-elastic.jpg)
![preview gif](https://github.com/neuronetio/gantt-elastic/raw/master/gantt-elastic.gif)
![preview gif](https://github.com/neuronetio/gantt-elastic/raw/master/grab-scroll.gif)

## Gantt-elastic

is a vue component but it could be used in other frameworks or even with jQuery (vue is kind of elastic and lightweight framework).

[WIKI](https://github.com/neuronetio/gantt-elastic/wiki)

[Vue Example](https://github.com/neuronetio/vue-gantt-elastic)

### Installation

`npm install --save react-gantt-elastic` or download zip from github / clone repo

### Usage

```tsx
import dayjs from "dayjs";
import React from "react";
import ReactDOM from "react-dom";
import GanttElastic from "./GanttElastic";
import "./style.css";

function getDate(hours: number): number {
  return (
    dayjs()
      .startOf("day")
      .valueOf() +
    hours * 60 * 60 * 1000
  );
}

const tasks = [
  {
    id: 1,
    label: "Make some noise",
    user:
      '<a href="https://www.google.com/search?q=John+Doe" target="_blank" style="color:#0077c0;">John Doe</a>',
    start: getDate(-24 * 5),
    duration: 5 * 24 * 60 * 60 * 1000,
    progress: 85,
    type: "project"
  },
  {
    id: 2,
    label: "With great power comes great responsibility",
    user:
      '<a href="https://www.google.com/search?q=Peter+Parker" target="_blank" style="color:#0077c0;">Peter Parker</a>',
    parentId: 1,
    start: getDate(-24 * 4),
    duration: 4 * 24 * 60 * 60 * 1000,
    progress: 50,
    type: "milestone",
    style: {
      base: {
        fill: "#1EBC61",
        stroke: "#0EAC51"
      }
      /*'tree-row-bar': {
            fill: '#1EBC61',
            stroke: '#0EAC51'
          },
          'tree-row-bar-polygon': {
            stroke: '#0EAC51'
          }*/
    }
  },
  {
    id: 3,
    label: "Courage is being scared to death, but saddling up anyway.",
    user:
      '<a href="https://www.google.com/search?q=John+Wayne" target="_blank" style="color:#0077c0;">John Wayne</a>',
    parentId: 2,
    start: getDate(-24 * 3),
    duration: 2 * 24 * 60 * 60 * 1000,
    progress: 100,
    type: "task"
  },
  {
    id: 4,
    label: "Put that toy AWAY!",
    user:
      '<a href="https://www.google.com/search?q=Clark+Kent" target="_blank" style="color:#0077c0;">Clark Kent</a>',
    start: getDate(-24 * 2),
    duration: 2 * 24 * 60 * 60 * 1000,
    progress: 50,
    type: "task",
    dependentOn: [3]
  },
  {
    id: 5,
    label:
      "One billion, gajillion, fafillion... shabadylu...mil...shabady......uh, Yen.",
    user:
      '<a href="https://www.google.com/search?q=Austin+Powers" target="_blank" style="color:#0077c0;">Austin Powers</a>',
    parentId: 4,
    start: getDate(0),
    duration: 2 * 24 * 60 * 60 * 1000,
    progress: 10,
    type: "milestone",
    style: {
      base: {
        fill: "#0287D0",
        stroke: "#0077C0"
      }
    }
  },
  {
    id: 6,
    label: "Butch Mario and the Luigi Kid",
    user:
      '<a href="https://www.google.com/search?q=Mario+Bros" target="_blank" style="color:#0077c0;">Mario Bros</a>',
    parentId: 5,
    start: getDate(24),
    duration: 1 * 24 * 60 * 60 * 1000,
    progress: 50,
    type: "task",
    style: {
      base: {
        fill: "#8E44AD",
        stroke: "#7E349D"
      }
    }
  },
  {
    id: 7,
    label: "Devon, the old man wanted me, it was his dying request",
    user:
      '<a href="https://www.google.com/search?q=Knight+Rider" target="_blank" style="color:#0077c0;">Knight Rider</a>',
    parentId: 2,
    dependentOn: [6],
    start: getDate(24 * 2),
    duration: 4 * 60 * 60 * 1000,
    progress: 20,
    type: "task"
  },
  {
    id: 8,
    label: "Hey, Baby! Anybody ever tell you I have beautiful eyes?",
    user:
      '<a href="https://www.google.com/search?q=Johhny+Bravo" target="_blank" style="color:#0077c0;">Johhny Bravo</a>',
    parentId: 7,
    dependentOn: [7],
    start: getDate(24 * 3),
    duration: 1 * 24 * 60 * 60 * 1000,
    progress: 0,
    type: "task"
  },
  {
    id: 9,
    label:
      "This better be important, woman. You are interrupting my very delicate calculations.",
    user:
      '<a href="https://www.google.com/search?q=Dexter\'s+Laboratory" target="_blank" style="color:#0077c0;">Dexter\'s Laboratory</a>',
    parentId: 8,
    dependentOn: [8, 7],
    start: getDate(24 * 4),
    duration: 4 * 60 * 60 * 1000,
    progress: 20,
    type: "task",
    style: {
      base: {
        fill: "#8E44AD",
        stroke: "#7E349D"
      }
    }
  },
  {
    id: 10,
    label: "current task",
    user: (
      <a
        href="https://www.google.com/search?q=Johnattan+Owens"
        target="_blank"
        style={{ color: "#0077c0" }}
      >
        Johnattan Owens
      </a>
    ),
    start: getDate(24 * 5),
    duration: 24 * 60 * 60 * 1000,
    progress: 0,
    type: "task"
  }
];

const options = {
  title: {
    label: "Your project title as html (link or whatever...)",
    html: false
  },
  times: {
    timeZoom: 10,
    firstTime: dayjs("2020/03/10").valueOf()
  },
  row: { height: 16 },
  taskList: {
    columns: [
      {
        id: 1,
        label: "ID",
        value: "id",
        width: 40
      },
      {
        id: 2,
        label: "Description",
        value: "label",
        width: 200,
        expander: true
      },
      {
        id: 3,
        label: "Assigned to",
        value: "user",
        width: 130,
        html: true
      },
      {
        id: 4,
        label: "Start",
        value: task => dayjs(task.start).format("YYYY-MM-DD"),
        width: 78
      },
      {
        id: 5,
        label: "Type",
        value: "type",
        width: 68
      },
      {
        id: 6,
        label: "%",
        value: "progress",
        width: 35,
        style: {
          "task-list-header-label": {
            textAlign: "center",
            width: "100%"
          },
          "task-list-item-value-container": {
            textAlign: "center"
          }
        }
      }
    ]
  }
  // locale: {
  //   name: "pl", // name String
  //   weekdays: "Poniedziałek_Wtorek_Środa_Czwartek_Piątek_Sobota_Niedziela".split(
  //     "_"
  //   ), // weekdays Array
  //   weekdaysShort: "Pon_Wto_Śro_Czw_Pią_Sob_Nie".split("_"), // OPTIONAL, short weekdays Array, use first three letters if not provided
  //   weekdaysMin: "Pn_Wt_Śr_Cz_Pt_So_Ni".split("_"), // OPTIONAL, min weekdays Array, use first two letters if not provided
  //   months: "Styczeń_Luty_Marzec_Kwiecień_Maj_Czerwiec_Lipiec_Sierpień_Wrzesień_Październik_Listopad_Grudzień".split(
  //     "_"
  //   ), // months Array
  //   monthsShort: "Sty_Lut_Mar_Kwi_Maj_Cze_Lip_Sie_Wrz_Paź_Lis_Gru".split("_"), // OPTIONAL, short months Array, use first three letters if not provided
  //   ordinal: n => `${n}`, // ordinal Function (number) => return number + output
  //   relativeTime: {
  //     // relative time format strings, keep %s %d as the same
  //     future: "za %s", // e.g. in 2 hours, %s been replaced with 2hours
  //     past: "%s temu",
  //     s: "kilka sekund",
  //     m: "minutę",
  //     mm: "%d minut",
  //     h: "godzinę",
  //     hh: "%d godzin", // e.g. 2 hours, %d been replaced with 2
  //     d: "dzień",
  //     dd: "%d dni",
  //     M: "miesiąc",
  //     MM: "%d miesięcy",
  //     y: "rok",
  //     yy: "%d lat"
  //   }
  // }
};

ReactDOM.render(
  <GanttElastic
    tasks={tasks}
    options={options}
    style={{
      height: "100%"
    }}
  ></GanttElastic>,
  document.getElementById("root")
);
```

### Licensce

MIT
