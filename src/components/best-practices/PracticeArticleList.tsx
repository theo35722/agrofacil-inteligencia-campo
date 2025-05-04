
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PracticeArticleCard } from "./PracticeArticleCard";
import { PracticeArticle } from "@/types/bestPractices";

interface PracticeArticleListProps {
  articles: PracticeArticle[];
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  onSelectArticle: (article: PracticeArticle) => void;
}

export const PracticeArticleList: React.FC<PracticeArticleListProps> = ({
  articles,
  categories,
  activeCategory,
  setActiveCategory,
  onSelectArticle
}) => {
  return (
    <Tabs defaultValue="all" onValueChange={setActiveCategory}>
      <TabsList className="mb-4">
        <TabsTrigger value="all">Todos</TabsTrigger>
        {categories.map((category) => (
          <TabsTrigger key={category} value={category}>
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContent value={activeCategory}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.length === 0 ? (
            <p className="text-gray-500 col-span-2 text-center py-8">
              Nenhum artigo encontrado com os critérios de pesquisa.
            </p>
          ) : (
            articles.map((article) => (
              <PracticeArticleCard
                key={article.id}
                article={article}
                onClick={onSelectArticle}
              />
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};
