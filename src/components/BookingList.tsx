"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { Booking } from "@/types";
import styles from "@/components/styles/BookingList.module.css";

export default function BookingList({
  propertyId,
  propertyTitle,
  ownerId,
  currentUserId,
  bookings,
  onChanged,
}: {
  propertyId: string;
  propertyTitle: string;
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

  async function changeStatus(b: Booking, status: "confirmed" | "cancelled") {
    if (status === "cancelled") {
      const message =
        b.user_id === currentUserId
          ? `Are you sure you want to cancel your booking for ${propertyTitle}?`
          : `Are you sure you want to cancel ${b.guest_name}'s booking for ${propertyTitle}?`;
      if (!window.confirm(message)) return;
    }

    setError(null);
    try {
      await api(`/properties/${propertyId}/bookings/${b.id}`, {
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

  async function remove(b: Booking) {
    if (
      !window.confirm(
        `Are you sure you want to delete your booking for ${propertyTitle}, ${b.check_in} to ${b.check_out}?`,
      )
    )
      setError(null);
    try {
      await api(`/properties/${propertyId}/bookings/${b.id}`, {
        method: "DELETE",
      });
      onChanged();
    } catch (error) {
      setError(
        error instanceof ApiError ? error.message : "Could not delete booking",
      );
    }
  }

  if (bookings.length === 0)
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        No bookings to show.
      </p>
    );

  return (
    <div className={styles.myBookings}>
      <h2 className={styles.h2}>
        {isOwner ? "Bookings for this property" : "Your bookings"}
      </h2>
      {error && <p role="alert">{error}</p>}
      <ul className={styles.list}>
        {bookings.map((b) => (
          <li key={b.id} className={styles.item}>
            <strong>Full Name:</strong>
            <p className={styles.details}>{b.guest_name}</p>

            <strong>Email:</strong>
            <p className={styles.details}>{b.guest_email}</p>

            <strong>Dates booked:</strong>

            {editingId === b.id ? (
              <>
                <div className={styles.editContainer}>
                  <label className={styles.label}>Check-in: </label>
                  <input
                    className={styles.dateInput}
                    type="date"
                    value={editCheckIn}
                    onChange={(e) => setEditCheckIn(e.target.value)}
                  />
                </div>
                <div className={styles.editContainer}>
                  <label className={styles.label}>Check-out: </label>
                  <input
                    className={styles.dateInput}
                    type="date"
                    value={editCheckOut}
                    onChange={(e) => setEditCheckOut(e.target.value)}
                  />
                </div>
                <div className={styles.editContainer}>
                  <label
                    className={styles.label}
                    style={{ marginTop: "0.4rem" }}
                  >
                    <strong>Guests: </strong>
                  </label>
                  <input
                    className={styles.dateInput}
                    type="number"
                    min="1"
                    value={editGuests}
                    onChange={(e) => setEditGuests(e.target.value)}
                  />
                </div>
                <button
                  className={styles.button}
                  onClick={() => saveEdit(b.id)}
                >
                  Save
                </button>
                <button
                  className={styles.button}
                  onClick={() => setEditingId(null)}
                >
                  Cancel Edit
                </button>
              </>
            ) : (
              <div
                style={{
                  borderBottom: "1px solid black",
                  paddingBottom: "0.6rem",
                }}
              >
                <p className={styles.details}>
                  {b.check_in} to {b.check_out}
                </p>
                <p>
                  Total price: <strong>{b.total_price} SEK</strong>. Status:{" "}
                  {b.status}
                </p>
              </div>
            )}
            {!b && (
              <p style={{ marginBottom: "0.3rem", fontWeight: "bold" }}>
                Booking options
              </p>
            )}
            <div className={styles.optBtns}>
              {isOwner && b.status === "pending" && (
                <button
                  className={styles.button}
                  onClick={() => changeStatus(b, "confirmed")}
                >
                  Confirm booking
                </button>
              )}

              {b.status !== "cancelled" && (
                <button
                  className={styles.button}
                  onClick={() => changeStatus(b, "cancelled")}
                >
                  Cancel
                </button>
              )}

              {b.user_id === currentUserId &&
                b.status !== "cancelled" &&
                editingId !== b.id && (
                  <button
                    className={styles.button}
                    onClick={() => startEdit(b)}
                  >
                    Edit
                  </button>
                )}

              {b.user_id === currentUserId && (
                <button className={styles.button} onClick={() => remove(b)}>
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
