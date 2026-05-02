import Footer from '@/components/Footer';
import Header from '@/components/Header';
import SignUp from '@/components/SignUp';
import React from 'react'
import styles from './style.module.scss'

const signup = () => {
    return (
        <div>
            <Header />
            <main className={styles.container}>
                <SignUp />
            </main>
            <Footer />
        </div>
    )
};
export default signup;