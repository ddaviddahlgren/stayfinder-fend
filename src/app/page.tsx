"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import type { Property } from "@/types";
import Hero from "@/components/Hero";
import PropertyList from "@/components/PropertyList";

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Property[]>("/properties")
      .then((data) => setProperties(data.slice(0, 6)))
      .catch((error) =>
        setError(
          error instanceof ApiError
            ? error.message
            : "Could not load properties",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Hero />
      <div className="loading">
        {loading && <p>Loading properties...</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && !error && properties.length === 0 && (
          <p>No properties yet.</p>
        )}
      </div>

      <PropertyList properties={properties} />
    </>
  );
}
