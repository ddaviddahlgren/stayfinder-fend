"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import type { Property } from "@/types";

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    api<Property>(`/properties/${id}`)
      .then(setProperty)
      .catch((error) =>
        setError(
          error instanceof ApiError
            ? error
            : new ApiError(0, "Could not load property."),
        ),
      )
      .finally(() => setLoading(false));
  },[id]);

  if (loading) return <p>Loading property...</p>

  if (error && (error.status === 400 || error.status === 404)) {
    return (
        <div>
            <h1>Property not found</h1>
            <p>This property does not exist or has been removed.</p>
            <Link href="/properties">Back to properties</Link>
        </div>
    )
  }

  if (error) return <p role="alert">{error.message}</p>
  if (!property) return null

  return (
    <div>
        <h1>{property.title}</h1>
        <p>{property.location}</p>
        <p>{property.description}</p>
        <p>{property.price_per_night} SEK per night.</p>
        <p>Comfortable when less than {property.max_guests} guests</p>
    </div>
  )
}
