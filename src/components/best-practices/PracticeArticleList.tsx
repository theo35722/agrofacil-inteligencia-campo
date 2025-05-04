
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PracticeArticleCard } from "./PracticeArticleCard";
import { PracticeArticle } from "@/types/bestPractices";
import { Skeleton } from "@/components/ui/skeleton";

interface PracticeArticleListProps {
  articles: PracticeArticle[];
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  onSelectArticle: (article: PracticeArticle) => void;
  isLoading?: boolean;
}

export const PracticeArticleList: React.FC<PracticeArticleListProps> = ({
  articles,
  categories,
  activeCategory,
  setActiveCategory,
  onSelectArticle,
  isLoading = false
}) => {
  return (
    <Tabs defaultValue="all" onValueChange={setActiveCategory} value={activeCategory}>
      <TabsList className="mb-4">
        <TabsTrigger value="all">Todos</TabsTrigger>
        {categories.map((category) => (
          <TabsTrigger key={category} value={category}>
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContent value={activeCategory}>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="p-4 border rounded-md">
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <p className="text-gray-500 col-span-2 text-center py-8">
            Nenhum artigo encontrado com os critérios de pesquisa.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map((article) => (
              <PracticeArticleCard
                key={article.id}
                article={article}
                onClick={onSelectArticle}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
