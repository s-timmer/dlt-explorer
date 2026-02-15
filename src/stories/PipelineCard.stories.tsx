import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PipelineCard } from "@/components/runtime/pipeline-card";
import {
  healthyPipeline,
  failedPipeline,
  warningPipeline,
  runningPipeline,
  stalePipeline,
} from "./runtime-fixtures";

const meta = {
  title: "Runtime/PipelineCard",
  component: PipelineCard,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PipelineCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Healthy: Story = {
  args: {
    pipeline: healthyPipeline,
  },
};

export const Failed: Story = {
  args: {
    pipeline: failedPipeline,
  },
};

export const Warning: Story = {
  args: {
    pipeline: warningPipeline,
  },
};

export const Running: Story = {
  args: {
    pipeline: runningPipeline,
  },
};

export const Stale: Story = {
  args: {
    pipeline: stalePipeline,
  },
};
