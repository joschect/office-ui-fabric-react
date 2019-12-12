import { BaseMenu } from '../BaseMenu';
import { FluentMenuItem } from './FluentMenuItem';
import { compose, getComponentFromTheme } from './compose';

export const FluentMenu = compose(
  'FluentMenu',
  BaseMenu,
  {
    slots: {
      item: FluentMenuItem
    }
  },
  getComponentFromTheme
);
