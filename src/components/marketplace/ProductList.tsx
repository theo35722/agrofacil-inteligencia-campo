
import { MarketplaceProduct } from "@/types/marketplace";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
  products: MarketplaceProduct[];
  onContactSeller: (product: MarketplaceProduct) => void;
}

export const ProductList = ({ products, onContactSeller }: ProductListProps) => {
  if (products.length === 0) return null;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onContact={() => onContactSeller(product)}
          />
        ))}
      </div>
    </div>
  );
};
