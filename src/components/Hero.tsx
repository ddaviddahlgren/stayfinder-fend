import Link from "next/link";

import styles from "./styles/hero.module.css"

export default function Hero() {
  return (
    <div className={styles.hero}>
      <h1>
        Welcome to <Link href="/">StayFinder</Link>
      </h1>
      <p>Find and book your next stay.</p>
    </div>
  );
}
