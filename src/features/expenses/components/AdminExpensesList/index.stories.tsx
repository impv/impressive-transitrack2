import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SessionProvider } from "next-auth/react";
import { AdminExpensesList } from "@/features/expenses/components/AdminExpensesList";
import { mockAdminSession, mockExpensesMultiMember } from "@/features/expenses/mocks";

const meta = {
  component: AdminExpensesList,
  decorators: [
    (Story) => (
      <SessionProvider session={mockAdminSession}>
        <Story />
      </SessionProvider>
    ),
  ],
  args: {
    refreshTrigger: 0,
    onSuccess: () => {},
    initialYearMonth: "2026-02",
  },
} satisfies Meta<typeof AdminExpensesList>;

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

export const WithMembers: Story = {
  async beforeEach() {
    window.fetch = async () =>
      new Response(JSON.stringify(mockExpensesMultiMember), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
  },
};

export const WithMemberSelected: Story = {
  args: {
    initialMemberId: "member-1",
  },
  async beforeEach() {
    window.fetch = async () =>
      new Response(JSON.stringify(mockExpensesMultiMember), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
  },
};
