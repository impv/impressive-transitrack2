import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SessionProvider } from "next-auth/react";

import { ExpensesList } from "@/features/expenses/components/ExpensesList";

const mockSession = {
  user: { id: "member-1", name: "田中 太郎", email: "tanaka@example.com", isAdmin: false },
  expires: "2099-01-01",
};

const mockExpenses = [
  {
    id: "exp-1",
    memberId: "member-1",
    date: "2026-02-10T00:00:00.000Z",
    departure: "東京駅",
    arrival: "渋谷駅",
    amount: 200,
    transport: "TRAIN",
    tripType: "ONEWAY",
    createdAt: "2026-02-10T09:00:00.000Z",
    updatedAt: "2026-02-10T09:00:00.000Z",
    member: { name: "田中 太郎", email: "tanaka@example.com" },
  },
  {
    id: "exp-2",
    memberId: "member-1",
    date: "2026-02-12T00:00:00.000Z",
    departure: "新宿駅",
    arrival: "品川駅",
    amount: 320,
    transport: "TRAIN",
    tripType: "ROUNDTRIP",
    createdAt: "2026-02-12T09:00:00.000Z",
    updatedAt: "2026-02-12T09:00:00.000Z",
    member: { name: "田中 太郎", email: "tanaka@example.com" },
  },
  {
    id: "exp-3",
    memberId: "member-1",
    date: "2026-02-14T00:00:00.000Z",
    departure: "渋谷駅",
    arrival: "横浜駅",
    amount: 550,
    transport: "TRAIN",
    tripType: "ONEWAY",
    createdAt: "2026-02-14T09:00:00.000Z",
    updatedAt: "2026-02-14T09:00:00.000Z",
    member: { name: "田中 太郎", email: "tanaka@example.com" },
  },
  {
    id: "exp-4",
    memberId: "member-1",
    date: "2026-02-17T00:00:00.000Z",
    departure: "池袋駅",
    arrival: "上野駅",
    amount: 180,
    transport: "BUS",
    tripType: "ONEWAY",
    createdAt: "2026-02-17T09:00:00.000Z",
    updatedAt: "2026-02-17T09:00:00.000Z",
    member: { name: "田中 太郎", email: "tanaka@example.com" },
  },
  {
    id: "exp-5",
    memberId: "member-1",
    date: "2026-02-19T00:00:00.000Z",
    departure: "東京駅",
    arrival: "新橋駅",
    amount: 150,
    transport: "TRAIN",
    tripType: "ROUNDTRIP",
    createdAt: "2026-02-19T09:00:00.000Z",
    updatedAt: "2026-02-19T09:00:00.000Z",
    member: { name: "田中 太郎", email: "tanaka@example.com" },
  },
  {
    id: "exp-6",
    memberId: "member-1",
    date: "2026-02-21T00:00:00.000Z",
    departure: "秋葉原駅",
    arrival: "神田駅",
    amount: 140,
    transport: "TRAIN",
    tripType: "ONEWAY",
    createdAt: "2026-02-21T09:00:00.000Z",
    updatedAt: "2026-02-21T09:00:00.000Z",
    member: { name: "田中 太郎", email: "tanaka@example.com" },
  },
];

const meta = {
  component: ExpensesList,
  decorators: [
    (Story) => (
      <SessionProvider session={mockSession}>
        <Story />
      </SessionProvider>
    ),
  ],
  args: {
    refreshTrigger: 0,
  },
} satisfies Meta<typeof ExpensesList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  async beforeEach() {
    window.fetch = async () =>
      new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
  },
};

export const WithData: Story = {
  async beforeEach() {
    window.fetch = async () =>
      new Response(JSON.stringify(mockExpenses), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
  },
};
