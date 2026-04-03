import { Sparkles, BookOpen, Coffee, Star } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-pattern-dots opacity-50" />
      <div className="absolute top-20 right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      
      {/* 浮动装饰元素 */}
      <div className="absolute top-32 left-[10%] text-4xl animate-float" style={{ animationDelay: '0s' }}>
        🌸
      </div>
      <div className="absolute top-48 right-[15%] text-3xl animate-float" style={{ animationDelay: '0.5s' }}>
        ✨
      </div>
      <div className="absolute bottom-20 left-[20%] text-3xl animate-float" style={{ animationDelay: '1s' }}>
        📚
      </div>
      <div className="absolute top-40 right-[25%] text-2xl animate-float" style={{ animationDelay: '1.5s' }}>
        💡
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* 标签 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-bounce-soft">
            <Sparkles className="w-4 h-4" />
            <span>记录学习的每一天</span>
          </div>

          {/* 主标题 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-primary via-rose-400 to-purple-400 bg-clip-text text-transparent">
              Tulip的
            </span>
            <br />
            <span className="text-foreground">学习笔记</span>
          </h1>

          {/* 副标题 */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            在这里记录我的技术成长之路，分享学习心得与生活感悟。
            <br className="hidden sm:block" />
            愿每一篇笔记都能给你带来一点点启发 ✨
          </p>

          {/* 统计卡片 */}
          <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/60 backdrop-blur-sm shadow-lg shadow-primary/5 card-hover">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-foreground">50+</div>
                <div className="text-sm text-muted-foreground">篇文章</div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/60 backdrop-blur-sm shadow-lg shadow-primary/5 card-hover">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center">
                <Coffee className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-foreground">1000+</div>
                <div className="text-sm text-muted-foreground">杯咖啡</div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/60 backdrop-blur-sm shadow-lg shadow-primary/5 card-hover">
              <div className="w-10 h-10 rounded-xl bg-purple-400/20 flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-foreground">365</div>
                <div className="text-sm text-muted-foreground">天坚持</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
