import Link from "next/link";

export async function NewInstrumentAdminButton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/instruments/new"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          + Novo instrumento
        </Link>
      </div>
    </div>
  );
}
