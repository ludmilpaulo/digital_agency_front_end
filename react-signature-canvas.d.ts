declare module 'react-signature-canvas' {
  import * as React from 'react';
  export interface SignatureCanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
    penColor?: string;
    backgroundColor?: string;
    onEnd?: () => void;
    onBegin?: () => void;
    canvasProps?: object;
    clearOnResize?: boolean;
    velocityFilterWeight?: number;
    minWidth?: number;
    maxWidth?: number;
    dotSize?: number | (() => number);
    throttle?: number;
    minDistance?: number;
  }
  export default class SignatureCanvas extends React.Component<SignatureCanvasProps> {
    clear(): void;
    isEmpty(): boolean;  // <-- add this line
    getTrimmedCanvas(): HTMLCanvasElement;
    fromDataURL(dataUrl: string, options?: any): void;
    toDataURL(type?: string, encoderOptions?: any): string;
    // Add other methods as needed
  }
}
