import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ResultTable } from "@/components/explore/result-table";
import { issueRecentTable, issueTopAuthorsTable } from "./explore-fixtures";

const meta = {
  title: "Explore/ResultTable",
  component: ResultTable,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ResultTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FewRows: Story = {
  args: {
    result: issueRecentTable,
  },
};

export const ManyColumns: Story = {
  args: {
    result: {
      columns: ["user", "issues", "prs", "comments", "reviews"],
      rows: [
        { user: "rudolfix", issues: 142, prs: 231, comments: 892, reviews: 445 },
        { user: "zilto", issues: 98, prs: 167, comments: 534, reviews: 312 },
        { user: "burnash", issues: 76, prs: 145, comments: 423, reviews: 201 },
      ],
    },
  },
};

export const WithNulls: Story = {
  args: {
    result: {
      columns: ["number", "title", "closed_at"],
      rows: [
        { number: 3537, title: "Fix schema contract checks", closed_at: null },
        { number: 3534, title: "Add Delta table support", closed_at: "2026-01-20T15:30:00Z" },
        { number: 3530, title: "Update docs", closed_at: null },
      ],
    },
  },
};

export const Empty: Story = {
  args: {
    result: { columns: [], rows: [] },
  },
};
