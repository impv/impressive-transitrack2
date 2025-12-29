// src/server/members/service.ts
import { deleteMemberById, getAllMembers, updateMemberById } from "@/server/members/repository";

export const listMembers = async () => {
  return getAllMembers();
};

export const removeMember = async (id: string) => {
  // 今回は「ログインしていれば誰でもOK」
  // 将来的には管理者のみ削除可能にするなどの制御を追加する
  return deleteMemberById(id);
};

export const updateMember = async (params: {
  id: string;
  name: string;
  email: string;
}) => {
  return updateMemberById(params);
};
