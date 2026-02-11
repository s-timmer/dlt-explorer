import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BarChart } from "@/components/explore/bar-chart";
import { issueStateBarChart, issueLabelsBarChart } from "./explore-fixtures";

const meta = {
  title: "Explore/BarChart",
  component: BarChart,
  parameters: { layout: "padded" },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoBars: Story = {
  args: {
    items: issueStateBarChart,
  },
};

export const FiveBars: Story = {
  args: {
    items: issueLabelsBarChart,
  },
};

export const SingleBar: Story = {
  args: {
    items: [{ label: "Python", value: 100 }],
  },
};

export const Empty: Story = {
  args: { items: [] },
};
