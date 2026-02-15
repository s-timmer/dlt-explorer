import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FreshnessTimestamp } from "@/components/runtime/freshness";
import type { Pipeline } from "@/components/runtime/types";

const meta = {
  title: "Runtime/FreshnessTimestamp",
  component: FreshnessTimestamp,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="p-8 text-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FreshnessTimestamp>;

export default meta;
type Story = StoryObj<typeof meta>;

const basePipeline: Pipeline = {
  name: "example",
  source: "API",
  destination: "DuckDB",
  schedule: "Every hour",
  status: "success",
  statusDetail: "All tables loaded",
  lastRun: "30 minutes ago",
  lastDuration: 20,
  rowsLastRun: 1_000,
  recentRuns: [],
  schemaChange: null,
};

/** Pipeline ran recently — within the expected schedule window. */
export const Fresh: Story = {
  args: {
    pipeline: { ...basePipeline, lastRun: "30 minutes ago", schedule: "Every hour" },
  },
};

/** Pipeline is a bit late — amber clock icon with tooltip. */
export const Aging: Story = {
  args: {
    pipeline: { ...basePipeline, lastRun: "90 minutes ago", schedule: "Every hour" },
  },
};

/** Pipeline is significantly overdue — red clock icon. */
export const Stale: Story = {
  args: {
    pipeline: { ...basePipeline, lastRun: "3 hours ago", schedule: "Every hour" },
  },
};

/** Currently running pipeline — always shows as fresh. */
export const Running: Story = {
  args: {
    pipeline: { ...basePipeline, status: "running", lastRun: "Running now" },
  },
};

/** Daily pipeline that ran on time. */
export const DailyOnTime: Story = {
  args: {
    pipeline: { ...basePipeline, lastRun: "6 hours ago", schedule: "Daily at 02:00" },
  },
};

/** Daily pipeline that missed its window. */
export const DailyOverdue: Story = {
  args: {
    pipeline: { ...basePipeline, lastRun: "36 hours ago", schedule: "Daily at 02:00" },
  },
};
