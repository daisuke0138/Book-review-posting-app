import React from 'react'
import styles from './style.module.scss';
import Link from "next/link";

const Header = () => {
    return (
        <header className={styles.header}>
            <h1>読書感想投稿アプリ</h1>
            <ul>
                <li>
                    <Link href={"/login"}>Login</Link>
                </li>
                <li>
                    <Link href={"/signup"}>登録</Link>
                </li>
            </ul>
        </header>
    );
};
export default Header;