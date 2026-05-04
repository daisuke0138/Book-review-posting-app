import Head from "next/head";
import { useState, useCallback } from "react";
import styles from "../styles/style.module.scss";
import Header from "@/components/Header";
import Timeline from "@/components/Timeline";
import Post from "@/components/Post";
import Footer from "@/components/Footer";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePostSuccess = useCallback(() => {
    // Timelineを再読み込みするためのトリガー
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <>
      <Head>
        <title>本の感想を共有しよう</title>
        <meta name="description" content="本を読んだ感想をみんなと共有するアプリ" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className={styles.container}>
        <Post onPostSuccess={handlePostSuccess} />
        <Timeline refreshTrigger={refreshTrigger} />
      </main>
      <Footer />
    </>
  );
}
