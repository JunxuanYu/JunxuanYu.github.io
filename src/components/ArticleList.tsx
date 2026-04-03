import { useState } from 'react';
import type { BlogPost } from '@/types/blog';
import { ArticleCard } from './ArticleCard';
import { FileSearch, Sparkles } from 'lucide-react';
import NoteModal from './NoteModal';

interface ArticleListProps {
  posts: BlogPost[];
  searchQuery: string;
}

export function ArticleList({ posts, searchQuery }: ArticleListProps) {
  const [openNote, setOpenNote] = useState('');

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 animate-bounce-soft">
          <FileSearch className="w-12 h-12 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          没有找到相关文章
        </h3>
        <p className="text-muted-foreground max-w-md">
          {searchQuery ? (
            <>没有找到包含 "<span className="text-primary font-medium">{searchQuery}</span>" 的文章，试试其他关键词吧</>
          ) : (
            '该分类下暂时没有文章，去看看其他分类吧'
          )}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* 结果统计 */}
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-primary" />
        <span className="text-sm text-muted-foreground">
          共找到 <span className="text-primary font-bold">{posts.length}</span> 篇文章
          {searchQuery && (
            <>，关键词："<span className="text-primary font-medium">{searchQuery}</span>"</>
          )}
        </span>
      </div>

      {/* 文章网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => setOpenNote(post.content)}
            className="cursor-pointer"
          >
            <ArticleCard post={post} />
          </div>
        ))}
      </div>

      {/* 笔记弹窗 */}
      {openNote && (
        <NoteModal
          content={openNote}
          onClose={() => setOpenNote('')}
        />
      )}
    </div>
  );
}