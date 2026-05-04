import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BRegi from "@/components/B-regi";

export default function BookRegister() {
  return (
    <>
      <Head>
        <title>本の登録 | 本の感想を共有しよう</title>
        <meta name="description" content="新しい本のタイトルを登録する" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <BRegi />
      <Footer />
    </>
  );
}
