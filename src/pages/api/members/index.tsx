// src/pages/api/members/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { listMembers } from "@/server/members/service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 認証
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: "未認証です" });
  }

  // HTTPメソッド判定
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end();
  }

  try {
    const members = await listMembers();
    return res.status(200).json(members);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "サーバーエラー" });
  }
}
