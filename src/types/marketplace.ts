export interface MarketplaceProduct {
  id: string;
  created_at: string;
  title: string;
  description: string;
  price: number;
  location: string;
  contact_phone: string;
  image_url: string | null;
  user_id: string;
}

// Location data type
export interface LocationData {
  city: string | null;
  state: string | null;
  fullLocation: string | null;
}
