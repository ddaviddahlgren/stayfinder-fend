"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ApiError, api } from "@/lib/api";
import type { NewProperty, Property } from "@/types";

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    api<Property>(`/properties/${id}`)
      .then((p) => {
        setTitle(p.title);
        setDescription(p.description);
        setLocation(p.location);
        setPricePerNight(String(p.price_per_night));
        setMaxGuests(String(p.max_guests));
        setImageUrl(p.image_url ?? "");
      })
      .catch((err) => {
        if (
          err instanceof ApiError &&
          (err.status === 404 || err.status === 400)
        ) {
          setNotFound(true);
        } else {
          setError(
            err instanceof ApiError ? err.message : "Could not load property",
          );
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

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
      image_url: imageUrl.trim() || null,
    };

    try {
      await api<Property>(`/properties/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      router.push(`/properties/${id}`);
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
        setError("Could not update property");
      }
      setSubmitting(false);
    }
  }

  if (authLoading || loading || !user) return null;
  if (notFound) return <p>Property not found.</p>;

  return (
    <div>
      <h1>Edit property</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        {fieldErrors.title && <p role="alert">{fieldErrors.title}</p>}

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        {fieldErrors.description && (
          <p role="alert">{fieldErrors.description}</p>
        )}

        <label>
          Location
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </label>
        {fieldErrors.location && <p role="alert">{fieldErrors.location}</p>}

        <label>
          Price per night (SEK)
          <input
            type="number"
            min="1"
            step="1"
            value={pricePerNight}
            onChange={(e) => setPricePerNight(e.target.value)}
            required
          />
        </label>
        {fieldErrors.price_per_night && (
          <p role="alert">{fieldErrors.price_per_night}</p>
        )}

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
          {submitting ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
