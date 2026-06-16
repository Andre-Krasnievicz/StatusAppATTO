import { notFound } from "next/navigation";
import { getAdminInstrumentById } from "@/server/services/instrument-service";
import { UpdateStatusForm } from "@/components/admin/instruments/UpdateStatusForm";

export default async function UpdateStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const instrument = await getAdminInstrumentById(id);
  if (!instrument) notFound();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-lg font-semibold text-gray-900">
        Atualizar status: {instrument.name}
      </h1>
      <UpdateStatusForm
        instrumentId={instrument.id}
        currentStatus={instrument.currentStatus}
      />
    </div>
  );
}
