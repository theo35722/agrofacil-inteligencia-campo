
export interface PracticeArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  created_at?: string;
  updated_at?: string;
}
