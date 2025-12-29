import { prisma } from "@/server/prisma";

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

export const getAllMembers = async () => {
  return prisma.member.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const deleteMemberById = async (id: string) => {
  return prisma.member.delete({
    where: { id },
  });
};

export const updateMemberById = async (params: {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}) => {
  const { id, name, email, isAdmin } = params;

  return prisma.member.update({
    where: { id },
    data: {
      name,
      email,
      isAdmin,
    },
  });
};
