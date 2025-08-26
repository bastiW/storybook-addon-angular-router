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
  argTypes: {
    exact: {
      name: 'exact',
      description:'exact match options of the routerLinkActive directive',
      control: {type :'boolean'}
    }
  }
};

export default meta;
type Story = StoryObj<HeaderComponent>;

export const WithoutActive: Story = {};

export const WithActive: Story = {
  parameters: {
    angularRouter: {active: '/location/1'}
  }
};


export const WithActivePartialMatch: Story = {
  parameters: {
    angularRouter: {active: '/location'}
  }
};

