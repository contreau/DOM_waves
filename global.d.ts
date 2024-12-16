export {};

declare global {
  type ColumnList = Array<column>;
  interface column {
    top: HTMLDivElement[];
    bottom: HTMLDivElement[];
  }
}
