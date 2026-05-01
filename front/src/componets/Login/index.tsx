import React, { useState } from "react";
import styles from "./style.module.scss";
import Link from "next/link";
import apiClient from "@/pages/lib/apiClient";
import router, { useRouter } from "next/router";
import { useAuth } from "@/context/auth";

const Login = () => {
    // useState　各フォームの入力を保持します🤗
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    // 呼び出し追記
    const { login } = useAuth();

    // 送信の処理を記述します🤗

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        //新規登録を行うAPIを叩く
        try {
            const response = await apiClient.post("/auth/login", {
                email,
                password,
            });

            const token = response.data.token;
            console.log(token);

            // ここで使用する
            login(token);

            router.push("/");
        } catch (err) {
            alert("入力内容が正しくありません。");
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h3 className={styles.form__title}>ログイン</h3>

            <div className={styles.form__item}>
                <label htmlFor="">メールアドレス</label>
                <input
                    type="text"
                    value={email}
                    placeholder="メールアドレスを入力してください"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className={styles.form__item}>
                <label htmlFor="">パスワード</label>
                <input
                    type="text"
                    value={password}
                    placeholder="パスワードを入力してください"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button className={styles.form__btn}>ログイン</button>
        </form>
    );
};

export default Login;