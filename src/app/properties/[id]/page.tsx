"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import type { Booking, Property } from "@/types";
import BookingForm from "@/components/BookingForm";
import BookingList from "@/components/BookingList";
import PropertyActions from "@/components/PropertyActions";
import styles from "@/components/styles/PropertyDetailsCard.module.css";

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const loadBookings = useCallback(() => {
    if (!user) {
      setBookings([]);
      return;
    }
    api<Booking[]>(`/properties/${id}/bookings`)
      .then(setBookings)
      .catch(() => setBookings([]));
  }, [id, user]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

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
  }, [id]);

  if (loading) return <p className="loading">Loading property...</p>;

  if (error && (error.status === 400 || error.status === 404)) {
    return (
      <div>
        <h1>Property not found</h1>
        <p>This property does not exist or has been removed.</p>
        <Link href="/properties">Back to properties</Link>
      </div>
    );
  }

  if (error) return <p role="alert">{error.message}</p>;
  if (!property) return null;

  return (
    <>
      <h1 className={styles.h1}>{property.title}</h1>
      <div className={styles.card}>
        <p>Location: {property.location}</p>
        <p>{property.description}</p>
        <p>{property.price_per_night} SEK per night.</p>
        {property.max_guests < 2 ? (
          <p>Comfortable when {property.max_guests} guest</p>
        ) : (
          <p>Comfortable when less than {property.max_guests} guests</p>
        )}
      </div>

      <PropertyActions property={property} />

      {user?.id !== property.owner_id && (
        <BookingForm property={property} onBooked={loadBookings} />
      )}

      {user && (
        <BookingList
          propertyId={property.id}
          propertyTitle={property.title}
          ownerId={property.owner_id}
          currentUserId={user.id}
          bookings={bookings}
          onChanged={loadBookings}
        />
      )}
    </>
  );
}
