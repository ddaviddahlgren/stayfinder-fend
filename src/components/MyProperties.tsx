"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import type { Property } from "@/types";
import styles from "./styles/MyProperties.module.css";
import PropertyCard from "./PropertyCard";

export default function MyProperties({ userId }: { userId: string }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Property[]>("/properties")
      .then((all) => setProperties(all.filter((p) => p.owner_id === userId)))
      .catch((error) =>
        setError(
          error instanceof ApiError
            ? error.message
            : "Could not load properties",
        ),
      )
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div>
      <h2 style={{ textAlign: "center", margin: "1rem auto" }}>
        My properties
      </h2>
      {loading && (
        <p style={{ textAlign: "center" }}>Loading your properties</p>
      )}
      {error && (
        <p role="alert" style={{ textAlign: "center" }}>
          {error}
        </p>
      )}
      {!loading && !error && properties.length === 0 ? (
        <p style={{ textAlign: "center" }}>You have no listed properties.</p>
      ) : (
        <div className={styles.container}>
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
