import axios from 'axios';
import type { Event, Competitor, ApiResponse } from '../types';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Event API calls
export const eventAPI = {
  getAllEvents: async (): Promise<Event[]> => {
    const response = await api.get<ApiResponse<Event[]>>('/events');
    return response.data.data;
  },

  getEvent: async (id: string): Promise<Event> => {
    const response = await api.get<ApiResponse<Event>>(`/events/${id}`);
    return response.data.data;
  },

  createEvent: async (eventData: Partial<Event>): Promise<Event> => {
    const response = await api.post<ApiResponse<Event>>('/events', eventData);
    return response.data.data;
  },

  updateEvent: async (id: string, eventData: Partial<Event>): Promise<Event> => {
    const response = await api.put<ApiResponse<Event>>(`/events/${id}`, eventData);
    return response.data.data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/events/${id}`);
  },
};

// Competitor API calls
export const competitorAPI = {
  getAllCompetitors: async (): Promise<Competitor[]> => {
    const response = await api.get<ApiResponse<Competitor[]>>('/competitors');
    return response.data.data;
  },

  getCompetitor: async (id: string): Promise<Competitor> => {
    const response = await api.get<ApiResponse<Competitor>>(`/competitors/${id}`);
    return response.data.data;
  },

  createCompetitor: async (competitorData: Partial<Competitor>): Promise<Competitor> => {
    const response = await api.post<ApiResponse<Competitor>>('/competitors', competitorData);
    return response.data.data;
  },

  updateCompetitor: async (id: string, competitorData: Partial<Competitor>): Promise<Competitor> => {
    const response = await api.put<ApiResponse<Competitor>>(`/competitors/${id}`, competitorData);
    return response.data.data;
  },

  deleteCompetitor: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/competitors/${id}`);
  },

  registerForEvent: async (competitorId: string, eventId: string): Promise<Competitor> => {
    const response = await api.post<ApiResponse<Competitor>>(
      `/competitors/${competitorId}/register/${eventId}`
    );
    return response.data.data;
  },
};

export default api;