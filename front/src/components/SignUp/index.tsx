import React, { useState } from "react";
import styles from "./style.module.scss";
import apiClient from "@/lib/apiClient";
import router from "next/router";

const SignUp = () => {
    const [username, setUserName] = useState("");
    const [libraryCardNumber, setLibraryCardNumber] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // 図書カード番号のバリデーション（6桁の数字のみ）
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 数字のみ許可、最大6桁
        if (/^\d{0,6}$/.test(value)) {
            setLibraryCardNumber(value);
            setError("");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // バリデーションチェック
        if (libraryCardNumber.length !== 6) {
            setError("図書カード番号は6桁の数字で入力してください");
            return;
        }

        try {
            await apiClient.post("/auth/register", {
                username,
                libraryCardNumber,
                password,
            });

            router.push("/login");
            
        } catch (err) {
            console.log(err);
            alert("入力の何かが正しくありません！");
        }
    };
    
    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h3 className={styles.form__title}>アカウントを作成</h3>

            <div className={styles.form__item}>
                <label htmlFor="username">お名前</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    placeholder="お名前を入力してください"
                    onChange={(e) => setUserName(e.target.value)}
                />
            </div>

            <div className={styles.form__item}>
                <label htmlFor="libraryCardNumber">図書カード番号（6桁）</label>
                <input
                    id="libraryCardNumber"
                    type="text"
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    value={libraryCardNumber}
                    placeholder="123456"
                    onChange={handleCardNumberChange}
                />
                {error && <span className={styles.form__error}>{error}</span>}
            </div>

            <div className={styles.form__item}>
                <label htmlFor="password">パスワード</label>
                <input
                    id="password"
                    type="password"
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
