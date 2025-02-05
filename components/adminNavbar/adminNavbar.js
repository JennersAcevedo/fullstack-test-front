'use client'
import { useState } from 'react';
import Link from 'next/link';
import styles from "@/styles/navbar.module.css";

export default function AdminNavBar ()  {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.hamburger} onClick={toggleMenu}>
        ☰
      </div>
      <ul className={`${styles.navItems} ${isOpen ? styles.active : ''}`}>
        <li className={styles.navItem}>
          <Link href="/">Home</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/login">Create User</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/login">login</Link>
        </li>
      </ul>
    </nav>
  );
};