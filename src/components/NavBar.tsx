"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function NavBar() {
    const { user, loading, logout } = useAuth()
    const router = useRouter()

    async function handleLogout() {
        await logout();
        router.push("/")
    }

    return (
        <nav>
            <Link href="/">STAYFINDER</Link>

            <div>
                <Link href="/properties">Properties</Link>

                {loading ? null : user ? (
                    <>
                    <Link href="properties/new">New Property</Link>
                    <span>{user.email}</span>
                    <button onClick={handleLogout}>Log out</button>
                    </>
                    ) : (
                        <>
                            <Link href="/login">Log in</Link>
                            <Link href="/register">Register</Link>
                        </>
                    )}
            </div>
        </nav>
    )
} 