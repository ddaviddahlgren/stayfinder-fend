"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { Booking } from "@/types";

export default function BookingList({
  propertyId,
  ownerId,
  currentUserId,
  bookings,
  onChanged,
}: {
  propertyId: string;
  ownerId: string;
  currentUserId: string;
  bookings: Booking[];
  onChanged: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const isOwner = ownerId === currentUserId;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCheckIn, setEditCheckIn] = useState("");
  const [editCheckOut, setEditCheckOut] = useState("");
  const [editGuests, setEditGuests] = useState("");

  function startEdit(b: Booking) {
    setEditingId(b.id);
    setEditCheckIn(b.check_in);
    setEditCheckOut(b.check_out);
    setEditGuests(String(b.guests));
    setError(null);
  }

  async function saveEdit(id: string) {
    setError(null);
    try {
      await api(`/properties/${propertyId}/bookings/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          check_in: editCheckIn,
          check_out: editCheckOut,
          guests: Number(editGuests),
        }),
      });
      setEditingId(null);
      onChanged();
    } catch (error) {
      setError(
        error instanceof ApiError ? error.message : "Could not update booking",
      );
    }
  }

  async function changeStatus(id: string, status: "confirmed" | "cancelled") {
    setError(null);
    try {
      await api(`/properties/${propertyId}/bookings/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      onChanged();
    } catch (error) {
      setError(
        error instanceof ApiError ? error.message : "Could not update booking.",
      );
    }
  }

  async function remove(id: string) {
    setError(null);
    try {
      await api(`/properties/${propertyId}/bookings/${id}`, {
        method: "DELETE",
      });
      onChanged();
    } catch (error) {
      setError(
        error instanceof ApiError ? error.message : "Could not delete booking",
      );
    }
  }

  if (bookings.length === 0) return <p style={{textAlign:"center"}}>No bookings to show.</p>;

  return (
    <div>
      <h2>{isOwner ? "Bookings for this property" : "Your bookings"}</h2>
      {error && <p role="alert">{error}</p>}
      <ul>
        {bookings.map((b) => (
          <li key={b.id}>
            <p>
              {b.guest_name} ({b.guest_email}), {b.guests} guests.
            </p>
            {editingId === b.id ? (
              <div>
                <input
                  type="date"
                  value={editCheckIn}
                  onChange={(e) => setEditCheckIn(e.target.value)}
                />
                <input
                  type="date"
                  value={editCheckOut}
                  onChange={(e) => setEditCheckOut(e.target.value)}
                />
                <input
                  type="number"
                  min="1"
                  value={editGuests}
                  onChange={(e) => setEditGuests(e.target.value)}
                />
                <button onClick={() => saveEdit(b.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel edit</button>
              </div>
            ) : (
              <p>
                {b.check_in} to {b.check_out}, {b.total_price} SEK. Booking
                status: {b.status}
              </p>
            )}

            {isOwner && b.status === "pending" && (
              <button onClick={() => changeStatus(b.id, "confirmed")}>
                Confirm booking
              </button>
            )}

            {b.status !== "cancelled" && (
              <button onClick={() => changeStatus(b.id, "cancelled")}>
                Cancel booking
              </button>
            )}

            {b.user_id === currentUserId &&
              b.status !== "cancelled" &&
              editingId !== b.id && (
                <button onClick={() => startEdit(b)}>Edit booking</button>
              )}

            {b.user_id === currentUserId && (
              <button onClick={() => remove(b.id)}>Delete booking</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
