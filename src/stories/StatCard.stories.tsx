import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StatCard } from "@/components/explore/stat-card";
import { stargazerCountStat, repoPopularityStat } from "./explore-fixtures";

const meta = {
  title: "Explore/StatCard",
  component: StatCard,
  parameters: { layout: "padded" },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleStat: Story = {
  args: {
    stats: stargazerCountStat,
  },
};

export const MultiplStats: Story = {
  args: {
    stats: repoPopularityStat,
  },
};

export const Percentage: Story = {
  args: {
    stats: [
      { label: "Closed", value: "89%", detail: "3,164 of 3,576 issues" },
    ],
  },
};

export const Empty: Story = {
  args: { stats: [] },
};
