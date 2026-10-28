"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import type { Booking, NewBooking, Property } from "@/types";
import styles from "@/components/styles/BookingForm.module.css";

const MS_PER_DAY = 86_400_000;

function countNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(diff / MS_PER_DAY));
}

export default function BookingForm({
  property,
  onBooked,
}: {
  property: Property;
  onBooked: (booking: Booking) => void;
}) {
  const { user, loading } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const nights = countNights(checkIn, checkOut);
  const totalPrice = nights * property.price_per_night;

  if (loading) return null;
  if (!user) {
    return (
      <p className={styles.loginPrompt}>
        <Link href="/login">Log in</Link> to book this property.
      </p>
    );
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSubmitting(true);

    const body: NewBooking = {
      guest_name: `${firstName.trim()} ${lastName.trim()}`,
      guest_email: email,
      check_in: checkIn,
      check_out: checkOut,
      guests: Number(guests),
    };

    try {
      const booking = await api<Booking>(
        `/properties/${property.id}/bookings`,
        {
          method: "POST",
          body: JSON.stringify(body),
        },
      );
      onBooked(booking);
      setFirstName("");
      setLastName("");
      setEmail("");
      setCheckIn("");
      setCheckOut("");
      setGuests("1");
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
        setError("Could not create booking");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Book this property</h2>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>
            First name
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
        </div>
        <div className={styles.field}>
          <label>
            Last name
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
        </div>
      </div>
      {fieldErrors.guest_name && (
        <p role="alert" className={styles.error}>
          {fieldErrors.guest_name}
        </p>
      )}

      <div className={styles.field}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {fieldErrors.guest_email && (
          <p role="alert" className={styles.error}>
            {fieldErrors.guest_email}
          </p>
        )}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>
            Check-in
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
            />
          </label>
          {fieldErrors.check_in && (
            <p role="alert" className={styles.error}>
              {fieldErrors.check_in}
            </p>
          )}
        </div>
        <div className={styles.field}>
          <label>
            Check-out
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
            />
          </label>
          {fieldErrors.check_out && (
            <p role="alert" className={styles.error}>
              {fieldErrors.check_out}
            </p>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label>
          Guests
          <input
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            required
          />
        </label>
        {fieldErrors.guests && (
          <p role="alert" className={styles.error}>
            {fieldErrors.guests}
          </p>
        )}
      </div>

      {nights > 0 && (
        <p className={styles.summary}>
          {nights} {nights === 1 ? "night" : "nights"} x{" "}
          {property.price_per_night} SEK = <strong>{totalPrice} SEK</strong>
        </p>
      )}

      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      <button type="submit" className={styles.button} disabled={submitting}>
        {submitting ? "Booking..." : "Book"}
      </button>
    </form>
  );
}
