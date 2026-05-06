import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Review from "@/components/Review";

export default function ReviewList() {
    return (
        <>
            <Head>
                <title>レビュー一覧 | 本の感想を共有しよう</title>
                <meta name="description" content="登録されている本と最新の感想一覧" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Header />
            <Review />
            <Footer />
        </>
    );
}
