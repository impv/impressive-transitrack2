import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { Card } from "@/components/elements/Card";
import { ScrollToTopButton } from "@/components/elements/ScrollToTopButton";
import { Toast } from "@/components/elements/Toast";
import { ExpensesList } from "@/features/expenses/components/ExpensesList";
import { useToast } from "@/hooks/useToast";
import type { SubmitAction } from "@/types/expenses";

const ExpensesPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { data: session, status } = useSession();
  const router = useRouter();
  const initialMonth = typeof router.query.month === "string" ? router.query.month : undefined;
  const initialMemberId =
    typeof router.query.memberId === "string" ? router.query.memberId : undefined;
  const initialMemberName =
    typeof router.query.memberName === "string" ? router.query.memberName : undefined;
  const { toastMessage, showToast } = useToast();

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/auth/login");
    }
  }, [session, status, router]);

  const handleSuccess = useCallback(
    (action: SubmitAction) => {
      setRefreshTrigger((v) => v + 1);
      showToast(action === "save" ? "申請を更新しました" : "申請を削除しました");
    },
    [showToast],
  );

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">リダイレクト中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full px-4 py-3 text-xl font-medium shadow-lg bg-white hover:bg-gray-100"
            aria-label="ダッシュボードに戻る"
          >
            <IoArrowBack size={20} />
          </Link>
        </div>

        <Card className="mt-4">
          <ExpensesList
            refreshTrigger={refreshTrigger}
            onSuccess={handleSuccess}
            initialYearMonth={initialMonth}
            memberId={initialMemberId}
            memberName={initialMemberName}
          />
        </Card>

        {toastMessage && <Toast toastMessage={toastMessage} />}
        <ScrollToTopButton />
      </div>
    </div>
  );
};

export default ExpensesPage;
