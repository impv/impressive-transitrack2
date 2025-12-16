import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Dashboard = () => {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status !== "loading" && !session) {
			router.push("/auth/login");
		}
	}, [session, status, router]);

	// 未ログイン時はリダイレクト中の表示
	if (!session) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-lg">リダイレクト中...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
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

				{/* お知らせカード */}
				<div className="mt-4 rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 p-4 shadow-lg sm:mt-6 sm:p-6">
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
