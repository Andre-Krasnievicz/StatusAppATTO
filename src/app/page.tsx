import {
  getPublicInstruments,
  getStatusSummary,
} from "@/server/services/instrument-service";
import { StatusSummaryCards } from "@/components/status/StatusSummaryCards";
import { InstrumentTable } from "@/components/status/InstrumentTable";
import { PublicStatusHeader } from "@/components/status/PublicStatusHeader";
import { NewInstrumentAdminButton } from "@/components/admin/instruments/NewInstrumentButton";
import { AdminNav } from "@/components/admin/AdminNav";
import { getSession } from "@/lib/session";

export default async function StatusPage() {
  const session = await getSession();
  const [instruments, summary] = await Promise.all([
    getPublicInstruments(),
    getStatusSummary(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-green-50">
      {!session ? <PublicStatusHeader /> : <AdminNav session={session} />}

      <main className="mx-auto w-full max-w-6xl grow space-y-6 px-4 py-8">
        {session ? <NewInstrumentAdminButton /> : null}
        <StatusSummaryCards summary={summary} />
        <InstrumentTable instruments={instruments} isAdmin={!!session} />
      </main>
    </div>
  );
}
