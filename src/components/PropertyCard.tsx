import Link from "next/link";
import type { Property } from "@/types";
import styles from "./styles/PropertyCard.module.css";

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Link className={styles.card} href={`/properties/${property.id}`}>
      <h3 className={styles.title}>{property.title}</h3>
      <p className={styles.location}>{property.location}</p>
      <p className={styles.price}>{property.price_per_night} SEK per night</p>
    </Link>
  );
}
