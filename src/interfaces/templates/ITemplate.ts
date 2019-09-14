export interface ITemplate {
  render(templateData?: { [key: string]: any; force?: boolean }): Promise<void>;
  isExistDestFile(): boolean;
}
