import type { Campaign } from "@/lib/types";

interface Props {
  campaigns: Campaign[];
}

export function EdmTable({ campaigns }: Props) {
  if (campaigns.length === 0) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-8 text-center text-sm text-gray-500">
        No campaigns in this date range.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800">
      <table className="w-full text-sm">
        <thead className="bg-gray-900 text-xs uppercase tracking-wider text-gray-400">
          <tr>
            <th className="px-4 py-3 text-left">Subject</th>
            <th className="px-4 py-3 text-left">Sent</th>
            <th className="px-4 py-3 text-right">Sent#</th>
            <th className="px-4 py-3 text-right">Opens</th>
            <th className="px-4 py-3 text-right">Open %</th>
            <th className="px-4 py-3 text-right">Clicks</th>
            <th className="px-4 py-3 text-right">CTR</th>
            <th className="px-4 py-3 text-right">CTOR</th>
            <th className="px-4 py-3 text-right">Unsubs</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800 bg-gray-950">
          {[...campaigns]
            .sort((a, b) => b.send_time.localeCompare(a.send_time))
            .map((c) => (
              <tr key={c.id} className="hover:bg-gray-900/60">
                <td className="max-w-[200px] truncate px-4 py-3 text-white" title={c.subject}>
                  {c.subject}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-400">
                  {c.send_time.slice(0, 10)}
                </td>
                <td className="px-4 py-3 text-right text-gray-300">{c.emails_sent.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-gray-300">{c.unique_opens.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-medium text-blue-400">{c.open_rate}%</td>
                <td className="px-4 py-3 text-right text-gray-300">{c.unique_clicks.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-medium text-emerald-400">{c.click_rate}%</td>
                <td className="px-4 py-3 text-right font-medium text-amber-400">{c.ctor}%</td>
                <td className="px-4 py-3 text-right text-gray-400">{c.unsubscribes}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
