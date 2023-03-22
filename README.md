# Roundar &mdash; Rounded Radar Charts

**Generate SVG radar charts.**

This library uses Typescript (compiled to Javascript), [`d3-shape`](https://github.com/d3/d3-shape) (bundled), and browser DOM manipulation to build an SVG element depicting a radar chart with rounded data shapes.
It's designed for use in frontend interfaces to easily generate a `<g>` for insertion into any `<svg>` element you may want.
It weighs `7.7k` and requires no outside dependencies.

**Check [the example website](https://michionlion.github.io/roundar-chart/) for an interactive chart example.**

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
  [
    {
      // data (between 0.0 and 1.0)
      battery: 0.7,
      design: 0.9,
      useful: 0.4
    },
    {
      battery: 0.4,
      design: 0.6,
      useful: 0.8
    }
  ]
)

const svg = document.getElementById("#svg-chart");
svg.appendChild(chart);

// OR, if you want to get a string to pass on to some other frontend framework:

const svgElement = `
<svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
 <style>
  .axis {
   stroke-width: 0.2;
  }
  .scale {
   stroke-width: 0.2;
  }
  .shape {
   fill-opacity: 0.33;
  }
  .shape:hover {
   fill-opacity: 0.67;
  }
 </style>
 ${chart.outerHTML}
</svg>
`;
```

## API

```typescript
function roundar(
  axes: {[key: string]: string},
  dataset: Array<{[key: string]: number | string}>,
  options: Options = defaults
): SVGElement
```

`axes` must be an object mapping keys to string values. The keys are column identifiers, values are captions.

`dataset` must be a list of data points. Each data point must be an object with keys that must match column identifiers from `axes`. Any extra keys in that object are added as attributes to the shape's `<path>` element.

`options` is an optional options object and has the following default values:

```typescript
const defaults = {
  size: 100, // size of the chart (including captions)
  axes: true, // show axes?
  scales: 3, // show scale circles?
  captions: true, // show captions?
  captionsPosition: 1.05, // where on the axes are the captions?
  padding: 5, // the padding around the chart in svg units
  captionFontSize: 2, // font size in ems
  pathMaker: smoothingPathMaker, // shape smoothing function
};
```

The function for `pathMaker` must match the signature `(points: Array<[number, number]>) => string` and must return [valid SVG `<path>` commands](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d).
The returned result will be inserted into the `d` attribute of each dataset's `<path>` SVGPathElement.
Changing `pathMaker` allows you to specify your own shape smoothing (or non-smoothing) function.

## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/michionlion/roundar-chart/issues).
