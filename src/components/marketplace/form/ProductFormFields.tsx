import { useEffect, useState } from "react";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProductImageUpload } from "./ProductImageUpload";
import { useLocationManager } from "@/hooks/use-location-manager";
import { Loader2, MapPin } from "lucide-react";
export function ProductFormFields({
  form,
  existingImageUrl = null
}: {
  form: any;
  existingImageUrl?: string | null;
}) {
  const {
    locationData,
    isLoading: locationLoading
  } = useLocationManager();
  const [imagePreview, setImagePreview] = useState<string | null>(existingImageUrl);

  // Automatically fill location when available
  useEffect(() => {
    if (locationData.fullLocation && !form.getValues("location")) {
      form.setValue("location", locationData.fullLocation);
    }
  }, [locationData.fullLocation, form]);

  // Handle image capture from camera or file upload
  const handleImageCapture = (imageDataUrl: string) => {
    setImagePreview(imageDataUrl);
    form.setValue("image", imageDataUrl);
  };

  // Handle image removal
  const handleImageRemove = () => {
    setImagePreview(null);
    form.setValue("image", null);
  };
  return <div className="space-y-6">
      <div>
        <FormField control={form.control} name="title" render={({
        field
      }) => <div className="space-y-2">
              <Label htmlFor="title">Título do produto <span className="text-red-500">*</span></Label>
              <Input id="title" placeholder="Ex: Trator John Deere 2020" {...field} />
            </div>} />
      </div>

      <div>
        <FormField control={form.control} name="description" render={({
        field
      }) => <div className="space-y-2">
              <Label htmlFor="description">Descrição <span className="text-red-500">*</span></Label>
              <Textarea id="description" placeholder="Descreva o produto em detalhes..." rows={4} {...field} />
            </div>} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField control={form.control} name="price" render={({
        field
      }) => <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) <span className="text-red-500">*</span></Label>
              <Input id="price" type="number" placeholder="0,00" min="0" step="0.01" {...field} value={field.value || ''} />
            </div>} />

        <FormField control={form.control} name="location" render={({
        field
      }) => <div className="space-y-2">
              <Label htmlFor="location">Localização <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input id="location" placeholder="Ex: São Paulo/SP" {...field} className={locationLoading ? "pl-10" : ""} />
                {locationLoading && <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                  </div>}
                {!locationLoading && locationData.fullLocation && <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    
                  </div>}
              </div>
              {locationLoading ? <p className="text-xs text-gray-500">Detectando sua localização...</p> : !locationData.fullLocation ? <p className="text-xs text-gray-500">Não conseguimos detectar sua localização. Preencha manualmente.</p> : null}
            </div>} />
      </div>

      <div>
        <FormField control={form.control} name="contact_phone" render={({
        field
      }) => <div className="space-y-2">
              <Label htmlFor="contact_phone">WhatsApp para contato <span className="text-red-500">*</span></Label>
              <Input id="contact_phone" placeholder="Ex: (11) 98765-4321" {...field} />
              <p className="text-xs text-gray-500">
                Digite o número com DDD. Será usado para criar um link direto para o WhatsApp.
              </p>
            </div>} />
      </div>

      <div>
        <FormField control={form.control} name="image" render={({
        field
      }) => <div className="space-y-2">
              <Label>Foto do produto</Label>
              <ProductImageUpload onChange={field.onChange} value={field.value} existingImageUrl={existingImageUrl} onImageCapture={handleImageCapture} onImageRemove={handleImageRemove} imagePreview={imagePreview} />
            </div>} />
      </div>
    </div>;
}