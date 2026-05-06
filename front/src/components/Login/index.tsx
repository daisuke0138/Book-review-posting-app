import React, { useState } from "react";
import styles from "./style.module.scss";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/router";
import { useAuth } from "@/context/auth";

const Login = () => {
    const [username, setUsername] = useState("");
    const [libraryCardNumber, setLibraryCardNumber] = useState("");
    const [errors, setErrors] = useState<{ username?: string; libraryCardNumber?: string }>({});

    const router = useRouter();
    const { login } = useAuth();

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        setErrors((prev) => ({ ...prev, username: undefined }));
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d{0,6}$/.test(value)) {
            setLibraryCardNumber(value);
            setErrors((prev) => ({ ...prev, libraryCardNumber: undefined }));
        }
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
            const response = await apiClient.post("/auth/login", {
                username,
                libraryCardNumber,
            });

            const token = response.data.token;
            login(token);

            router.push("/");
        } catch (err) {
            setErrors({ username: "お名前または図書カード番号が正しくありません" });
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h3 className={styles.form__title}>ログイン</h3>

            <div className={styles.form__item}>
                <label htmlFor="username">お名前</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    placeholder="お名前を入力してください"
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

            <button className={styles.form__btn}>ログイン</button>
        </form>
    );
};

export default Login;
