import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SessionProvider } from "next-auth/react";

import { UserDetail } from "@/components/elements/UserDetail";

const mockSession = {
  user: { id: "1", name: "田中 太郎", email: "tanaka@example.com", isAdmin: false },
  expires: "2099-01-01",
};

const meta = {
  component: UserDetail,
  decorators: [
    (Story) => (
      <SessionProvider session={mockSession}>
        <Story />
      </SessionProvider>
    ),
  ],
} satisfies Meta<typeof UserDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
