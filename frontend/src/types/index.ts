export interface Event {
  _id: string;
  name: string;
  description: string;
  category: 'Heavy' | 'Track' | 'Field' | 'Piping' | 'Dancing';
  maxCompetitors: number;
  currentCompetitors: number;
  status: 'Open' | 'Full' | 'In Progress' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

export interface Competitor {
  _id: string;
  name: string;
  email: string;
  country: string;
  registeredEvents: string[] | Event[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  message?: string;
}