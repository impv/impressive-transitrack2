import { useEffect, useState } from "react";
import { getCurrentYearMonth } from "@/features/expenses/utils/getCurrentYearMonth";

const STORAGE_KEY = "expenses_year_month";

/**
 * ページをまたいで表示月を共有するhook。
 * localStorageを使って /dashboard と /expenses 間で月の選択状態を同期する。
 *
 * @param initial - 優先する初期値（URLクエリパラメータなど）。指定された場合はlocalStorageより優先する。
 */
export const useSharedYearMonth = (initial?: string): [string, (value: string) => void] => {
  const [yearMonth, setYearMonthState] = useState<string>(() => {
    if (initial) return initial;
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) ?? getCurrentYearMonth();
    }
    return getCurrentYearMonth();
  });

  useEffect(() => {
    if (initial) {
      setYearMonthState(initial);
      localStorage.setItem(STORAGE_KEY, initial);
    }
  }, [initial]);

  const setYearMonth = (value: string) => {
    setYearMonthState(value);
    localStorage.setItem(STORAGE_KEY, value);
  };

  return [yearMonth, setYearMonth];
};
