import Link from "next/link";
import type { Property } from "@/types";
import styles from "./styles/PropertyList.module.css";
import PropertyCard from "./PropertyCard";

export default function PropertyList({
  properties,
}: {
  properties: Property[];
}) {
  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Latest properties</h2>
      <ul className={styles.list}>
        {properties.map((p) => (
          <li key={p.id}>
            <PropertyCard property={p} />
          </li>
        ))}
      </ul>
      <Link className={styles.seeAll} href="/properties">
        See all properties
      </Link>
    </div>
  );
}
