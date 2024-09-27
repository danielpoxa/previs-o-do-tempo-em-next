// app/components/header/Header.js
'use client';

import React from 'react';
import styles from './header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <nav className={styles.navbar}>
                <a href="#header" className={styles.navItem}>Home</a>
                <a href="#about" className={styles.navItem}>Sobre</a>
                <a href="#contact" className={styles.navItem}>Contato</a>
            </nav>
        </header>
    );
}
