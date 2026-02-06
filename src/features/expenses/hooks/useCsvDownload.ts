import { useEffect, useRef } from "react";
import type { ExpenseRecord } from "@/types/expenses";

type MemberSummary = {
  name: string;
  email: string;
  totalAmount: number;
};

type UserInfo = {
  name?: string | null;
  email?: string | null;
  isAdmin?: boolean;
};

export const useCsvDownload = () => {
  const csvLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    csvLinkRef.current = document.createElement("a");
    document.body.appendChild(csvLinkRef.current);

    return () => {
      if (csvLinkRef.current) {
        document.body.removeChild(csvLinkRef.current);
        csvLinkRef.current = null;
      }
    };
  }, []);

  const generateCsvData = (
    expenses: ExpenseRecord[],
    user: UserInfo,
  ): string => {
    const headers = ["名前", "メールアドレス", "合計金額"];

    if (user.isAdmin) {
      // 管理者用: メンバーごとの集計CSV
      const memberSummary = expenses.reduce(
        (acc, expense) => {
          const key = expense.memberId;
          if (!acc[key]) {
            acc[key] = {
              name: expense.member?.name ?? "不明",
              email: expense.member?.email ?? "",
              totalAmount: 0,
            };
          }
          acc[key].totalAmount += expense.amount;
          return acc;
        },
        {} as Record<string, MemberSummary>,
      );

      const rows = Object.values(memberSummary).map((data) => [
        data.name,
        data.email,
        data.totalAmount.toString(),
      ]);
      return `\uFEFF${[headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")}`;
    }

    // 一般ユーザー用: 自分の集計CSV
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const row = [user.name ?? "", user.email ?? "", totalAmount.toString()];
    return `\uFEFF${[headers, row].map((r) => r.map((cell) => `"${cell}"`).join(",")).join("\n")}`;
  };

  const downloadCsv = (
    expenses: ExpenseRecord[],
    user: UserInfo,
    yearMonth: string,
  ) => {
    if (expenses.length === 0) {
      alert("ダウンロードするデータがありません");
      return;
    }

    const csvData = generateCsvData(expenses, user);

    if (csvLinkRef.current) {
      csvLinkRef.current.href = URL.createObjectURL(
        new Blob([csvData], { type: "text/csv" }),
      );
      csvLinkRef.current.download = `交通費_${yearMonth}.csv`;
      csvLinkRef.current.click();
    }
  };

  return { downloadCsv };
};
