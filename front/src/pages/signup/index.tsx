import Footer from '@/componets/Footer';
import Header from '@/componets/Header';
import SignUp from '@/componets/SignUp';
import React from 'react'
import styles from './stlye.module.scss'

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