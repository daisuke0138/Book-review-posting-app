import React, { useState } from "react";
import styles from "./style.module.scss";
import apiClient from "@/lib/apiClient";
import router from "next/router";

const SignUp = () => {
    const [username, setUserName] = useState("");
    const [libraryCardNumber, setLibraryCardNumber] = useState("");
    const [errors, setErrors] = useState<{ username?: string; libraryCardNumber?: string }>({});

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d{0,6}$/.test(value)) {
            setLibraryCardNumber(value);
            setErrors((prev) => ({ ...prev, libraryCardNumber: undefined }));
        }
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
        setErrors((prev) => ({ ...prev, username: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: { username?: string; libraryCardNumber?: string } = {};

        if (!username.trim()) {
            newErrors.username = "お名前を入力してください";
        }
        if (libraryCardNumber.length !== 6) {
            newErrors.libraryCardNumber = "図書カード番号は6桁の数字で入力してください";
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await apiClient.post("/auth/register", {
                username,
                libraryCardNumber,
            });

            router.push("/login");

        } catch (err: any) {
            // バックエンドからの重複エラーを各フィールドに振り分け
            const message: string = err?.response?.data?.message ?? "";
            if (message.includes("username") || message.includes("名前")) {
                setErrors((prev) => ({ ...prev, username: "このお名前はすでに登録されています" }));
            } else if (message.includes("libraryCardNumber") || message.includes("図書カード")) {
                setErrors((prev) => ({ ...prev, libraryCardNumber: "この図書カード番号はすでに登録されています" }));
            } else {
                setErrors({ username: "入力内容に誤りがあります。確認してください" });
            }
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
                    placeholder="ニックネームを入力してください"
                    onChange={handleUsernameChange}
                />
                {errors.username && <span className={styles.form__error}>{errors.username}</span>}
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
                {errors.libraryCardNumber && <span className={styles.form__error}>{errors.libraryCardNumber}</span>}
            </div>

            <button className={styles.form__btn}>新規登録</button>
        </form>
    );
};

export default SignUp;
