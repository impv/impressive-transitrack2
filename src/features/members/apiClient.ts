// src/features/members/apiClient.ts
/** TODO: 後で作成する */
// import type { Member } from "@/types/member";

export const fetchMembers = async () => {
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

export const updateMember = async (params: { id: string; name: string; email: string; isAdmin: boolean }) => {
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
