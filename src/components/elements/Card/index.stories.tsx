import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card } from "@/components/elements/Card";

const meta = {
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <h2 className="mb-2 text-lg font-semibold text-gray-900">カードタイトル</h2>
        <p className="text-gray-600">
          カードの説明文がここに入ります。複数行のテキストも対応しています。
        </p>
      </>
    ),
  },
};
