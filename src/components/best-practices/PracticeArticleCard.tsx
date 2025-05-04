
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { PracticeArticle } from "@/types/bestPractices";

interface PracticeArticleCardProps {
  article: PracticeArticle;
  onClick: (article: PracticeArticle) => void;
}

export const PracticeArticleCard: React.FC<PracticeArticleCardProps> = ({ article, onClick }) => {
  return (
    <Card 
      className="agro-card cursor-pointer hover:bg-gray-50"
      onClick={() => onClick(article)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-start text-base">
          <FileText className="h-5 w-5 mr-2 text-agro-green-600 mt-0.5 shrink-0" />
          <span className="text-agro-green-800">
            {article.title}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm mb-3">
          {article.summary}
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-agro-green-100 text-agro-green-800 hover:bg-agro-green-200">
            {article.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
