/** 23日は削除apiのエンドポイントを完成させる index.tsxを参考にする */
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { removeMember, updateMember } from "@/server/members/service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 認証
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: "未認証です" });
  }

  if (!session.user.isAdmin) {
    return res.status(403).json({ message: "権限がありません" });
  }

  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ message: "不正なリクエストです" });
  }

  // HTTPメソッド判定
  if (req.method === "DELETE") {
    try {
      await removeMember(id);
      return res.status(200).json({ message: "メンバーを削除しました" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "サーバーエラー" });
    }
  } else if (req.method === "PUT") {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        return res.status(400).json({ message: "名前とメールアドレスは必須です" });
      }

      const updatedMember = await updateMember({ id, name, email });
      return res.status(200).json(updatedMember);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "サーバーエラー" });
    }
  } else {
    res.setHeader("Allow", ["DELETE", "PUT"]);
    return res.status(405).end();
  }
}
