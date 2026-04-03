import { Heart, Github, Twitter, Mail, Coffee } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 pt-16 pb-8 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute top-10 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* 品牌 */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-rose-400 flex items-center justify-center shadow-lg shadow-primary/30">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-rose-400 bg-clip-text text-transparent">
                Tulip的笔记
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              记录学习的每一天，分享成长的每一步。
              <br />
              愿我们都能成为更好的自己 ✨
            </p>
          </div>

          {/* 快速链接 */}
          <div className="text-center">
            <h4 className="font-bold text-foreground mb-4">快速链接</h4>
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                首页
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                前端开发
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                算法学习
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                生活随笔
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                关于我
              </a>
            </nav>
          </div>

          {/* 社交链接 */}
          <div className="text-center md:text-right">
            <h4 className="font-bold text-foreground mb-4">关注我</h4>
            <div className="flex items-center justify-center md:justify-end gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all shadow-lg shadow-primary/5"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all shadow-lg shadow-primary/5"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all shadow-lg shadow-primary/5"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all shadow-lg shadow-primary/5"
              >
                <Coffee className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* 分隔线 */}
        <div className="border-t border-primary/10 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse-soft" />
            <span>by Tulip</span>
            <span className="hidden sm:inline">·</span>
            <span>© {currentYear} Tulip的学习笔记</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
