import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SqlBlock } from "@/components/explore/sql-block";

const meta = {
  title: "Explore/SqlBlock",
  component: SqlBlock,
  parameters: { layout: "padded" },
} satisfies Meta<typeof SqlBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {
  args: {
    sql: "SELECT state, COUNT(*) as count\nFROM issues\nGROUP BY state\nORDER BY count DESC;",
    defaultOpen: false,
  },
};

export const Expanded: Story = {
  args: {
    sql: "SELECT state, COUNT(*) as count\nFROM issues\nGROUP BY state\nORDER BY count DESC;",
    defaultOpen: true,
  },
};

export const LongQuery: Story = {
  args: {
    sql: `SELECT
  l.name as label_name,
  COUNT(*) as issue_count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM issues), 2) as percentage
FROM issues i
JOIN issues__labels l ON i._dlt_id = l._dlt_parent_id
GROUP BY l.name
ORDER BY issue_count DESC
LIMIT 10;`,
    defaultOpen: true,
  },
};

export const EmptySQL: Story = {
  args: { sql: "" },
};
