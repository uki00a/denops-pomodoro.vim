export interface Renderer {
  render(remaining: number): Promise<void>;
}
