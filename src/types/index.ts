export type CategoryType = 
  | 'ALL'
  | '就業與津貼' 
  | '職業訓練' 
  | '就學與進修' 
  | '考試與公營名冊' 
  | '眷屬權益';

export interface SearchFilter {
  keyword: string;
  category: CategoryType;
}

export interface Bookmark {
  regulationId: string;
  articleTitle: string;
}
