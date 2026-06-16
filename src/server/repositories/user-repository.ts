import { prisma } from "@/lib/prisma";

export async function findAllUsers() {
  const data = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return data;
}
