import { removeMember } from "@/features/members/apiClient";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/auth/login");
    }
  }, [session, status, router]);

  const [members, setMembers] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/members");
        if (response.ok) {
          const data = await response.json();
          setMembers(data);
        } else {
          console.error("メンバーの取得に失敗しました");
        }
      } catch (error) {
        console.error("メンバーの取得中にエラーが発生しました", error);
      }
    };

    fetchMembers();
  }, []);

  const handleEditClick = (member: { id: string; name: string; email: string }) => {
    setEditingMemberId(member.id);
    setEditForm({ name: member.name, email: member.email });
  };

  const handleCancelEdit = () => {
    setEditingMemberId(null);
    setEditForm({ name: "", email: "" });
  };

  const handleSaveEdit = async (memberId: string) => {
    try {
      const response = await fetch(`/api/members/${memberId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        setMembers(members.map(m =>
          m.id === memberId ? { ...m, name: editForm.name, email: editForm.email } : m
        ));
        setEditingMemberId(null);
        setEditForm({ name: "", email: "" });
      } else {
        console.error("メンバーの更新に失敗しました");
      }
    } catch (error) {
      console.error("メンバーの更新中にエラーが発生しました", error);
    }
  };

  // 未ログイン時はリダイレクト中の表示
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
        {/* ヘッダー */}
        <div className="mb-6 rounded-2xl bg-white p-4 shadow-lg sm:mb-8 sm:p-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">TransiTrack 2</h1>
              <p className="mt-1 text-sm text-gray-600 sm:text-base">
                ようこそ、{session.user?.name}さん
              </p>
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md focus:outline-none sm:w-auto"
            >
              ログアウト
            </button>
          </div>
        </div>

        {/* ユーザー情報カード */}
        <div className="rounded-2xl bg-white p-4 shadow-lg sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">ユーザー情報</h2>
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
        </div>

        {/* メンバー一覧カード */}
        <div className="mt-6 rounded-2xl bg-white p-4 shadow-lg sm:mt-8 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">メンバー</h2>
          <ul className="text-sm text-gray-600 sm:text-base">
            {members.map((member) => (
              <li key={member.id} className="border-b border-gray-200 py-3 last:border-0">
                <div className="flex justify-between">
                  <p>
                    {member.name} ({member.email})
                  </p>
                  <div>
                    {/** TODO: 削除する場合に確認ダイアログを出す */}
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      className="mt-1 text-xs text-red-500 hover:underline"
                    >
                      削除
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditClick(member)}
                      className="mt-1 ml-4 text-xs text-blue-500 hover:underline"
                    >
                      編集
                    </button>
                  </div>
                </div>

                {/* 編集フォーム */}
                {editingMemberId === member.id && (
                  <div className="mt-3 rounded-lg bg-gray-50 p-4">
                    <div className="space-y-3">
                      <div>
                        <label htmlFor={`name-${member.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                          名前
                        </label>
                        <input
                          id={`name-${member.id}`}
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor={`email-${member.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                          メールアドレス
                        </label>
                        <input
                          id={`email-${member.id}`}
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(member.id)}
                          className="rounded bg-blue-500 px-4 py-2 text-xs font-medium text-white hover:bg-blue-600 focus:outline-none"
                        >
                          保存
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="rounded border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                        >
                          キャンセル
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* お知らせカード */}
        <div className="mt-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-4 shadow-lg sm:mt-6 sm:p-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <svg
              className="h-5 w-5 shrink-0 text-white sm:h-6 sm:w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Info icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-white sm:text-base">ログイン成功！</h3>
              <p className="mt-1 text-xs text-blue-100 sm:text-sm">
                交通費申請機能は今後実装予定です。もうしばらくお待ちください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
