import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DatasetContext } from "@/components/explore/dataset-context";
import {
  issuesTableMeta,
  issuesKeyFields,
  issuesDescription,
} from "./explore-fixtures";

const meta = {
  title: "Explore/DatasetContext",
  component: DatasetContext,
  parameters: { layout: "padded" },
} satisfies Meta<typeof DatasetContext>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {
  args: {
    table: issuesTableMeta,
    description: issuesDescription,
    keyFields: issuesKeyFields,
    accessedFields: [],
  },
};

export const WithAccessedFields: Story = {
  args: {
    table: issuesTableMeta,
    description: issuesDescription,
    keyFields: issuesKeyFields,
    accessedFields: ["state", "user__login"],
  },
};
