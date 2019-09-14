export interface ITemplate {
  render(templateData: { [key: string]: any }): void;
  isExistDestFile(): boolean;
}
