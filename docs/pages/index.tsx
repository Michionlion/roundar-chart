import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import {useState, useEffect} from 'react';
import roundar from 'roundar-chart';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    roundar: any;
  }
}

function runCode(script: string) {
  console.log(`starting eval!`);
  try {
    window.roundar = roundar;
    eval(script);
  } catch (e) {
    console.error(e);
  }
  console.log(`finished eval!`);
}

function GitHubLink() {
  return (
    <a
      className={styles.iconLink}
      href="https://github.com/Michionlion/roundar-chart"
      title="View on GitHub"
    >
      <svg
        className={styles.icon}
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    </a>
  );
}

export default function Home() {
  const [code, setCode] =
    useState(`// Code to modify #roundar-chart and #chart-style
const chart = document.getElementById("roundar-chart");
chart.replaceChildren(
  window.roundar(
    {
      infection: "Infection Risk",
      hospitalization: "Hospitalization Risk",
      death: "Mortality Risk",
    },
    [
      {
        fill: "blue",
        class: "flu",
        infection: 0.85,
        hospitalization: 0.35,
        death: 0.08,
      },
      {
        fill: "yellow",
        "stroke-dasharray": "1 0.67",
        infection: 0.35,
        hospitalization: 0.23,
        death: 0.64,
      },
    ],
    {
      size: 100, // size of the chart
      axes: true, // display axes
      scales: 10, // how many scale marks
      labels: true, // display labels
      padding: 15, // the padding around the chart in svg units
      labelFontSize: 2.75, // font size in ems
      dx: -2, // horizontal offset of chart
      dy: 8, // vertical offset of chart
    }
  )
);

const style = document.getElementById("chart-style");
style.innerText = \`
  .scale {
    fill: rgb(200, 0, 0);
    fill-opacity: 0.03;
  }
  .axis {
    cursor: crosshair;
  }
  .shape {
    fill-opacity: 0.2;
  }
  .label {
    text-shadow: 1px 1px 1px white;
    cursor: default;
  }
  .flu {
    fill-opacity: 0.33;
    cursor: crosshair;
    transition: 100ms ease-in-out;
  }
  .flu:hover {
    fill-opacity: 0.67;
  }
\`;
`);

  useEffect(() => {
    const logo = document.getElementById('logo');
    logo?.replaceChildren(
      roundar(
        {
          x: 'X',
          y: 'Y',
          z: 'Z',
          w: 'W',
          v: 'V',
        },
        [
          {
            fill: 'red',
            x: 0.84,
            y: 0.39,
            z: 0.11,
            w: 0.35,
            v: 0.49,
          },
          {
            fill: 'blue',
            x: 0.35,
            y: 0.28,
            z: 0.64,
            w: 0.95,
            v: 0.35,
          },
          {
            fill: 'green',
            x: 0.68,
            y: 0.83,
            z: 0.26,
            w: 0.61,
            v: 0.72,
          },
        ],
        {
          size: 100,
          axes: true,
          scales: 0,
          labels: false,
          padding: 0,
        }
      )
    );
    runCode(code);
  }, []);

  function codeChange(newCode: string) {
    console.log(`got new code:\n---\n${newCode}\n---`);
    setCode(newCode);
    runCode(newCode);
  }

  return (
    <>
      <Head>
        <title>
          Roundar Chart -- Generate rounded SVG radar charts for your web app
        </title>
        <meta
          name="description"
          content="Generate rounded SVG radar charts for your web app"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <div className={styles.logo}>
          <svg
            id="logo"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          ></svg>
        </div>
        <div className={styles.title}>
          <h1>Roundar Chart</h1>
          <sub>Generate rounded SVG radar charts for your web app</sub>
        </div>
        <div className={styles.githubLink}>
          <GitHubLink />
        </div>
      </header>
      <main className={styles.main}>
        <style id="chart-style" type="text/css"></style>
        <svg
          id="roundar-chart"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.chart}
        ></svg>
        <textarea
          spellCheck={false}
          value={code}
          rows={16}
          placeholder="Reload the page to reset this code"
          onChange={(ev) => codeChange(ev.target.value)}
          className={styles.editor}
        />
      </main>
      <footer className={styles.footer}></footer>
    </>
  );
}
