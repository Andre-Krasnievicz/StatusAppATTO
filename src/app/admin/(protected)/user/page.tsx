import Link from "next/link";
import { getAllUsers } from "@/server/services/user-service";
import { AiOutlineUserAdd } from "react-icons/ai";
import { HiPencil } from "react-icons/hi2";

interface User {
  id: number;
  name: string;
  email: string;
}

export default async function UsersPage() {
  const users = await getAllUsers();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Usuários</h1>
        <Link
          href="/admin/user/new"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          <AiOutlineUserAdd size={15} />
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-green-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-green-100 bg-green-50 text-left text-xs font-medium uppercase tracking-wide text-green-700">
              <th className="px-4 py-3">Nome</th>
              <th className="hidden px-4 py-3 sm:table-cell">Email</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-50">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-green-50/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="hidden px-4 py-3 text-gray-900 sm:table-cell">
                  {user.email}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/user/${user.id}/edit`}
                      className="flex h-8 w-8 items-center justify-center rounded-md bg-green-100 text-gray-500 transition hover:bg-green-200 hover:text-gray-900"
                    >
                      <HiPencil size={15} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
