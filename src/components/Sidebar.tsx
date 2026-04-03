import { categories } from '@/data/blogData';
import { TrendingUp, Tag, Sparkles } from 'lucide-react';

interface SidebarProps {
  onCategorySelect: (category: string | null) => void;
  selectedCategory: string | null;
}

export function Sidebar({ onCategorySelect, selectedCategory }: SidebarProps) {
  const popularTags = ['React', 'TypeScript', '算法', '生活', '成长', '效率', 'Git', 'CSS'];

  return (
    <aside className="space-y-6">
      {/* 关于我 */}
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg shadow-primary/5 border border-primary/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-rose-400 flex items-center justify-center text-3xl shadow-lg shadow-primary/30">
            👩‍💻
          </div>
          <div>
            <h3 className="font-bold text-foreground">Tulip</h3>
            <p className="text-sm text-muted-foreground">前端开发者</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          热爱技术，热爱生活。在这里记录我的学习成长之路，希望能给你带来一点点启发 ✨
        </p>
      </div>

      {/* 分类 */}
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg shadow-primary/5 border border-primary/5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground">文章分类</h3>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => onCategorySelect(null)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
              selectedCategory === null
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'hover:bg-primary/10 text-foreground'
            }`}
          >
            <span className="flex items-center gap-2">
              <span>📁</span>
              <span className="font-medium">全部文章</span>
            </span>
            <span className={`text-sm ${selectedCategory === null ? 'text-white/80' : 'text-muted-foreground'}`}>
              50
            </span>
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.name)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                selectedCategory === category.name
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'hover:bg-primary/10 text-foreground'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </span>
              <span className={`text-sm ${selectedCategory === category.name ? 'text-white/80' : 'text-muted-foreground'}`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 热门标签 */}
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg shadow-primary/5 border border-primary/5">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground">热门标签</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <span
              key={tag}
              className="tag-cute cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 每日一句 */}
      <div className="bg-gradient-to-br from-primary/20 to-rose-400/20 rounded-3xl p-6 border border-primary/10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground">每日一句</h3>
        </div>
        <p className="text-sm text-foreground/80 italic leading-relaxed">
          "学习不是为了某一刻的熠熠生辉，而是为了人生的每个时刻都有自己的底气。"
        </p>
      </div>
    </aside>
  );
}
