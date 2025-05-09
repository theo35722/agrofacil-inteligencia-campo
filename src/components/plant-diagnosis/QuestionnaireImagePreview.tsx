
import React from "react";

interface QuestionnaireImagePreviewProps {
  imagePreview: string;
  altText: string;
}

export const QuestionnaireImagePreview: React.FC<QuestionnaireImagePreviewProps> = ({ 
  imagePreview, 
  altText 
}) => {
  return (
    <div className="rounded-lg overflow-hidden border border-green-200">
      <img 
        src={imagePreview} 
        alt={altText} 
        className="w-full object-cover max-h-56"
      />
    </div>
  );
};
