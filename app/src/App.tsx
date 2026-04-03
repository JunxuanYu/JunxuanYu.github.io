import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ArticleList } from '@/components/ArticleList';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { blogPosts } from '@/data/blogData';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 过滤文章
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      // 分类过滤
      if (selectedCategory && post.category !== selectedCategory) {
        return false;
      }
      // 搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 背景图案 */}
      <div className="fixed inset-0 bg-pattern-hearts opacity-30 pointer-events-none" />
      
      {/* Header */}
      <Header
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
      />

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <Hero />

        {/* Content Section */}
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 文章列表 */}
              <div className="lg:col-span-2">
                <ArticleList posts={filteredPosts} searchQuery={searchQuery} />
              </div>

              {/* 侧边栏 */}
              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <Sidebar
                    onCategorySelect={handleCategoryChange}
                    selectedCategory={selectedCategory}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 移动端侧边栏 */}
        <section className="lg:hidden py-8 border-t border-primary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Sidebar
              onCategorySelect={handleCategoryChange}
              selectedCategory={selectedCategory}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
