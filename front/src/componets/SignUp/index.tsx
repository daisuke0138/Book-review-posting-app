import React from "react";
import styles from "./style.module.scss";

const SignUp = () => {
    return (
        <div className={styles.form}>
            <h3 className={styles.form__title}>アカウントを作成</h3>

            <div className={styles.form__item}>
                <label htmlFor="">お名前</label>
                <input type="text" placeholder="お名前を入力してください" />
            </div>

            <div className={styles.form__item}>
                <label htmlFor="">メールアドレス</label>
                <input type="text" placeholder="メールアドレスを入力してください" />
            </div>

            <div className={styles.form__item}>
                <label htmlFor="">パスワード</label>
                <input type="text" placeholder="パスワードを入力してください" />
            </div>

            <button className={styles.form__btn}>新規登録</button>
        </div>
    );
};

export default SignUp;