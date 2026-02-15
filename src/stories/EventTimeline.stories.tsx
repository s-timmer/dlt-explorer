import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EventTimeline } from "@/components/runtime/event-timeline";
import {
  failedPipelineEvents,
  schemaChangeEvent,
  allSuccessEvents,
  singleEvent,
} from "./runtime-fixtures";

const meta = {
  title: "Runtime/EventTimeline",
  component: EventTimeline,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-lg border rounded-xl overflow-hidden">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EventTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FailedLoad: Story = {
  args: {
    events: failedPipelineEvents,
  },
};

export const SchemaChange: Story = {
  args: {
    events: schemaChangeEvent,
  },
};

export const AllSuccess: Story = {
  args: {
    events: allSuccessEvents,
  },
};

export const SingleEvent: Story = {
  args: {
    events: singleEvent,
  },
};

export const MixedEvents: Story = {
  args: {
    events: [
      ...failedPipelineEvents,
      ...schemaChangeEvent,
    ],
  },
};
