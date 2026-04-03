import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ArticleList } from '@/components/ArticleList';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { blogPosts } from '@/data/blogData';
import NotesList from './components/NotesList'; // 👈 只加这一行

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      if (selectedCategory && post.category !== selectedCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.tags.some(tag => tag.toLowerCase().includes(q))
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
      <div className="fixed inset-0 bg-pattern-hearts opacity-30 pointer-events-none" />
      
      <Header
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
      />

      <main className="relative">
        <Hero />
        
        {/* ✅ 笔记区域（放在这里最完美） */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <NotesList />
          </div>
        </section>

        {/* 你的原有博客 */}
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ArticleList posts={filteredPosts} searchQuery={searchQuery} />
              </div>
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

        <section className="lg:hidden py-8 border-t border-primary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Sidebar
              onCategorySelect={handleCategoryChange}
              selectedCategory={selectedCategory}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;