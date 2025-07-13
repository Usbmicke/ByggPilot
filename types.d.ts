// TypeScript declarations for ByggPilot app

declare module 'react' {
  export = React;
  export as namespace React;
}

declare module 'react/jsx-runtime' {
  export = React;
  export as namespace React;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_FIREBASE_API_KEY?: string;
      REACT_APP_FIREBASE_AUTH_DOMAIN?: string;
      REACT_APP_FIREBASE_PROJECT_ID?: string;
      REACT_APP_FIREBASE_STORAGE_BUCKET?: string;
      REACT_APP_FIREBASE_MESSAGING_SENDER_ID?: string;
      REACT_APP_FIREBASE_APP_ID?: string;
      GOOGLE_API_KEY?: string;
      NEXT_PUBLIC_GOOGLE_API_KEY?: string;
    }
  }
} 