
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MapPin } from "lucide-react";

interface ProductFormFieldsProps {
  formData: {
    title: string;
    description: string;
    price: string;
    location: string;
    contact_phone: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  locationLoading?: boolean;
  locationError?: string | null;
}

export const ProductFormFields = ({ 
  formData, 
  handleChange,
  locationLoading = false,
  locationError = null
}: ProductFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Nome do Produto*</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Ex: Milho orgânico"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Descrição do Produto*</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Descreva detalhes como qualidade, quantidade, etc."
          className="min-h-[120px]"
        />
      </div>
      
      <div>
        <Label htmlFor="price">Preço (R$)*</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={handleChange}
          required
          placeholder="Ex: 29.90"
        />
      </div>
      
      <div>
        <Label htmlFor="location">Localização*</Label>
        <div className="relative">
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Ex: São Paulo, SP"
            className="pr-8"
          />
          {locationLoading && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 size={16} className="animate-spin text-muted-foreground" />
            </span>
          )}
        </div>
        {locationError && !formData.location && (
          <p className="text-sm mt-1 text-muted-foreground flex items-center gap-1">
            <MapPin size={14} />
            Não conseguimos detectar sua cidade. Preencha manualmente.
          </p>
        )}
      </div>
      
      <div>
        <Label htmlFor="contact_phone">WhatsApp para Contato*</Label>
        <Input
          id="contact_phone"
          name="contact_phone"
          value={formData.contact_phone}
          onChange={handleChange}
          required
          placeholder="Ex: (11) 98765-4321"
        />
      </div>
    </div>
  );
};
