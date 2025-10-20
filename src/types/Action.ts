export interface Action {
  image: string;
  id: number;
  action_type: string;
  description: string;
  extra_field_1?: string;
  extra_field_2?: string;
  image_url: string;
  sort_order?: number;
  url?: string;
}
