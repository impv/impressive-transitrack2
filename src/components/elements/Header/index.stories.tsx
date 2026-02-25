import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SessionProvider } from "next-auth/react";

import { Header } from "@/components/elements/Header";

const mockSession = {
  user: { id: "1", name: "田中 太郎", isAdmin: false },
  expires: "2099-01-01",
};

const meta = {
  component: Header,
  decorators: [
    (Story) => (
      <SessionProvider session={mockSession}>
        <Story />
      </SessionProvider>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
