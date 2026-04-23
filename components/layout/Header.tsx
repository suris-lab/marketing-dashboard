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
  return (
    <header className="flex flex-col gap-3 border-b border-gray-800 bg-gray-900 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6 md:py-4">
      <h1 className="text-base font-semibold text-white">{TITLES[tab]}</h1>
      {tab !== "assets" && (
        <DateRangePicker start={start} end={end} onChange={onDateChange} />
      )}
    </header>
  );
}
