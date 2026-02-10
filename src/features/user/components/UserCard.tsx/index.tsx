import { Card } from "@/components/elements/Card";
import { useSession } from "next-auth/react";

export const UserCard = () => {
  const { data: session } = useSession();

  if (!session) return null;
  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl" id="user">
        ユーザー情報
      </h2>
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <svg
            className="h-5 w-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>User icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-medium text-gray-500 sm:text-sm">名前</span>
            <p className="truncate text-sm text-gray-900 sm:text-base">
              {session.user?.name} {session.user?.isAdmin ? "(管理者)" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <svg
            className="h-5 w-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Email icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-medium text-gray-500 sm:text-sm">メール</span>
            <p className="truncate text-sm text-gray-900 sm:text-base">{session.user?.email}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
