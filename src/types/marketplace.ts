
export type MarketplaceProduct = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  image_url: string | null;
  contact_phone: string;
  created_at: string;
  user_id: string | null;
};

export type LocationData = {
  city: string | null;
  state: string | null;
  fullLocation: string | null;
  isCustomSet?: boolean;
};
