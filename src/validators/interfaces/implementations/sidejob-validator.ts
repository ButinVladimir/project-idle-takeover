export interface ISidejobValidator {
  validateSidejobTitle(name: string): boolean;
  validateSidejobOverview(name: string): boolean;
}
