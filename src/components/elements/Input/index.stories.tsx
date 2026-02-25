import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "@/components/elements/Input";

const meta = {
  component: Input,
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "テキストを入力",
  },
};
