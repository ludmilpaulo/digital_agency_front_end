// types.d.ts
import { i18n } from "i18next";
import '@emotion/react';
import { CSSProp } from '@emotion/react';

// i18next extensions
declare module "react-i18next" {
  interface CustomI18NextProps {
    i18n: i18n;
  }
}

// Emotion extensions
declare module 'react' {
  interface Attributes {
    css?: CSSProp;
  }
}

// Ensure Emotion accepts 'css' on HTMLAttributes as well.
declare module '@emotion/react' {
  export interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: InterpolationWithTheme<Theme>;
  }
}