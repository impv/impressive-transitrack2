import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ExpenseItem } from "@/features/expenses/components/ExpenseItem";
import { mockExpenses } from "@/features/expenses/mocks";
import type { ExpenseRecord } from "@/types/expenses";

const expense = mockExpenses[0] as ExpenseRecord;

const defaultEditForm = {
  date: expense.date.slice(0, 10),
  departure: expense.departure,
  arrival: expense.arrival,
  amount: expense.amount,
  transport: expense.transport as "TRAIN" | "BUS",
};

const meta = {
  component: ExpenseItem,
  args: {
    expense,
    idx: 0,
    idPrefix: "expense",
    selectedExpenseId: null,
    expenseEditForm: defaultEditForm,
    isUpdating: false,
    errors: [],
    onEditClick: () => {},
    onDeleteClick: () => {},
    onFormChange: () => {},
    onSubmitUpdate: async () => {},
  },
} satisfies Meta<typeof ExpenseItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Editing: Story = {
  args: {
    selectedExpenseId: expense.id,
  },
};

export const EditingWithErrors: Story = {
  args: {
    selectedExpenseId: expense.id,
    errors: ["出発地を入力してください", "到着地を入力してください"],
  },
};

export const Updating: Story = {
  args: {
    selectedExpenseId: expense.id,
    isUpdating: true,
  },
};
