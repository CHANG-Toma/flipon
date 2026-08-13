"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export function ClerkUserSync() {
  const { isSignedIn, isLoaded } = useAuth();

  // Synchronise l'utilisateur avec la base de données
  // Lorsque l'utilisateur est connecté et que le composant est monté
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    // Appelle l'API pour synchroniser l'utilisateur
    void fetch("/api/me", { method: "POST", credentials: "include" });
  }, [isLoaded, isSignedIn]);

  return null;
}
