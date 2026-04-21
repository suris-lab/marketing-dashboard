interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  isMock?: boolean;
}

export function SectionHeader({ title, subtitle, isMock }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-gray-400">{subtitle}</p>}
      </div>
      {isMock && (
        <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-400">
          Sample data
        </span>
      )}
    </div>
  );
}
