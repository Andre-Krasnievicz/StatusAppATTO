import { notFound } from "next/navigation";
import EditUserForm from "@/components/admin/user/EditUserForm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dataUser = await auth.api.getUser({
    query: {
      id,
    },
    headers: await headers(),
  });

  if (!dataUser) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-lg font-semibold text-gray-900">
        Editar: {dataUser.name}
      </h1>
      <EditUserForm dataUser={dataUser} />
    </div>
  );
}
