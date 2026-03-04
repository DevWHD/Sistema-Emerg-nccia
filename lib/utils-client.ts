"use client";

import { useParams as useNextParams } from "next/navigation";

export function useParams<T extends Record<string, string | string[]>>(): T {
  return useNextParams() as T;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
