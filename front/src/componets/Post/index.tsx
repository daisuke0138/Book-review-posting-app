import React from 'react'
import styles from './style.module.scss';
import Link from 'next/link';

const Post = () => {
    return (
        <div className={styles.post}>
            <p>名前が入る予定</p>
            <p>日付が入る予定</p>
            <p>登録されたデータを表示</p>
        </div>
    );
};
export default Post;