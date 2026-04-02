//create a user context relying on firebase
"use client";
import { createContext, useEffect, useState } from "react";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "./index";
import { User } from "@october-math-community-circle/shared-utitilies/user";
import { useRouter } from "next/navigation";
import { signin } from "../server-actions/signin";
import { signout } from "../server-actions/signout";

export const UserContext = createContext<{ user: User | null }>({ user: null });

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const { claims, token } = await user.getIdTokenResult(true);
        await signin(token);
        setUser({ ...user, claims });
      } else {
        setUser(null);
        await signout();
        router.refresh();
        /* if (isProtectedRoute(pathname || window.location.pathname)) {
          console.log("refreshing");
          router.refresh();
        } */
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}
