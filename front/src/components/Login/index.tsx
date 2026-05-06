import React, { useState } from "react";
import styles from "./style.module.scss";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
import router, { useRouter } from "next/router";
import { useAuth } from "@/context/auth";

const Login = () => {
    const [libraryCardNumber, setLibraryCardNumber] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();
    const { login } = useAuth();

    // 図書カード番号のバリデーション（6桁の数字のみ）
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d{0,6}$/.test(value)) {
            setLibraryCardNumber(value);
            setError("");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (libraryCardNumber.length !== 6) {
            setError("図書カード番号は6桁の数字で入力してください");
            return;
        }

        try {
            const response = await apiClient.post("/auth/login", {
                libraryCardNumber,
                password,
            });

            const token = response.data.token;
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

            <button className={styles.form__btn}>ログイン</button>
        </form>
    );
};

export default Login;
