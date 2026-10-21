"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import type { NewProperty, Property } from "@/types";

export default function NewPropertyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSubmitting(true);

    const body: NewProperty = {
      title,
      description,
      location,
      price_per_night: Number(pricePerNight),
      max_guests: Number(maxGuests),
      image_url: imageUrl.trim() ? imageUrl.trim() : null,
    };

    try {
      const created = await api<Property>("/properties", {
        method: "POST",
        body: JSON.stringify(body),
      });
      router.push(`/properties/${created.id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
        const map: Record<string, string> = {};
        for (const issue of error.issues ?? []) {
          const field = String(issue.path[0] ?? "");
          if (field && !map[field]) map[field] = issue.message;
        }
        setFieldErrors(map);
      } else {
        setError("Could not create property");
      }
      setSubmitting(false);
    }
  }

  if (loading || !user) return null;

  return (
    <div>
      <h1>New property</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        {fieldErrors && <p role="alert">{fieldErrors.title}</p>}

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        {fieldErrors && <p role="alert">{fieldErrors.description}</p>}

        <label>
          Location
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </label>
        {fieldErrors && <p role="alert">{fieldErrors.location}</p>}

        <label>
          Price per night
          <input
            type="number"
            min="1"
            step="1"
            value={pricePerNight}
            onChange={(e) => setPricePerNight(e.target.value)}
            required
          />
        </label>
        {fieldErrors && <p role="alert">{fieldErrors.price_per_night}</p>}

        <label>
          Max guests
          <input
            type="number"
            min="1"
            step="1"
            value={maxGuests}
            onChange={(e) => setMaxGuests(e.target.value)}
            required
          />
        </label>
        {fieldErrors.max_guests && <p role="alert">{fieldErrors.max_guests}</p>}

        <label>
          Image URL (optional)
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </label>
        {fieldErrors.image_url && <p role="alert">{fieldErrors.image_url}</p>}

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create property"}
        </button>
      </form>
    </div>
  );
}
