import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FavoriteRouteConfirmDialog } from "@/features/expenses/components/FavoriteRouteConfirmDialog";
import { mockFavorites } from "@/features/expenses/mocks";

const meta = {
  component: FavoriteRouteConfirmDialog,
} satisfies Meta<typeof FavoriteRouteConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isVisible: true,
    formData: mockFavorites[0],
    isSubmitting: false,
    onConfirmDialogSubmit: () => {},
    onClose: () => {},
  },
};
