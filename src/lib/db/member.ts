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

export const checkIsAdmin = async (email: string) => {
  const member = await prisma.member.findUnique({
    where: { email },
  });
  return member?.isAdmin ?? false;
};
