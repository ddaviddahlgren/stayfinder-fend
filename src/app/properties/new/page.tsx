"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import type { NewProperty, Property } from "@/types";
import styles from "@/components/styles/PropertyForm.module.css";

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
    <div className={styles.page}>
      <h1 className={styles.title}>New property</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label>
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          {fieldErrors.title && (
            <p role="alert" className={styles.error}>
              {fieldErrors.title}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          {fieldErrors.description && (
            <p role="alert" className={styles.error}>
              {fieldErrors.description}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label>
            Location
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </label>
          {fieldErrors.location && (
            <p role="alert" className={styles.error}>
              {fieldErrors.location}
            </p>
          )}
        </div>

        <div className={styles.field}>
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
          {fieldErrors.price_per_night && (
            <p role="alert" className={styles.error}>
              {fieldErrors.price_per_night}
            </p>
          )}
        </div>

        <div className={styles.field}>
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
          {fieldErrors.max_guests && (
            <p role="alert" className={styles.error}>
              {fieldErrors.max_guests}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label>
            Image URL (optional)
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </label>
          {fieldErrors.image_url && (
            <p role="alert" className={styles.error}>
              {fieldErrors.image_url}
            </p>
          )}
        </div>

        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}

        <button type="submit" className={styles.button} disabled={submitting}>
          {submitting ? "Creating..." : "Create property"}
        </button>
      </form>
    </div>
  );
}