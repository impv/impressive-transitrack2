import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Dialog } from "@/components/elements/Dialog";

const meta = {
  component: Dialog,
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "タイトル",
    content: <p>コンテンツ</p>,
    footer: <p>フッター</p>,
    isVisible: true,
  },
};
