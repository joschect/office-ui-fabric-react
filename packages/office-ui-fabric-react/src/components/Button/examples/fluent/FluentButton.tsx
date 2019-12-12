import { BaseButton } from './../BaseButton';
import { FluentButtonTheme } from './FluentTheme';
import { compose, composeThemeDriven } from './compose';

export const FluentButton = composeThemeDriven('FluentButton', BaseButton);

export const OtherButton = compose(
  'OtherButton',
  BaseButton,
  undefined,
  FluentButtonTheme
);
