"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import type { Property } from "@/types";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Property[]>("/properties")
      .then(setProperties)
      .catch((error) =>
        setError(
          error instanceof ApiError ? error.message : "Failed to load properties",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading properties...</p>
  if(error) return <p role="alert">{error}</p>
  if(properties.length === 0) return <p>No properties found</p>

  return (
    <div>
        <h1>Properties</h1>
        <ul>
            {properties.map((p) => (
                <li key={p.id}>
                    <h2>
                        <Link href={`/properties/${p.id}`}>{p.title}</Link>
                    </h2>
                    <p>{p.location}</p>
                    <p>{p.price_per_night} SEK per night. Comfortable if no more than {p.max_guests} guests.</p>
                </li>
            ))}
        </ul>
    </div>
  )

}
