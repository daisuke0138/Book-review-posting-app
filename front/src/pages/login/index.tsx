import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Login from '@/components/Login';
import React from 'react';
import styles from './style.module.scss';

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