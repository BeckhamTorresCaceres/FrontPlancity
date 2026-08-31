export interface EventCategory {
  id: string;
  name: string;
}

export interface EventImage {
  id?: string;
  url: string;
  order?: number;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  categoryId: string;
  category?: EventCategory;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventDto {
  name: string;
  description: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  categoryId: string;
  images?: string[];
}

export type UpdateEventDto = Partial<CreateEventDto>;

export interface EventQueryParams {
  search?: string;
  categoryId?: string;
}
