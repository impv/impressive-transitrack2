import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SessionProvider } from "next-auth/react";
import { SummaryExpenses } from "@/features/expenses/components/SummaryExpenses";

const mockExpensesMultiMember = [
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
    memberId: "member-2",
    date: "2026-02-14T00:00:00.000Z",
    departure: "渋谷駅",
    arrival: "横浜駅",
    amount: 550,
    transport: "TRAIN",
    tripType: "ONEWAY",
    createdAt: "2026-02-14T09:00:00.000Z",
    updatedAt: "2026-02-14T09:00:00.000Z",
    member: { name: "鈴木 花子", email: "suzuki@example.com" },
  },
  {
    id: "exp-4",
    memberId: "member-2",
    date: "2026-02-17T00:00:00.000Z",
    departure: "池袋駅",
    arrival: "上野駅",
    amount: 180,
    transport: "BUS",
    tripType: "ONEWAY",
    createdAt: "2026-02-17T09:00:00.000Z",
    updatedAt: "2026-02-17T09:00:00.000Z",
    member: { name: "鈴木 花子", email: "suzuki@example.com" },
  },
];

const mockExpensesSingleMember = mockExpensesMultiMember.filter((e) => e.memberId === "member-1");

const meta = {
  component: SummaryExpenses,
  args: {
    refreshTrigger: 0,
  },
} satisfies Meta<typeof SummaryExpenses>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UserView: Story = {
  decorators: [
    (Story) => (
      <SessionProvider
        session={{
          user: { id: "member-1", name: "田中 太郎", email: "tanaka@example.com", isAdmin: false },
          expires: "2099-01-01",
        }}
      >
        <Story />
      </SessionProvider>
    ),
  ],
  async beforeEach() {
    window.fetch = async () =>
      new Response(JSON.stringify(mockExpensesSingleMember), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
  },
};

export const AdminView: Story = {
  decorators: [
    (Story) => (
      <SessionProvider
        session={{
          user: { id: "member-1", name: "田中 太郎", email: "tanaka@example.com", isAdmin: true },
          expires: "2099-01-01",
        }}
      >
        <Story />
      </SessionProvider>
    ),
  ],
  async beforeEach() {
    window.fetch = async () =>
      new Response(JSON.stringify(mockExpensesMultiMember), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
  },
};
