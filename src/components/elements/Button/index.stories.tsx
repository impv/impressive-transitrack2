import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/elements/Button";

const meta = {
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "ボタン",
    variant: "primary",
    size: "md",
    fullWidth: false,
    disabled: false,
  },
};
