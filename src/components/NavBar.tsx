"use client";

import styles from "./styles/NavBar.module.css";

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
          <p className={styles.logoLink}>STAYFINDER</p>
        </Link>
          <p>|</p>
        <Link className={styles.navLink} href="/properties">
          Properties
        </Link>

        {loading ? null : user ? (
          <>
            <Link className={styles.navLink} href="/properties/new">
              New Property
            </Link>
            <Link href="/me">{user.user_metadata?.full_name || user.email}</Link>
            <button onClick={handleLogout} className="logoutBtn">LOG OUT</button>
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
