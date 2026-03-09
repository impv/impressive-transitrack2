import * as RadixDialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { IoMdClose } from "react-icons/io";

interface DialogProps {
  /**
   * カスタムクラス名
   */
  className?: string;
  /**
   * ダイアログの開閉状態
   */
  isVisible?: boolean;
  /**
   * タイトル
   */
  title?: string;
  /**
   * メインコンテンツ
   */
  content?: ReactNode;
  /**
   * フッターコンテンツ
   */
  footer?: ReactNode;
  /**
   * ダイアログを閉じるときのコールバック
   */
  onClose?: () => void;
}

export const Dialog = ({ className, title, content, footer, isVisible = false, onClose }: DialogProps) => {
  return (
    <RadixDialog.Root open={isVisible} onOpenChange={(open) => { if (!open) onClose?.(); }}>
      <RadixDialog.Trigger />
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black opacity-50 z-40" />
        <RadixDialog.Content
          className={twMerge(
            "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(500px,calc(100vw-32px))] bg-white rounded-lg shadow-xl focus:outline-none z-50",
            className,
          )}
        >
          {/* タイトル */}
          <div className="p-5">
            {/* 閉じるボタン */}
            <RadixDialog.Close asChild>
              <button type="button" aria-label="Close" className="absolute top-3 right-3">
                <IoMdClose size={25} />
              </button>
            </RadixDialog.Close>
            <div className="mb-2">
              <RadixDialog.Title className="text-xl">{title}</RadixDialog.Title>
            </div>

            {/* メインコンテンツ */}
            <div className="mb-2">{content}</div>
            {/* フッターコンテンツ */}
            <div className="">{footer}</div>
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};
