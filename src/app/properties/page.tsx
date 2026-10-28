"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { Property, PropertySort } from "@/types";
import PropertyList from "@/components/PropertyList";
import PropertyFilterForm from "@/components/PropertyFilterForm";
import type { FilterValues } from "@/components/PropertyFilterForm";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterValues>({
    location: "",
    maxPrice: "",
    guests: "",
    sort: "",
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.location.trim())
      params.set("location", filters.location.trim());
    if (filters.maxPrice) params.set("max_price", filters.maxPrice);
    if (filters.guests) params.set("guests", filters.guests);
    if (filters.sort) params.set("sort", filters.sort);
    const query = params.toString();

    setLoading(true);
    setError(null);
    api<Property[]>(`/properties${query ? `?${query}` : ""}`)
      .then(setProperties)
      .catch((error) =>
        setError(
          error instanceof ApiError
            ? error.message
            : "Failed to load properties",
        ),
      )
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div>
      <h1>Properties</h1>

      <PropertyFilterForm filters={filters} onChange={setFilters} />

      {loading && <p>Loading properties...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && properties.length === 0 && (
        <p>No properties found.</p>
      )}

      <PropertyList properties={properties} />
    </div>
  );
}
