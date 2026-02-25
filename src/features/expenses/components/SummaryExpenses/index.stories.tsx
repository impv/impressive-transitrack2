import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SessionProvider } from "next-auth/react";
import { SummaryExpenses } from "@/features/expenses/components/SummaryExpenses";
import {
  mockAdminSession,
  mockExpensesMultiMember,
  mockExpensesSingleMember,
  mockSession,
} from "@/features/expenses/mocks";

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
        session={mockSession}
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
        session={mockAdminSession}
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
