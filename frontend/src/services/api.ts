import axios from 'axios';
import type { Event, Competitor, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Event API calls
export const eventAPI = {
  // Get all events
  getAllEvents: async () => {
    const response = await api.get<ApiResponse<Event[]>>('/events');
    return response.data;
  },

  // Get single event
  getEvent: async (id: string) => {
    const response = await api.get<ApiResponse<Event>>(`/events/${id}`);
    return response.data;
  },

  // Create event
  createEvent: async (eventData: Partial<Event>) => {
    const response = await api.post<ApiResponse<Event>>('/events', eventData);
    return response.data;
  },

  // Update event
  updateEvent: async (id: string, eventData: Partial<Event>) => {
    const response = await api.put<ApiResponse<Event>>(`/events/${id}`, eventData);
    return response.data;
  },

  // Delete event
  deleteEvent: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/events/${id}`);
    return response.data;
  },
};

// Competitor API calls
export const competitorAPI = {
  // Get all competitors
  getAllCompetitors: async () => {
    const response = await api.get<ApiResponse<Competitor[]>>('/competitors');
    return response.data;
  },

  // Get single competitor
  getCompetitor: async (id: string) => {
    const response = await api.get<ApiResponse<Competitor>>(`/competitors/${id}`);
    return response.data;
  },

  // Create competitor
  createCompetitor: async (competitorData: Partial<Competitor>) => {
    const response = await api.post<ApiResponse<Competitor>>('/competitors', competitorData);
    return response.data;
  },

  // Update competitor
  updateCompetitor: async (id: string, competitorData: Partial<Competitor>) => {
    const response = await api.put<ApiResponse<Competitor>>(`/competitors/${id}`, competitorData);
    return response.data;
  },

  // Delete competitor
  deleteCompetitor: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/competitors/${id}`);
    return response.data;
  },

  // Register for event
  registerForEvent: async (competitorId: string, eventId: string) => {
    const response = await api.post<ApiResponse<Competitor>>(
      `/competitors/${competitorId}/register/${eventId}`
    );
    return response.data;
  },
};

export default api;