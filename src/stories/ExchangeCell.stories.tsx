import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ExchangeCell } from "@/components/explore/exchange-cell";
import {
  issueStateExchange,
  issueAuthorsExchange,
  stargazerCountExchange,
  thinkingExchange,
} from "./explore-fixtures";

const meta = {
  title: "Explore/ExchangeCell",
  component: ExchangeCell,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ExchangeCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BarChartResult: Story = {
  args: {
    exchange: issueStateExchange,
  },
};

export const TableResult: Story = {
  args: {
    exchange: issueAuthorsExchange,
  },
};

export const StatResult: Story = {
  args: {
    exchange: stargazerCountExchange,
  },
};

export const Thinking: Story = {
  args: {
    exchange: thinkingExchange,
  },
};
