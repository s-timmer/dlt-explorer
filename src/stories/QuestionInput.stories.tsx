import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QuestionInput } from "@/components/explore/question-input";
import { issuesSuggestions } from "./explore-fixtures";

const meta = {
  title: "Explore/QuestionInput",
  component: QuestionInput,
  parameters: { layout: "padded" },
  args: {
    onSubmit: (question: string) => console.log("Submitted:", question),
  },
} satisfies Meta<typeof QuestionInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithSuggestions: Story = {
  args: {
    suggestions: issuesSuggestions.slice(0, 4),
    disabled: false,
  },
};

export const Empty: Story = {
  args: {
    suggestions: [],
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    suggestions: issuesSuggestions.slice(0, 2),
    disabled: true,
  },
};
