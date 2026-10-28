"use client";

import styles from "./styles/nav-bar.module.css";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.navBar}>
        <Link className={styles.navLink} href="/">
          STAYFINDER
        </Link>
        <Link className={styles.navLink} href="/properties">
          Properties
        </Link>

        {loading ? null : user ? (
          <>
            <Link className={styles.navLink} href="/properties/new">
              New Property
            </Link>
            <span>{user.email}</span>
            <button onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link className={styles.navLink} href="/login">
              Log in
            </Link>
            <Link className={styles.navLink} href="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
