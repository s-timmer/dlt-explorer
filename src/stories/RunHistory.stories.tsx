import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RunHistory } from "@/components/runtime/run-history";
import type { PipelineRun } from "@/components/runtime/types";

const meta = {
  title: "Runtime/RunHistory",
  component: RunHistory,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="p-8 flex items-end justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RunHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

const allGreen: PipelineRun[] = [
  { timestamp: "06:00", duration: 45, rowsLoaded: 12_200, status: "success" },
  { timestamp: "00:00", duration: 48, rowsLoaded: 12_100, status: "success" },
  { timestamp: "18:00", duration: 44, rowsLoaded: 11_950, status: "success" },
  { timestamp: "12:00", duration: 46, rowsLoaded: 12_300, status: "success" },
  { timestamp: "06:00", duration: 43, rowsLoaded: 12_150, status: "success" },
  { timestamp: "00:00", duration: 51, rowsLoaded: 12_080, status: "success" },
  { timestamp: "18:00", duration: 47, rowsLoaded: 11_900, status: "success" },
];

const mixedStatus: PipelineRun[] = [
  { timestamp: "02:00", duration: 312, rowsLoaded: 0, status: "failed" },
  { timestamp: "02:00", duration: 89, rowsLoaded: 45_200, status: "success" },
  { timestamp: "02:00", duration: 92, rowsLoaded: 44_800, status: "success" },
  { timestamp: "02:00", duration: 85, rowsLoaded: 43_100, status: "success" },
  { timestamp: "02:00", duration: 88, rowsLoaded: 44_500, status: "success" },
  { timestamp: "02:00", duration: 310, rowsLoaded: 0, status: "failed" },
  { timestamp: "02:00", duration: 91, rowsLoaded: 42_900, status: "success" },
];

const withRunning: PipelineRun[] = [
  { timestamp: "04:00", duration: 0, rowsLoaded: 0, status: "running" },
  { timestamp: "04:00", duration: 234, rowsLoaded: 182_000, status: "success" },
  { timestamp: "04:00", duration: 198, rowsLoaded: 176_000, status: "success" },
  { timestamp: "04:00", duration: 201, rowsLoaded: 179_000, status: "success" },
  { timestamp: "04:00", duration: 195, rowsLoaded: 171_000, status: "success" },
  { timestamp: "04:00", duration: 189, rowsLoaded: 168_000, status: "success" },
  { timestamp: "04:00", duration: 185, rowsLoaded: 165_000, status: "success" },
];

const withWarning: PipelineRun[] = [
  { timestamp: "06:00", duration: 156, rowsLoaded: 28_400, status: "warning" },
  { timestamp: "06:00", duration: 148, rowsLoaded: 27_900, status: "success" },
  { timestamp: "06:00", duration: 152, rowsLoaded: 28_100, status: "success" },
  { timestamp: "06:00", duration: 145, rowsLoaded: 27_500, status: "success" },
  { timestamp: "06:00", duration: 149, rowsLoaded: 27_800, status: "success" },
  { timestamp: "06:00", duration: 151, rowsLoaded: 28_200, status: "success" },
  { timestamp: "06:00", duration: 147, rowsLoaded: 27_600, status: "success" },
];

/** All runs succeeded — hover to see the dock-style magnification. */
export const AllHealthy: Story = {
  args: { runs: allGreen },
};

/** Mix of successes and failures with varying durations. */
export const MixedWithFailures: Story = {
  args: { runs: mixedStatus },
};

/** A currently running pipeline — the leading bar pulses. */
export const CurrentlyRunning: Story = {
  args: { runs: withRunning },
};

/** Recent schema change warning among successes. */
export const WithWarning: Story = {
  args: { runs: withWarning },
};
