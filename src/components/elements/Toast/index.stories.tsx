import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Toast } from "@/components/elements/Toast";

const meta = {
  component: Toast,
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    toastMessage: "保存しました",
  },
};
