"use client";

import Link from "next/link";
import { Button } from "./Button";
import { useUser } from "@/app/hooks/useUser";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase";

export function Navbar() {
  const user = useUser();

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all 
        duration-300 border-b bg-white border-transparent`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2.5">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div
                className={`relative overflow-hidden rounded-full border-2 transition-all duration-300  
                  h-12 w-12 border-primary/10`}
              >
                {/* Logo Image logic if any */}
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-black tracking-tighter 
                    text-foreground transition-all 
                    duration-300 text-2xl invisible`}
                >
                  EMF
                </span>
                <span
                  className={`font-bold tracking-widest uppercase 
                    text-black -mt-1 transition-all duration-300
                     text-[0.6rem] invisible`}
                >
                  Egypt Mathematical Foundation
                </span>
              </div>
            </Link>
          </div>

          {/* Action Button Section */}
          <div className="flex items-center gap-8">
            {user ? (
              <Button
                onClick={async () => {
                  await signOut(auth);
                }}
                variant="outline"
                size={"md"}
                className={`w-full justify-center`}
              >
                sign out
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
