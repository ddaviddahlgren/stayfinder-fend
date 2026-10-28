import Link from "next/link";
import type { Property } from "@/types";
import styles from "./styles/PropertyList.module.css";

export default function PropertyList({
  properties,
}: {
  properties: Property[];
}) {
  return (
    <div className={styles.pContainer}>
      <h2 className={styles.header}>Latest properties</h2>
      <ul className={styles.list}>
        {properties.map((p) => (
          <li key={p.id} className={styles.item}>
            <h3 className={styles.title}>
              <Link href={`/properties/${p.id}`}>{p.title}</Link>
            </h3>
            <p className={styles.location}>{p.location}</p>
            <p className={styles.price}>{p.price_per_night} SEK per night</p>
          </li>
        ))}
      </ul>
      <Link className={styles.seeAll} href="/properties">See all properties</Link>
    </div>
  );
}
