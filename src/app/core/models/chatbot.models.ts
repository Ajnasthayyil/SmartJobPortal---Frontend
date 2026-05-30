export interface ChatbotNode {
  id: number;
  title: string;
  message: string;
  parentId: number | null;
  routeUrl: string | null;
  displayOrder: number;
}
