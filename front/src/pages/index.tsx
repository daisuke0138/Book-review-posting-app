import Head from "next/head";
import { useState, useCallback } from "react";
import styles from "../styles/style.module.scss";
import Header from "@/components/Header";
import Timeline from "@/components/Timeline";
import Post from "@/components/Post";
import Search from "@/components/Search";
import Footer from "@/components/Footer";
import { BookType } from "@/types";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);

  const handlePostSuccess = useCallback(() => {
    // Timelineを再読み込みするためのトリガー
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleBookSelect = useCallback((book: BookType | null) => {
    setSelectedBook(book);
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
        <Search onBookSelect={handleBookSelect} selectedBook={selectedBook} />
        <Post onPostSuccess={handlePostSuccess} selectedBook={selectedBook} />
        <Timeline refreshTrigger={refreshTrigger} selectedBook={selectedBook} />
      </main>
      <Footer />
    </>
  );
}
