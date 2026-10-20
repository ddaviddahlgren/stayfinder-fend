"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import type { Property, PropertySort } from "@/types";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [guests, setGuests] = useState("");
  const [sort, setSort] = useState<PropertySort | "">("");

  useEffect(() => {
    //förklara igen

    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    if (maxPrice) params.set("max_price", maxPrice);
    if (guests) params.set("guests", guests);
    if (sort) params.set("sort", sort);
    const query = params.toString();
    //
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
  }, [location, maxPrice, guests, sort]);

  return (
    <div>
      <h1>Properties</h1>

      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Location
          <input value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>

        <label>
          Max price per night
          <input
            type="number"
            min="1"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </label>

        <label>
          Guests
          <input
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />
        </label>

        <label>
          Sort by price
          <select value={sort} onChange={(e) => setSort(e.target.value as PropertySort | "")}>
            <option value="">Newest first</option>
            <option value="price_asc">Lowest first</option>
            <option value="price_desc">Highest first</option>
          </select>
        </label>
      </form>

      {loading && <p>Loading properties...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && properties.length === 0 && <p>No properties found.</p>}

      <ul>
        {properties.map((p) => (
          <li key={p.id}>
            <h2>
              <Link href={`/properties/${p.id}`}>{p.title}</Link>
            </h2>
            <p>{p.location}</p>
            <p>
              {p.price_per_night} SEK per night. Comfortable if no more than{" "}
              {p.max_guests} guests.
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
