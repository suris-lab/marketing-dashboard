"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import type { Tab } from "./Sidebar";
import { DateRangePicker } from "./DateRangePicker";

const TITLES: Record<Tab, string> = {
  overview: "Overview",
  meta: "Meta — Facebook & Instagram",
  linkedin: "LinkedIn",
  edm: "EDM / Email Campaigns",
  website: "Website Analytics",
  assets: "Digital Assets",
};

interface HeaderProps {
  tab: Tab;
  start: string;
  end: string;
  onDateChange: (start: string, end: string) => void;
}

export function Header({ tab, start, end, onDateChange }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="flex flex-col gap-3 border-b border-gray-800 bg-gray-900 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6 md:py-4">
      <h1 className="text-base font-semibold text-white">{TITLES[tab]}</h1>

      <div className="flex items-center gap-3 flex-wrap">
        {tab !== "assets" && (
          <DateRangePicker start={start} end={end} onChange={onDateChange} />
        )}

        {session?.user && (
          <div className="flex items-center gap-2 ml-auto md:ml-0">
            {session.user.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name ?? ""}
                className="h-7 w-7 rounded-full"
              />
            )}
            <span className="hidden text-xs text-gray-400 sm:block">
              {session.user.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-800 hover:text-white transition-colors"
              title="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
