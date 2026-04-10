"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db, realtimeDb } from "@/app/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

/**
 * Returns true if the student's session status is "blocked".
 * The proctor sets status = "blocked" in Realtime DB.
 */
export function useIsBlocked(competitionId: string, uid: string | undefined) {
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (!uid || !competitionId) return;
    const unsub = onSnapshot(
      query(
        collection(db, "blockedStudents"),
        where("competitionId", "==", competitionId),
        where("studentUid", "==", uid),
      ),
      (snapshot) => {
        console.log("here");

        if (snapshot.empty) {
          setIsBlocked(false);
        } else {
          setIsBlocked(true);
        }
      },
    );
    return () => {
      unsub();
    };
  }, [competitionId, uid]);

  return isBlocked;
}
