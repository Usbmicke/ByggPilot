// src/globals.d.ts

// Detta talar om för TypeScript hur man hanterar CSS-modulimporter.
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
