import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';

import { HeaderComponent } from './header.component';

const meta: Meta<HeaderComponent> = {
  title: 'Example/Header',
  component: HeaderComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {

  },
};

export default meta;
type Story = StoryObj<HeaderComponent>;

export const WithActive: Story = {
  args: {

  },
  parameters: {
    angularRouter: {active: '/location/1'}
  }
};

