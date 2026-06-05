import Link from "next/link";
import {
  getPublicInstruments,
  getStatusSummary,
} from "@/server/services/instrument-service";
import { StatusSummaryCards } from "@/components/status/StatusSummaryCards";
import { InstrumentTable } from "@/components/status/InstrumentTable";
import { formatDateTime } from "@/lib/dates";

export const revalidate = 60;

export default async function StatusPage() {
  const [instruments, summary] = await Promise.all([
    getPublicInstruments(),
    getStatusSummary(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-green-50">
      <header className="border-b border-green-800 bg-green-800">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-white">
                ATTO - Status dos Instrumentos
              </h1>
              <p className="text-sm text-green-300">
                Amazon Tall Tower Observatory
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p className="text-xs text-green-400">
                Atualizado em {formatDateTime(new Date())}
              </p>
              <Link
                href="/admin/login"
                className="flex items-center gap-1 text-xs text-green-500/60 hover:text-green-300 transition-colors"
              >
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-3 w-3"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v4A1.5 1.5 0 0 0 4.5 14h7a1.5 1.5 0 0 0 1.5-1.5v-4A1.5 1.5 0 0 0 11 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z"
                    clipRule="evenodd"
                  />
                </svg>
                Acesso admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl grow space-y-6 px-4 py-8">
        <StatusSummaryCards summary={summary} />
        <InstrumentTable instruments={instruments} />
      </main>
    </div>
  );
}
