import type { PropertySort } from "@/types";
import styles from "./styles/PropertyFilterForm.module.css";

export interface FilterValues {
  location: string;
  maxPrice: string;
  guests: string;
  sort: PropertySort | "";
}

export default function PropertyFilterForm({
  filters,
  onChange,
}: {
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
}) {
  function update<K extends keyof FilterValues>(
    key: K,
    value: FilterValues[K],
  ) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
      <label className={styles.label}>
        Location
        <input
          className={styles.input}
          value={filters.location}
          onChange={(e) => update("location", e.target.value)}
        />
      </label>

      <label>
        Max price per night
        <input
        className={styles.input}
          type="number"
          min="1"
          value={filters.maxPrice}
          onChange={(e) => update("maxPrice", e.target.value)}
        />
      </label>

      <label>
        Guests
        <input
        className={styles.input}
          type="number"
          min="1"
          value={filters.guests}
          onChange={(e) => update("guests", e.target.value)}
        />
      </label>

      <label>
        Sort by:
        <select
        className={styles.input}
          value={filters.sort}
          onChange={(e) => update("sort", e.target.value as PropertySort | "")}
        >
          <option value="">Newest first</option>
          <option value="price_asc">Lowest first</option>
          <option value="price_desc">Highest first</option>
        </select>
      </label>
    </form>
  );
}
