"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import type { BookingWithProperty, MyBookings } from "@/types";
import styles from "@/components/styles/MyBookings.module.css";

function BookingRow({
  b,
  showGuest,
}: {
  b: BookingWithProperty;
  showGuest: boolean;
}) {
  return (
    <Link href={`/properties/${b.property_id}`}>
      <div className={styles.summary}>
        <li>
          <p style={{ marginBottom: "7px" }}>
            {b.properties.title}, {b.properties.location}
          </p>
          {showGuest && (
            <p style={{ marginBottom: "7px" }}>
              Guest: {b.guest_name} ({b.guest_email})<br></br> {b.guests} guests
            </p>
          )}
          <p style={{ marginBottom: "7px" }}>
            {b.check_in} to {b.check_out}, {b.total_price} SEK. <br></br>Status:{" "}
            {b.status}
          </p>
        </li>
      </div>
    </Link>
  );
}

export default function MePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<MyBookings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  const load = useCallback(() => {
    api<MyBookings>("/me/bookings")
      .then(setData)
      .catch((err) =>
        setError(
          err instanceof ApiError ? err.message : "Could not load bookings",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  if (authLoading || !user) return null;
  if (loading) return <p className="loading">Loading your bookings...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!data) return null;

  return (
    <>
      <h1 style={{ textAlign: "center", margin: "2rem auto" }}>
        {user.user_metadata?.full_name || user.email}
      </h1>
      <div className={styles.allBookingsContainer}>
        <div className={styles.bookingsContainer}>
          <h2 style={{ textDecoration: "underline", padding: "0.5rem 0.8rem" }}>
            Bookings on my properties
          </h2>
          {data.received.length === 0 ? (
            <p>No one has booked your properties yet.</p>
          ) : (
            <ul className={styles.bookingRow}>
              {data.received.map((b) => (
                <BookingRow key={b.id} b={b} showGuest />
              ))}
            </ul>
          )}
        </div>

        <div className={styles.bookingsContainer}>
          <h2 style={{ textDecoration: "underline", padding: "0.5rem 0.8rem" }}>
            Bookings I have made
          </h2>
          {data.made.length === 0 ? (
            <p>You have not booked anything yet.</p>
          ) : (
            <ul className={styles.bookingRow}>
              {data.made.map((b) => (
                <BookingRow key={b.id} b={b} showGuest={false} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
