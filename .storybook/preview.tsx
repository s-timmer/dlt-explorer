import React from 'react'
import type { Preview } from '@storybook/nextjs-vite'
import { TooltipProvider } from '../src/components/ui/tooltip'
import '../src/app/globals.css'

const preview: Preview = {
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  parameters: {
    options: {
      storySort: {
        order: [
          'Design System',
          ['Overview', 'Vocabulary', 'Colors', 'Typography', 'Spacing & Radius', 'Composition'],
          'Explore',
          'Runtime',
        ],
      },
    },

    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      test: 'todo'
    }
  },
};

export default preview;
