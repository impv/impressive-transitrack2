import { useSession } from "next-auth/react";
import { FaRegUser } from "react-icons/fa6";
import { MdOutlineMailOutline } from "react-icons/md";

export const UserDetail = () => {
  const { data: session } = useSession();

  if (!session) return null;
  return (
    <>
      <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl" id="user">
        ユーザー情報
      </h2>
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <FaRegUser />
          <div className="min-w-0 flex-1">
            <span className="text-xs font-medium text-gray-500 sm:text-sm">名前</span>
            <p className="truncate text-sm text-gray-900 sm:text-base">
              {session.user?.name} {session.user?.isAdmin ? "(管理者)" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <MdOutlineMailOutline />
          <div className="min-w-0 flex-1">
            <span className="text-xs font-medium text-gray-500 sm:text-sm">メール</span>
            <p className="truncate text-sm text-gray-900 sm:text-base">{session.user?.email}</p>
          </div>
        </div>
      </div>
    </>
  );
};
