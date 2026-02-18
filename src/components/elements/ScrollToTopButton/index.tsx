import { useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // 400px以上スクロールしたら表示
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 rounded-full bg-white px-4 py-3 text-xl font-medium shadow-lg hover:bg-gray-100"
      aria-label="ページ上部へ戻る"
    >
      <IoIosArrowUp />
    </button>
  );
};
