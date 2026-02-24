import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ExpenseForm } from "@/features/expenses/components/ExpenseForm";

const mockFavorites = [
  {
    id: "fav-1",
    memberId: "member-1",
    name: "よく使う経路",
    departure: "東京駅",
    arrival: "渋谷駅",
    amount: 200,
    transport: "TRAIN" as const,
    tripType: "ONEWAY" as const,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "fav-2",
    memberId: "member-1",
    name: "",
    departure: "新宿駅",
    arrival: "品川駅",
    amount: 320,
    transport: "TRAIN" as const,
    tripType: "ROUNDTRIP" as const,
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
];

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

export const SavingFavorite: Story = {
  args: {
    favorites: mockFavorites,
    isFavoriteSaving: true,
  },
};
