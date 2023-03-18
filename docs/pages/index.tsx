import Head from 'next/head';
import styles from '@/styles/Home.module.css';

export default function Home() {
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
        <div className={styles.example}>
          <div id="roundar-chart" className={styles.chart}></div>
          <pre className={styles.code} contentEditable><code>Code to modify `#roundar-chart`</code></pre>
        </div>
      </main>
    </>
  );
}
