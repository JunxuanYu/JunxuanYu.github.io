export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  date: string;
  readTime: string;
  coverImage?: string;
  likes: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
}
