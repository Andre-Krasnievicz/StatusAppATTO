import { getSession } from "@/lib/session";
import { getInstrumentsStation } from "@/server/services/instrument-service";
import { PublicStatusHeader } from "@/components/status/PublicStatusHeader";
import { AdminNav } from "@/components/admin/AdminNav";
import { InstrumentsStationTable } from "@/components/admin/instruments/InstrumentsStationTable";

export default async function StationPage() {
  const session = await getSession();
  const instruments = await getInstrumentsStation();
  return (
    <div className="flex min-h-screen flex-col bg-green-50">
      {!session ? <PublicStatusHeader /> : <AdminNav session={session} />}

      <main className="mx-auto w-full max-w-6xl grow space-y-6 px-4 py-8">
        <InstrumentsStationTable
          instruments={instruments}
          isAdmin={!!session}
        />
      </main>
    </div>
  );
}
