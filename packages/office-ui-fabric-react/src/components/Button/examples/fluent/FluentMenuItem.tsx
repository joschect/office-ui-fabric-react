import { BaseMenuItem } from './../BaseMenuItem';
import { compose, getComponentFromTheme } from './compose';
// import { FluentMenu } from './';

export const FluentMenuItem = compose(
  'FluentMenuItem',
  BaseMenuItem,
  undefined,
  getComponentFromTheme
  // {
  //   slots: {
  //     menu: FluentMenu,
  //   }
  // }
);

export const OtherMenuItem = compose(
  'FluentMenuItem',
  BaseMenuItem,
  undefined,
  {
    styles: (theme: any) => ({
      root: {
        border: '1px solid blue',
        backgroundColor: theme.colors.brand.weakest()
      }
    }),
    variants: {
      rounded: {
        true: {
          root: { borderRadius: '20px' } // FluentMenu should propagate this prop to the FluentMenuItem...
        }
      }
    }
  }
  // {
  //   slots: {
  //     menu: FluentMenu,
  //   }
  // }
);
