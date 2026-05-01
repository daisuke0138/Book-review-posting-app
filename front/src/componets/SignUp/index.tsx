import React, { useState } from "react";
import styles from "./style.module.scss";
import apiClient from "@/pages/lib/apiClient";
import router from "next/router";

const SignUp = () => {
    // useState　各フォームの入力を保持します🤗
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // 送信の処理を記述します🤗

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        console.log(username);
        console.log(email);
        console.log(password);

        // 追記 APIにデータを送りましょう！
        try {
            await apiClient.post("/auth/register", {
                username,
                email,
                password,
            });

            router.push("/login")
            
        } catch (err) {
            console.log(err);
            alert("入力の何かが正しくありません！");
        }
    };
    
    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h3 className={styles.form__title}>アカウントを作成</h3>

            <div className={styles.form__item}>
                <label htmlFor="">お名前</label>
                <input
                    type="text"
                    value={username}
                    placeholder="お名前を入力してください"
                    onChange={(e) => setUserName(e.target.value)}
                />
            </div>

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

            <button className={styles.form__btn}>新規登録</button>
        </form>
    );
};

export default SignUp;