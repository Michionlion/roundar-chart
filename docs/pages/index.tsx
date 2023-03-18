import Head from 'next/head';
import dynamic from 'next/dynamic';
import styles from '@/styles/Home.module.css';
import { ChangeEvent, useEffect, useState } from 'react';
import roundar from 'roundar-chart';

import '@uiw/react-textarea-code-editor/dist.css';
const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
);

declare global {
  interface Window {
    roundar: any;
  }
}

export default function Home() {
  const [code, setCode] = useState(`
// Code to modify #roundar-chart (the element above)
// This editor supports JS and JSX
const chart = document.getElementById("#roundar-chart");

`);

  function codeChange(ev: ChangeEvent<HTMLTextAreaElement>) {
    const newCode = ev.target.value;
    console.log(`got new code: ${newCode}`);
    setCode(newCode);

    console.log(`starting eval!`);
    eval(newCode);
    console.log(`finished eval!`);
  }

  useEffect(() => {
    // ts-ignore: 2339
    window.roundar = roundar;
  }, []);

  return (
    <>
      <Head>
        <title>Roundar Chart -- Generate rounded SVG radar charts for your web app</title>
        <meta name="description" content="Generate rounded SVG radar charts for your web app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Roundar Chart</h1>
        <h4 className={styles.subtitle}>Generate rounded SVG radar charts for your web app</h4>
        <div id="roundar-chart" className={styles.chart}></div>
        <CodeEditor
          value={code}
          language="jsx"
          placeholder="Reload the page to reset this code"
          onChange={codeChange}
          padding={8}
          className={styles.code}
        />
      </main>
    </>
  );
}
