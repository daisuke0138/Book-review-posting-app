import React from "react";
import styles from "./style.module.scss";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <span>&copy;Nagamachi machikichi</span>
        </footer>
    );
};

export default Footer;