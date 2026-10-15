declare module 'remarkable' {
  export class Remarkable {
    constructor();
    render(markdown: string): string;
  }
}
