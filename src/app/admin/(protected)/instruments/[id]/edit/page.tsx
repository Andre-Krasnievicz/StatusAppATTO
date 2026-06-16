import { notFound } from "next/navigation";
import { getAdminInstrumentById } from "@/server/services/instrument-service";
import { EditInstrumentForm } from "@/components/admin/instruments/EditInstrumentForm";

export default async function EditInstrumentPage({
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
        Editar: {instrument.name}
      </h1>
      <EditInstrumentForm instrument={instrument} />
    </div>
  );
}
