import { prisma } from "@/lib/prisma";

export const upsertMemberByEmail = async (params: {
  email: string;
  name: string;
  isAdmin: boolean;
}) => {
  const { email, name, isAdmin } = params;

  return prisma.member.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
      isAdmin,
    },
  });
};
