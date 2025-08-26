import type { Preview } from "@storybook/react-vite";
import { withAngularRouter } from "../src/angular-router/withAngularRouter";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  initialGlobals: {
    background: { value: "light" },
  },
  decorators: [withAngularRouter]
};

export default preview;
