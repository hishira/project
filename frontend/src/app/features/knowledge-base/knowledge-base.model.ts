export type ArticleCategory = 'faq' | 'instruction' | 'guide';

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: ArticleCategory;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  author: string;
  views: number;
  helpful: number; // liczba osób, którym artykuł pomógł
}