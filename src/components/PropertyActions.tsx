"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { api, ApiError } from "@/lib/api"
import type { Property } from "@/types"

export default function PropertyActions({ property}: { property: Property }) {
    const { user } = useAuth()
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)

    if (!user || user.id !== property.owner_id) return null

    async function handleDelete() {
        if (!window.confirm("Delete this property and all its bookings?")) return

        setError(null)
        setDeleting(true)
        try {
            await api(`/properties/${property.id}`, { method: "DELETE"})
            router.push("/properties")
        } catch (error) {
            setError(error instanceof ApiError ? error.message : "Could not delete property.")
            setDeleting(false)
        }
    }

    return (
        <div style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", gap:"1rem", margin:"1rem auto 0 auto"}}>
            <Link href={`/properties/${property.id}/edit`} >Edit</Link>
            <button onClick={handleDelete} disabled={deleting} className="logoutBtn">
                {deleting ? "Deleting..." : "Delete"}
            </button>
            {error && <p role="alert">{error}</p>}
        </div>
    )
} 