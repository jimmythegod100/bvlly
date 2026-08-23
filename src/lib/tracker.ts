"use client"

import { useCallback, useSyncExternalStore } from "react"

export const STATUSES = [
  "not-started",
  "researching",
  "applied",
  "call-booked",
  "joined",
  "skipped",
] as const

export type Status = (typeof STATUSES)[number]

export const statusLabel: Record<Status, string> = {
  "not-started": "Not started",
  researching: "Researching",
  applied: "Applied",
  "call-booked": "Call booked",
  joined: "Joined",
  skipped: "Skipped",
}

const KEY = "modesto-brokerage-tracker-v1"
const EVENT = "modesto-tracker"

export type TrackerState = Record<string, Status>

function subscribe(onStoreChange: () => void) {
  const handler = () => onStoreChange()
  window.addEventListener("storage", handler)
  window.addEventListener(EVENT, handler)
  return () => {
    window.removeEventListener("storage", handler)
    window.removeEventListener(EVENT, handler)
  }
}

function getSnapshot() {
  return localStorage.getItem(KEY) ?? "{}"
}

function getServerSnapshot() {
  return "{}"
}

export function useTracker() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  let tracker: TrackerState = {}
  try {
    tracker = JSON.parse(raw) as TrackerState
  } catch {
    tracker = {}
  }

  const setStatus = useCallback((id: string, status: Status) => {
    const current = JSON.parse(localStorage.getItem(KEY) ?? "{}") as TrackerState
    const next = { ...current, [id]: status }
    localStorage.setItem(KEY, JSON.stringify(next))
    window.dispatchEvent(new Event(EVENT))
  }, [])

  return { tracker, setStatus }
}
