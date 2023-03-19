# Roundar -- Rounded Radar Charts

**Generate SVG radar charts.**

This library is inspired by [svg-radar-chart](https://github.com/derhuerst/svg-radar-chart). It uses a similar implementation philosophy, but in Typescript and using browser DOM manipulation to build the SVG element. It's designed for use in frontend components to easily generate a `<g>` for use in any `<svg>` element you may want. It weighs `7.0k` and requires no outside dependencies.

## Installing

```shell
yarn add roundar-chart
```

## Usage

```typescript
import roundar from "roundar-chart"

// chart is a DOM <g> element
const chart = roundar(
  {
    // columns
    battery: 'Battery Capacity',
    design: 'Design',
    useful: 'Usefulness'
  },
  {
    // data (between 0.0 and 1.0)
    battery: 0.7,
    design: 0.9,
    useful: 0.4
  }
)

const svg = document.getElementById("#svg-chart");
svg.appendChild(chart);

// OR, if you want to get a string to pass on to some other frontend framework:

const svgElement = `
<svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
 <style>
  .axis {
   stroke-width: .2;
  }
  .scale {
   stroke-width: .2;
  }
  .shape {
   fill-opacity: .3;
  }
  .shape:hover {
   fill-opacity: .6;
  }
 </style>
 ${chart.outerHTML}
</svg>
`;
```

**Check [the documentation](https://michionlion.github.io/roundar-chart/) for an interactive chart example.**

## API

```typescript
function roundar(
  axes: {[key: string]: string},
  dataset: {[key: string]: number},
  opt: Options = defaults
): SVGElement
```

`axes` must be an object mapping keys to string values. The keys are column identifiers, values are captions.

`dataset` must be an object of data points. The keys must match column identifiers from `axes`.

`opt` is an optional options object and has the following default values:

```typescript
const defaults: Options = {
  size: 100, // size of the chart (including captions)
  axes: true, // show axes?
  scales: 3, // show scale circles?
  captions: true, // show captions?
  captionsPosition: 1.2, // where on the axes are the captions?
  captionFontSize: 2, // font size, in ems
  pathMaker: smoothingPathMaker, // shape smoothing function
};
```

The function for `pathMaker` must match the signature `(points: Array<[number, number]>) => string` and must return [valid SVG `<path>` commands](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d). It will be inserted into the `d` attribute of a `<path>` SVGPathElement.

## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/michionlion/roundar-chart/issues).
