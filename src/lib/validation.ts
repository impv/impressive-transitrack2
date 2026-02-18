import { TransportType, TripType } from "@prisma/client";

export interface ValidationResult {
  /**
   * 入力された値がエラーかどうか
   */
  hasError: boolean;
  /**
   * エラーメッセージ
   */
  message?: string;
}

const valid: ValidationResult = { hasError: false };
const inValid = (message: string): ValidationResult => ({ hasError: true, message });

/**
 * 金額バリデーション：正の整数であることを検証
 */
export const validateAmount = (amount: unknown): ValidationResult => {
  const numAmount = Number(amount);
  if (!Number.isFinite(numAmount) || numAmount <= 0) {
    return inValid("金額は正の数値である必要があります");
  }
  if (!Number.isInteger(numAmount)) {
    return inValid("金額は整数（円単位）で入力してください");
  }
  return valid;
};

/**
 * 日付バリデーション：有効な日付文字列であることを検証
 */
export const validateDate = (date: string): ValidationResult => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return inValid("有効な日付を入力してください");
  }
  return valid;
};

/**
 * 未来日付チェック（クライアント向け：ローカルタイムゾーン基準）
 */
export const validateNotFutureDate = (date: string): ValidationResult => {
  const selectedDate = new Date(date);
  const today = new Date();
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (selectedDate > today) {
    return inValid("未来の日付は選択できません");
  }
  return valid;
};

/**
 * 未来日付チェック（サーバー向け：タイムゾーンオフセット考慮）
 */
export const validateNotFutureDateWithOffset = (
  date: string,
  timezoneOffset?: number,
): ValidationResult => {
  const now = new Date();
  let todayStr: string;

  if (typeof timezoneOffset === "number") {
    const userLocalTime = new Date(now.getTime() - timezoneOffset * 60 * 1000);
    todayStr = userLocalTime.toISOString().split("T")[0];
  } else {
    todayStr = now.toISOString().split("T")[0];
  }

  if (date > todayStr) {
    return inValid("未来の日付は選択できません");
  }
  return valid;
};

/**
 * TransportType の値が有効であることを検証
 */
export const validateTransportType = (transport: string): ValidationResult => {
  if (!Object.values(TransportType).includes(transport as TransportType)) {
    return inValid("transport の値が不正です");
  }
  return valid;
};

/**
 * TripType の値が有効であることを検証
 */
export const validateTripType = (tripType: string): ValidationResult => {
  if (!Object.values(TripType).includes(tripType as TripType)) {
    return inValid("tripType の値が不正です");
  }
  return valid;
};

/**
 * 必須フィールドの存在チェック
 */
export const validateRequired = (fields: Record<string, unknown>): ValidationResult => {
  for (const value of Object.values(fields)) {
    if (!value) {
      return inValid("必須項目が不足しています");
    }
  }
  return valid;
};

/**
 * 複数のバリデーションを順番に実行し、最初のエラーで停止
 */
export const validate = (...validations: ValidationResult[]): ValidationResult => {
  for (const result of validations) {
    if (result.hasError) {
      return result;
    }
  }
  return valid;
};
