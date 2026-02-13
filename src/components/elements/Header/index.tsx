import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/elements/Button";

export const Header = () => {
  const { data: session } = useSession();
  return (
    <header className="mb-6 rounded-2xl bg-white p-4 shadow-lg sm:mb-8 sm:p-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">TransiTrack 2</h1>
          <p className="mt-1 text-sm text-gray-600 sm:text-base">
            ようこそ、{session?.user?.name}さん
          </p>
        </div>
        <nav>
          <ul className="flex items-center gap-2 text-sm">
            <li>
              <a href="#user">ユーザー情報</a>
            </li>
            |
            <li>
              <a href="#summary">交通費合計</a>
            </li>
            |
            <li>
              <a href="#list">交通費一覧</a>
            </li>
            |
            <li>
              <a href="#form">交通費申請</a>
            </li>
            |
            <li>
              <a href="#favorite">お気に入り経路</a>
            </li>
          </ul>
        </nav>
        <Button
          variant="secondary"
          size="md"
          onClick={() => signOut()}
          className="w-full px-4 sm:w-auto"
        >
          ログアウト
        </Button>
      </div>
    </header>
  );
};
