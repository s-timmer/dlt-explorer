import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ThinkingIndicator } from "@/components/explore/thinking-indicator";

const meta = {
  title: "Explore/ThinkingIndicator",
  component: ThinkingIndicator,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ThinkingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
