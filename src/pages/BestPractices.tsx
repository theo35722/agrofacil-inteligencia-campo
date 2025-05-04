
import React, { useState } from "react";
import { practiceArticles } from "@/data/practiceArticles";
import { PracticeArticle } from "@/types/bestPractices";
import { SearchBar } from "@/components/best-practices/SearchBar";
import { PracticeArticleList } from "@/components/best-practices/PracticeArticleList";
import { PracticeArticleDetail } from "@/components/best-practices/PracticeArticleDetail";

const BestPractices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<PracticeArticle | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const categories = Array.from(new Set(practiceArticles.map(a => a.category)));
  
  const filteredArticles = practiceArticles.filter(article => {
    const matchesSearch = searchQuery.trim() === "" || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = activeCategory === "all" || article.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-agro-green-800 mb-2">
          Boas Práticas e Dicas
        </h1>
        <p className="text-gray-600">
          Conteúdo técnico para melhorar sua produção
        </p>
      </div>
      
      <SearchBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />
      
      {selectedArticle ? (
        <PracticeArticleDetail 
          article={selectedArticle} 
          onBack={() => setSelectedArticle(null)} 
        />
      ) : (
        <PracticeArticleList 
          articles={filteredArticles}
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onSelectArticle={setSelectedArticle}
        />
      )}
    </div>
  );
};

export default BestPractices;
