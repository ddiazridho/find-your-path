"use client";
import { useEffect, useSyncExternalStore } from "react";
import { readSession, saveSession } from "./storage";
import type { QuizSession } from "./types";

type Snapshot = { session: QuizSession; warning: string };
let snapshot: Snapshot | null = null;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
const getSnapshot = () => snapshot;
const serverSnapshot = () => null;
function publish(next: Snapshot) { snapshot = next; listeners.forEach(listener => listener()); }
export function updateSession(session: QuizSession) {
  const saved = saveSession(session);
  const clearing = session.phase === "intro" && Object.keys(session.answers).length === 0;
  publish({ session, warning: saved ? "" : clearing
    ? "Data di browser belum berhasil dihapus. Hapus data situs melalui pengaturan browser sebelum meninggalkan perangkat bersama."
    : "Jawabanmu tetap tersimpan selama sesi ini. Penyimpanan perangkat tidak tersedia; jangan muat ulang halaman dulu, ya." });
}
export function useQuiz() {
  const value = useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
  useEffect(() => {
    publish(readSession());
  }, []);
  return value;
}
