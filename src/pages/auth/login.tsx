import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/elements/Button";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

export const Login = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ログイン済みの場合はホームにリダイレクト
  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-6 shadow-xl sm:space-y-8 sm:p-10">
        {/* タイトルエリア */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">TransiTrack 2</h1>
          <p className="mt-2 text-sm text-gray-600">交通費管理をよりスマートに</p>
        </div>

        {/* ログインボタン */}
        <div className="mt-8">
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() =>
              signIn("google", {
                callbackUrl: "/dashboard",
              })
            }
            className="group relative gap-3"
          >
            <FcGoogle className="text-lg" />
            <span>Googleでログイン</span>
          </Button>
        </div>

        {/* フッター */}
        <p className="mt-6 text-center text-xs text-gray-500">
          ログインすることで、利用規約に同意したものとみなされます
        </p>
      </div>
    </div>
  );
};

export default Login;
