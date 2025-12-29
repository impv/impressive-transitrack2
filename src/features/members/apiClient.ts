import type { Member } from "@/types/member";

export const fetchMembers = async (): Promise<Member[]> => {
  const res = await fetch("/api/members", { method: "GET" });

  if (!res.ok) {
    throw new Error("メンバー取得に失敗しました");
  }

  return res.json();
};

export const removeMember = async (id: string) => {
  const res = await fetch(`/api/members/${id}`, { method: "DELETE" });

  if (!res.ok) {
    throw new Error("メンバー削除に失敗しました");
  }

  return res.json();
};

export const updateMember = async (
  params: Pick<Member, "id" | "name" | "email" | "isAdmin">
): Promise<Member> => {
  const { id, name, email, isAdmin } = params;

  const res = await fetch(`/api/members/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, isAdmin }),
  });

  if (!res.ok) {
    throw new Error("メンバー更新に失敗しました");
  }

  return res.json();
};
