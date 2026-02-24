import axios from 'axios';
import { Subscription, SubscriptionCreate, SubscriptionUpdate } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const SubscriptionService = {
  getAll: async (): Promise<Subscription[]> => {
    const response = await apiClient.get<Subscription[]>('/subscriptions');
    return response.data;
  },
  getById: async (id: number): Promise<Subscription> => {
    const response = await apiClient.get<Subscription>(`/subscriptions/${id}`);
    return response.data;
  },
  create: async (data: SubscriptionCreate): Promise<Subscription> => {
    const response = await apiClient.post<Subscription>('/subscriptions', data);
    return response.data;
  },
  update: async (id: number, data: SubscriptionUpdate): Promise<Subscription> => {
    const response = await apiClient.put<Subscription>(`/subscriptions/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/subscriptions/${id}`);
  },
};
