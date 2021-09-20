# [![](https://pushme-pullyou.github.io/tootoo-2021/lib/assets/icons/mark-github.svg )](https://github.com/pushme-pullyou/tootoo-2021/tree/main/sandbox/gridjs-library "Source code on GitHub" ) [TT 2021]( https://pushme-pullyou.github.io/tootoo-2021/ "Home page" ) / [GridJS Read Me]( https://pushme-pullyou.github.io/tootoo-2021/#sandbox/gridjs-library/README.md)


<!--@@@
<div class=iframe-resize ><iframe src=https://pushme-pullyou.github.io/tootoo-2021/sandbox/gridjs-library/ height=100% width=100% ></iframe></div>
_"GridJS" in a resizable window. One finger to rotate. Two to zoom._
@@@-->

## Full Screen: [GridJS]( https://pushme-pullyou.github.io/tootoo-2021/sandbox/gridjs-library/ )


## Concept

Demos for

* https://github.com/grid-js/gridjs
* https://gridjs.io/
* https://gridjs.io/docs/index
Advanced Table Plugin

Grid.js is a Free and open-source JavaScript table plugin. It works with most JavaScript frameworks, including React, Angular, Vue and VanillaJs.

* Small. Only 12kb with all plugins (minified and gzipped)
* Fast! Grid.js has an internal pipeline that takes care of caching and processing data
* Works with all web frameworks
* Supports all modern web-browsers
* No vendor lock-in
* MIT licensed and Free!

Code

* <link href="https://unpkg.com/gridjs/dist/theme/mermaid.min.css" rel="stylesheet" />
* <script src="https://unpkg.com/gridjs/dist/gridjs.umd.js"></script>

``` JavaScript

new gridjs.Grid({
  columns: ["Name", "Email", "Phone Number"],
  data: [
    ["John", "john@example.com", "(353) 01 222 3333"],
    ["Mark", "mark@gmail.com", "(01) 22 888 4444"],
    ["Eoin", "eoin@gmail.com", "0097 22 654 00033"],
    ["Sarah", "sarahcdd@gmail.com", "+322 876 1233"],
    ["Afshin", "afshin@mail.com", "(353) 22 87 8356"]
  ]
}).render(document.getElementById("wrapper"));

```

## To Do / Wish List


## Issues


## Links of Interest


## Change Log


### 2021-08-05

* grid.js serverside update and working with simplemaps 174 json
* First commit this readme


***

<center title="Hello! Click me to go up to the top" ><a class=aDingbat href=javascript:window.scrollTo(0,0);> ❦ </a></center>
