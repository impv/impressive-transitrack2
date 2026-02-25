import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ExpenseForm } from "@/features/expenses/components/ExpenseForm";
import { mockFavorites } from "@/features/expenses/mocks";

const meta = {
  component: ExpenseForm,
  args: {
    favorites: [],
    isFavoriteSaving: false,
    onSuccess: () => {},
    saveFromExpenseForm: async () => {},
  },
} satisfies Meta<typeof ExpenseForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFavorites: Story = {
  args: {
    favorites: mockFavorites,
  },
};
