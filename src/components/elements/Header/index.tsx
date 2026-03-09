import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/elements/Button";

const NAV_ITEMS = [
  { id: "summary", label: "交通費合計" },
  { id: "form", label: "交通費申請" },
  { id: "favorite", label: "お気に入り経路" },
];

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export const Header = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="mb-6 rounded-2xl bg-white p-4 shadow-lg md:mb-8 md:p-6">
      <div className="flex items-center justify-between md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">TransiTrack 2</h1>
          <p className="text-sm text-gray-600 md:hidden">{session?.user?.email}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* ハンバーガーボタン（モバイルのみ） */}
          <button
            type="button"
            className="flex flex-col gap-1.5 p-2 md:hidden"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="メニュー"
          >
            <span className="block h-0.5 w-6 bg-gray-700" />
            <span className="block h-0.5 w-6 bg-gray-700" />
            <span className="block h-0.5 w-6 bg-gray-700" />
          </button>
          <p className="hidden text-sm text-gray-600 md:block md:text-base">
            {session?.user?.email}
          </p>
          <Button
            variant="secondary"
            size="md"
            onClick={() => signOut()}
            className="hidden px-4 sm:block"
          >
            ログアウト
          </Button>
        </div>
      </div>

      {/* モバイル用ドロップダウンメニュー */}
      {isMenuOpen && (
        <nav className="mt-4 border-t border-gray-100 pt-4 md:hidden">
          <ul className="flex flex-col gap-5">
            {NAV_ITEMS.map(({ id, label }) => (
              <li key={id}>
                <button
                  type="button"
                  className="block text-sm text-gray-700"
                  onClick={() => {
                    scrollToSection(id);
                    setIsMenuOpen(false);
                  }}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          <Button
            variant="secondary"
            size="md"
            onClick={() => signOut()}
            className="mt-6 w-full px-4"
          >
            ログアウト
          </Button>
        </nav>
      )}
    </header>
  );
};
