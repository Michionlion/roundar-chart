import {line, curveCardinalClosed} from 'd3-shape';

function polarToX(angle: number, distance: number) {
  return Math.cos(angle - Math.PI / 2) * distance;
}

function polarToY(angle: number, distance: number) {
  return Math.sin(angle - Math.PI / 2) * distance;
}

function radiansToDegrees(radians: number) {
  return radians * (180 / Math.PI);
}

function points(points: Array<[number, number]>) {
  return points
    .map((point) => point[0].toFixed(4) + ',' + point[1].toFixed(4))
    .join(' ');
}

export function noSmoothingPathMaker(points: Array<[number, number]>) {
  let d = 'M' + points[0][0].toFixed(4) + ',' + points[0][1].toFixed(4);
  for (let i = 1; i < points.length; i++) {
    d += 'L' + points[i][0].toFixed(4) + ',' + points[i][1].toFixed(4);
  }
  return d + 'z';
}

export function smoothingPathMaker(points: Array<[number, number]>): string {
  return line().curve(curveCardinalClosed.tension(0.15))(points) || 'error';
}

export function createSVGElement(
  tag: string,
  attrs: {[key: string]: string | number} = {},
  ...children: Array<Node | string>
) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  if (attrs) {
    for (const key in attrs) {
      el.setAttribute(key, attrs[key].toString());
    }
  }
  if (children) {
    for (let child of children) {
      if (typeof child === 'string') {
        child = document.createTextNode(child);
      }
      el.appendChild(child);
    }
  }
  return el;
}

function shape(
  data: {[key: string]: number | string},
  chartRadius: number,
  columns: Array<{key: string; angle: number}>,
  pathMaker: (points: Array<[number, number]>) => string
): SVGElement {
  return createSVGElement('path', {
    ...data,
    class: data.class ? `${data.class} shape` : `shape`,
    fill: data.fill || data.stroke || 'black',
    stroke: data.stroke || data.fill || 'black',
    'fill-opacity': data['fill-opacity'] || 0.3,
    'stroke-width': data['stroke-width'] || 0.4,
    d: pathMaker(
      columns.map((column: {key: string; angle: number}) => {
        const val = Number(data[column.key]);
        if (isNaN(val) || val < 0 || val > 1) {
          throw new Error(`Data set ${JSON.stringify(data)} is invalid.`);
        }
        return [
          polarToX(column.angle, val * chartRadius),
          polarToY(column.angle, val * chartRadius),
        ];
      })
    ),
  });
}

function axis(chartRadius: number, angle: number) {
  return createSVGElement('polyline', {
    class: 'axis',
    stroke: 'black',
    'stroke-width': 0.25,
    points: points([
      [0, 0],
      [polarToX(angle, chartRadius), polarToY(angle, chartRadius)],
    ]),
  });
}

function scale(chartRadius: number, value: number, index: number) {
  return createSVGElement('circle', {
    class: `scale scale-${index}`,
    fill: 'none',
    stroke: 'black',
    'stroke-width': 0.1,
    cx: 0,
    cy: 0,
    r: value * chartRadius,
  });
}

function label(
  text: string,
  chartRadius: number,
  angle: number,
  fontSize: number
) {
  console.log(
    `label ${text} with anchor: ${angle < Math.PI ? 'start' : 'end'}, angle: ${
      radiansToDegrees(angle) + 90
    }`
  );

  return createSVGElement(
    'text',
    {
      class: 'label',
      'text-anchor': angle < Math.PI ? 'start' : 'end',
      'font-size': fontSize || 2,
      'font-family': 'sans-serif',
      'font-weight': 'normal',
      transform: `translate(${polarToX(angle, chartRadius)}, ${polarToY(
        angle,
        chartRadius
      )}) rotate(${
        radiansToDegrees(angle) + 90 + (angle < Math.PI ? 180 : 0)
      })`,
      dy: (fontSize || 2) / 3,
      dx: angle < Math.PI ? '0.02rem' : '-0.02rem',
    },
    text
  );
}

export interface Options {
  size?: number;
  axes?: boolean;
  scales?: number;
  labels?: boolean;
  padding?: number;
  labelFontSize?: number;
  dx?: number;
  dy?: number;
  pathMaker?: (points: Array<[number, number]>) => string;
}

interface DefaultedOptions {
  size: number;
  axes: boolean;
  scales: number;
  labels: boolean;
  padding: number;
  labelFontSize: number;
  dx: number;
  dy: number;
  pathMaker: (points: Array<[number, number]>) => string;
}

const defaults: DefaultedOptions = {
  size: 100, // size of the chart (including labels)
  axes: true, // show axes?
  scales: 3, // show scale circles?
  labels: true, // show labels?
  padding: 5, // the padding around the chart in svg units
  labelFontSize: 2, // font size in ems
  dx: 0, // offset of chart on x-axis
  dy: 0, // offset of chart on y-axis
  pathMaker: smoothingPathMaker, // shape smoothing function
};

/**
 * Render a radar chart.
 *
 * Your data can include attributes which will be set on each shape,
 * as well as the shape parameters; for instance, you can include a
 * `class` property to set the CSS class of each shape.
 *
 * @export
 * @param {{ [key: string]: string }} axes a map from column key to column label
 * @param {Array<{ [key: string]: number }>} dataset a list of objects, each a map from column key to value (between 0 and 1)
 * @param {Options} [options=defaults] options for the chart
 * @return {SVGElement} a <g> element containing the chart
 */
export default function roundar(
  axes: {[key: string]: string},
  dataset: Array<{[key: string]: number | string}>,
  options: Options = defaults
): SVGElement {
  if (!Array.isArray(dataset)) {
    throw new Error('Dataset must be an array.');
  }
  const opt = Object.assign({}, defaults, options) as DefaultedOptions;

  const chartSize = opt.size - opt.padding * 2;
  const chartRadius = chartSize / 2;

  // TODO: special case handling for 1 and 2 axes

  const columns = Object.keys(axes).map((key, i, all) => ({
    key: key,
    label: axes[key],
    angle: (Math.PI * 2 * i) / all.length,
  }));

  const groups: Array<SVGElement> = dataset.map((data) =>
    shape(data, chartRadius, columns, opt.pathMaker)
  );

  if (opt.labels) {
    groups.push(
      createSVGElement(
        'g',
        {class: 'labels'},
        ...columns.map((col) =>
          label(col.label, chartRadius, col.angle, opt.labelFontSize)
        )
      )
    );
  }

  if (opt.axes)
    groups.unshift(
      createSVGElement(
        'g',
        {class: 'axes'},
        ...columns.map((col) => axis(chartRadius, col.angle))
      )
    );
  if (opt.scales > 0) {
    const scales: Array<SVGElement> = [];
    for (let i = opt.scales; i > 0; i--) {
      scales.push(scale(chartRadius, i / opt.scales, i));
    }
    groups.unshift(createSVGElement('g', {class: 'scales'}, ...scales));
  }

  const deltaX = (opt.size / 2 + opt.dx).toFixed(4);
  const deltaY = (opt.size / 2 + opt.dy).toFixed(4);
  return createSVGElement(
    'g',
    {
      class: 'chart',
      transform: `translate(${deltaX},${deltaY})`,
    },
    ...groups
  );
}
