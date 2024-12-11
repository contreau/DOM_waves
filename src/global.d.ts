export {};

declare global {
  type halvedColumns = Array<column>;
  interface column {
    top: HTMLDivElement[];
    bottom: HTMLDivElement[];
  }
}
