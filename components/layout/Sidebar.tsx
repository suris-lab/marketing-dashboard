"use client";

import { LayoutDashboard, Facebook, Linkedin, Mail, Globe, Briefcase } from "lucide-react";

export type Tab = "overview" | "meta" | "linkedin" | "edm" | "website" | "assets";

const NAV: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
  { id: "meta",     label: "Meta",     icon: <Facebook size={18} /> },
  { id: "linkedin", label: "LinkedIn", icon: <Linkedin size={18} /> },
  { id: "edm",      label: "EDM",      icon: <Mail size={18} /> },
  { id: "website",  label: "Website",  icon: <Globe size={18} /> },
  { id: "assets",   label: "Assets",   icon: <Briefcase size={18} /> },
];

interface SidebarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex h-full w-56 shrink-0 flex-col border-r border-gray-800 bg-gray-900 px-3 py-6">
        <div className="mb-8 px-2">
          <span className="text-sm font-bold tracking-widest text-blue-400 uppercase">HHYC</span>
          <p className="text-[10px] text-gray-500 mt-0.5">Marketing Dashboard</p>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active === item.id
                  ? "bg-blue-600/20 text-blue-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t border-gray-800 bg-gray-900">
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
              active === item.id ? "text-blue-400" : "text-gray-500"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
}
