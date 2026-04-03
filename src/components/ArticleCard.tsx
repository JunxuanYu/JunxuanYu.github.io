import { useState } from 'react';
import { Calendar, Clock, Heart, ArrowRight } from 'lucide-react';
import type { BlogPost } from '@/types/blog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ArticleCardProps {
  post: BlogPost;
}

export function ArticleCard({ post }: ArticleCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const categoryColors: Record<string, string> = {
    '前端开发': 'bg-pink-100 text-pink-600',
    '后端技术': 'bg-emerald-100 text-emerald-600',
    '算法学习': 'bg-amber-100 text-amber-600',
    '读书笔记': 'bg-purple-100 text-purple-600',
    '生活随笔': 'bg-orange-100 text-orange-600',
    '工具分享': 'bg-blue-100 text-blue-600',
  };

  return (
    <>
      <article
        onClick={() => setIsOpen(true)}
        className="group bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg shadow-primary/5 cursor-pointer card-hover border border-primary/5"
      >
        {/* 分类标签 */}
        <div className="flex items-center justify-between mb-4">
          <Badge
            variant="secondary"
            className={`${categoryColors[post.category] || 'bg-gray-100 text-gray-600'} rounded-full px-3 py-1 font-medium`}
          >
            {post.category}
          </Badge>
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              isLiked
                ? 'bg-rose-100 text-rose-500'
                : 'bg-muted text-muted-foreground hover:bg-rose-50 hover:text-rose-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{likes}</span>
          </button>
        </div>

        {/* 标题 */}
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>

        {/* 摘要 */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 底部信息 */}
        <div className="flex items-center justify-between pt-4 border-t border-primary/10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            阅读更多
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </article>

      {/* 文章详情弹窗 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden rounded-3xl">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center gap-2 mb-3">
              <Badge
                variant="secondary"
                className={`${categoryColors[post.category] || 'bg-gray-100 text-gray-600'} rounded-full px-3 py-1 font-medium`}
              >
                {post.category}
              </Badge>
            </div>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {post.title}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh]">
            <div className="p-6 pt-4">
              {/* 文章元信息 */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 pb-4 border-b border-primary/10">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
                    isLiked
                      ? 'bg-rose-100 text-rose-500'
                      : 'bg-muted text-muted-foreground hover:bg-rose-50 hover:text-rose-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="font-medium">{likes}</span>
                </button>
              </div>

              {/* 文章内容 */}
              <div className="prose prose-sm max-w-none">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {post.excerpt}
                </p>
                <div className="text-foreground leading-relaxed whitespace-pre-line">
                  {post.content}
                  <p className="mt-4">
                    （这是一篇示例文章，实际内容会更加丰富详细。在这里你可以记录你的学习心得、技术分享、生活感悟等等。）
                  </p>
                  <p className="mt-4">
                    学习是一个持续的过程，每一天的进步都值得被记录。希望这篇笔记能对你有所帮助！
                  </p>
                </div>
              </div>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mt-8 pt-4 border-t border-primary/10">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
