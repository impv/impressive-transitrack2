import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScrollToTopButton } from "@/components/elements/ScrollToTopButton";

const meta = {
  component: ScrollToTopButton,
} satisfies Meta<typeof ScrollToTopButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => {
      // スクロール量を模擬してボタンを表示する
      Object.defineProperty(window, "scrollY", { value: 500, writable: true });
      window.dispatchEvent(new Event("scroll"));
      return <Story />;
    },
  ],
};
