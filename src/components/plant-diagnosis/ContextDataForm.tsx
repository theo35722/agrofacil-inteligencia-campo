
import React from "react";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useGeolocation } from "@/hooks/use-geolocation";

export interface ContextData {
  plantType: string;
  symptoms: string;
  locationData?: {
    latitude: number | null;
    longitude: number | null;
  };
}

interface ContextDataFormProps {
  imagePreview: string;
  onSubmit: (data: ContextData) => void;
  onBack: () => void;
}

export const ContextDataForm: React.FC<ContextDataFormProps> = ({ 
  imagePreview, 
  onSubmit, 
  onBack 
}) => {
  const location = useGeolocation();
  const form = useForm<ContextData>({
    defaultValues: {
      plantType: "",
      symptoms: "",
    },
  });

  const handleSubmit = (data: ContextData) => {
    // Add location data if available
    if (!location.error && location.latitude && location.longitude) {
      data.locationData = {
        latitude: location.latitude,
        longitude: location.longitude
      };
    }
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg overflow-hidden border border-agro-green-200">
        <img 
          src={imagePreview} 
          alt="Prévia da imagem" 
          className="w-full object-cover max-h-56"
        />
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="plantType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de cultura</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a cultura" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="soja">Soja</SelectItem>
                    <SelectItem value="milho">Milho</SelectItem>
                    <SelectItem value="algodao">Algodão</SelectItem>
                    <SelectItem value="cafe">Café</SelectItem>
                    <SelectItem value="cana">Cana-de-açúcar</SelectItem>
                    <SelectItem value="trigo">Trigo</SelectItem>
                    <SelectItem value="feijao">Feijão</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="symptoms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sintomas observados</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva os sintomas que você observa (ex: manchas amarelas, folhas secas, etc.)"
                    className="resize-none h-24"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="pt-2 flex gap-2 justify-between">
            <Button 
              type="button"
              variant="outline"
              onClick={onBack}
            >
              Voltar
            </Button>
            <Button 
              type="submit" 
              className="bg-agro-green-500 hover:bg-agro-green-600"
            >
              Analisar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
