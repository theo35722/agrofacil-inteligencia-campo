
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PracticeArticle } from "@/types/bestPractices";

interface PracticeArticleDetailProps {
  article: PracticeArticle;
  onBack: () => void;
}

export const PracticeArticleDetail: React.FC<PracticeArticleDetailProps> = ({ article, onBack }) => {
  return (
    <Card className="agro-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-agro-green-800">
            {article.title}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onBack}
          >
            Voltar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className="bg-agro-green-100 text-agro-green-800 hover:bg-agro-green-200">
            {article.category}
          </Badge>
          {article.tags.map((tag) => (
            <Badge 
              key={tag}
              variant="outline"
              className="text-gray-600"
            >
              {tag}
            </Badge>
          ))}
        </div>
        
        <div 
          className="prose prose-green max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </CardContent>
    </Card>
  );
};
