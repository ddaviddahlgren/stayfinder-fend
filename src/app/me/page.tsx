"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import type { BookingWithProperty, MyBookings } from "@/types";

function BookingRow({ b, showGuest }: { b: BookingWithProperty; showGuest: boolean }) {
  return (
    <li>
      <p>
        <Link href={`/properties/${b.property_id}`}>{b.properties.title}</Link>
        , {b.properties.location}
      </p>
      {showGuest && (
        <p>
          Guest: {b.guest_name} ({b.guest_email}), {b.guests} guests
        </p>
      )}
      <p>
        {b.check_in} to {b.check_out}, {b.total_price} SEK. Status: {b.status}
      </p>
    </li>
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
        setError(err instanceof ApiError ? err.message : "Could not load bookings"),
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
    <div>
      <h1>{user.user_metadata?.full_name || user.email}</h1>

      <h2>Bookings on my properties</h2>
      {data.received.length === 0 ? (
        <p>No one has booked your properties yet.</p>
      ) : (
        <ul>
          {data.received.map((b) => (
            <BookingRow key={b.id} b={b} showGuest />
          ))}
        </ul>
      )}

      <h2>Bookings I have made</h2>
      {data.made.length === 0 ? (
        <p>You have not booked anything yet.</p>
      ) : (
        <ul>
          {data.made.map((b) => (
            <BookingRow key={b.id} b={b} showGuest={false} />
          ))}
        </ul>
      )}
    </div>
  );
}