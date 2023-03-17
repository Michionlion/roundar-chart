import {
  line,
  curveCardinalClosed,
  // curveMonotoneX,
  // curveCatmullRomClosed,
} from 'd3-shape';

function polarToX(angle: number, distance: number) {
  return Math.cos(angle - Math.PI / 2) * distance;
}

function polarToY(angle: number, distance: number) {
  return Math.sin(angle - Math.PI / 2) * distance;
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
  return line().curve(curveCardinalClosed.tension(1.0))(points) || 'error';
}

function createSVGElement(
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

function axis(chartRadius: number, angle: number) {
  return createSVGElement('polyline', {
    className: 'axis',
    points: points([
      [0, 0],
      [polarToX(angle, chartRadius), polarToY(angle, chartRadius)],
    ]),
  });
}

function shape(
  dataset: {[key: string]: number},
  chartRadius: number,
  columns: Array<{key: string; angle: number}>,
  pathMaker: (points: Array<[number, number]>) => string
): SVGElement {
  return createSVGElement('path', {
    className: 'shape',
    d: pathMaker(
      columns.map((column: {key: string; angle: number}) => {
        const val = dataset[column.key];
        if ('number' !== typeof val || val < 0 || val > 1) {
          throw new Error(`Data set ${JSON.stringify(dataset)} is invalid.`);
        }

        return [
          polarToX(column.angle, val * chartRadius),
          polarToY(column.angle, val * chartRadius),
        ];
      })
    ),
  });
}

function scale(chartRadius: number, value: number) {
  return createSVGElement('circle', {
    className: 'scale',
    fill: 'none',
    cx: 0,
    cy: 0,
    r: value * chartRadius,
  });
}

function caption(
  caption: string,
  chartRadius: number,
  angle: number,
  fontSize: number
) {
  return createSVGElement(
    'text',
    {
      className: 'caption',
      textAnchor: 'middle',
      fontSize: fontSize || 2,
      fontFamily: 'sans-serif',
      x: polarToX(angle, chartRadius * 0.95).toFixed(4),
      y: polarToY(angle, chartRadius * 0.95).toFixed(4),
      dy: (fontSize || 2) / 2,
    },
    caption
  );
}

interface Options {
  size: number;
  axes: boolean;
  scales: number;
  captions: boolean;
  captionsPosition: number;
  captionFontSize: number;
  pathMaker: (points: Array<[number, number]>) => string;
}

const defaults: Options = {
  size: 100, // size of the chart (including captions)
  axes: true, // show axes?
  scales: 3, // show scale circles?
  captions: true, // show captions?
  captionsPosition: 1.2, // where on the axes are the captions?
  captionFontSize: 2, // font size, in ems
  pathMaker: smoothingPathMaker, // shape smoothing function
};

/**
 * Render a radar chart
 *
 * @export
 * @param {{ [key: string]: string }} axes a map from column key to column caption
 * @param {{ [key: string]: number }} dataset a map from column key to value (between 0 and 1)
 * @param {Options} [opt=defaults] options for the chart
 * @return {SVGElement} a <g> element containing the chart
 */
export default function roundar(
  axes: {[key: string]: string},
  dataset: {[key: string]: number},
  opt: Options = defaults
): SVGElement {
  opt = Object.assign({}, defaults, opt);

  const chartSize = opt.size / opt.captionsPosition;
  const chartRadius = chartSize / 2;

  const columns = Object.keys(axes).map((key, i, all) => ({
    key: key,
    caption: axes[key],
    angle: (Math.PI * 2 * i) / all.length,
  }));

  const groups: Array<SVGElement> = [
    shape(dataset, chartRadius, columns, opt.pathMaker),
  ];
  if (opt.captions) {
    groups.push(
      createSVGElement(
        'g',
        {className: 'captions'},
        ...columns.map((col) =>
          caption(col.caption, chartRadius, col.angle, opt.captionFontSize)
        )
      )
    );
  }

  if (opt.axes)
    groups.unshift(
      createSVGElement(
        'g',
        {className: 'axes'},
        ...columns.map((col) => axis(chartRadius, col.angle))
      )
    );
  if (opt.scales > 0) {
    const scales: Array<SVGElement> = [];
    for (let i = opt.scales; i > 0; i--) {
      scales.push(scale(chartRadius, i / opt.scales));
    }
    groups.unshift(createSVGElement('g', {className: 'scales'}, ...scales));
  }

  const delta = (opt.size / 2).toFixed(4);
  return createSVGElement(
    'g',
    {
      className: 'chart',
      transform: `translate(${delta},${delta})`,
    },
    ...groups
  );
}
