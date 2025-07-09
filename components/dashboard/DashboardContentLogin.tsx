"use client";

import { useUser } from "@clerk/nextjs";
import { AddCryptoModal } from "./AddCryptoModal";
import ChatAI from "./ai/chat";

export function DashboardContentLogin() {
  const { user } = useUser();

  const displayName = user?.firstName || 
                      user?.fullName || 
                      user?.emailAddresses[0]?.emailAddress || 
                      "Usuario";

  return (
    <div className="container mx-auto pb-18">
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <h1 className="text-lg font-bold text-zinc-300 gap-2">
          <span className="text-2xl text-zinc-100 font-bold">{displayName}</span>{" "}
        </h1>
        <div className="flex gap-2 items-center">
          <ChatAI />
          <AddCryptoModal />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2"></div>
    </div>
  );
}
