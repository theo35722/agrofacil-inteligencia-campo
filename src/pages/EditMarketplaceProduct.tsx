
import { useParams } from "react-router-dom";
import { EditProductForm } from "@/components/marketplace/EditProductForm";

const EditMarketplaceProduct = () => {
  const { productId } = useParams();

  if (!productId) {
    return <div className="max-w-2xl mx-auto p-4">ID do produto é necessário</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <EditProductForm productId={productId} />
    </div>
  );
};

export default EditMarketplaceProduct;
