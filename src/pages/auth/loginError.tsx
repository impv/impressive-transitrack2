import { useRouter } from "next/router";

export const LoginError = () => {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-6 shadow-xl sm:space-y-8 sm:p-10">
        {/* エラーアイコン */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-4xl">
            ⚠️
          </div>
        </div>

        {/* タイトルとメッセージ */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">ログインエラー</h1>
          <p className="mt-4 text-sm text-gray-600 sm:text-base">
            ログインに失敗しました。申し訳ありませんが、もう一度お試しいただくか、別のアカウントでお試しください。
          </p>
        </div>

        {/* 戻るボタン */}
        <div className="mt-8">
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="cursor-pointer w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            前のページへ戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginError;
