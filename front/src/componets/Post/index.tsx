import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import Link from "next/link";

const Post = ({ username, author, createdAt, content }: any) => {
    return (
        <div className={styles.post}>
            <p>{username}</p>
            <p>{new Date(createdAt).toLocaleString()}</p>
            <p>{content}</p>
        </div>
    );
};

export default Post;