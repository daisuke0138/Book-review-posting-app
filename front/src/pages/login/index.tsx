import Footer from '@/componets/Footer';
import Header from '@/componets/Header';
import Login from '@/componets/Login';
import React from 'react';
import styles from './stlye.module.scss';

const login = () => {
    return (
        <div>
            <Header />
            <main className={styles.container}>
                <Login />
            </main>
            <Footer />
        </div>
    )
};

export default login;