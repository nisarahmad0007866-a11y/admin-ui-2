import { useEffect, useState } from "react";
import { store } from "@/lib/store";

// Re-render on store changes within the same tab + cross-tab.
export function useStoreVersion() {
  const [v, setV] = useState(0);
  useEffect(() => {
    const bump = () => setV(x => x + 1);
    window.addEventListener("bmh:store", bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener("bmh:store", bump);
      window.removeEventListener("storage", bump);
    };
  }, []);
  return v;
}

export function useHalls() {
  useStoreVersion();
  return store.getHalls();
}
export function useBookings() {
  useStoreVersion();
  return store.getBookings();
}
