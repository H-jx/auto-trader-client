
import '@umijs/max/typings';

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}