import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SessionProvider } from "next-auth/react";
import { ExpensesList } from "@/features/expenses/components/ExpensesList";
import { mockSession, mockExpenses } from "@/features/expenses/mocks";

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
  args: {
    onSuccess: () => {},
  },
  async beforeEach() {
    window.fetch = async () =>
      new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
  },
};

export const WithData: Story = {
  args: {
    onSuccess: () => {},
  },
  async beforeEach() {
    window.fetch = async () =>
      new Response(JSON.stringify(mockExpenses), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
  },
};
