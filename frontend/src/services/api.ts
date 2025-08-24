// API base URL - adjust this based on your backend configuration
const API_BASE_URL = 'http://localhost:8000';

// TypeScript interfaces based on backend schemas
export interface UserCreate {
  username: string;
  password: string;
}

export interface AddMoney {
  amount: number;
}

export interface TradeAsset {
  symbol: string;
  quantity: number;
}

export interface Asset {
  symbol: string;
  quantity: number;
  current_price: number;
  total_value: number;
  performance_abs: number;
  performance_rel: number;
}

export interface Portfolio {
  total_added_money: number;
  available_money: number;
  total_value: number;
  performance_abs: number;
  performance_rel: number;
  assets: Asset[];
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface ApiResponse {
  message: string;
}

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token');
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// API service class
export class ApiService {
  // Authentication endpoints
  static async register(userData: UserCreate): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  }

  static async login(username: string, password: string): Promise<LoginResponse> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  }

  // Portfolio management endpoints
  static async addMoney(amount: number): Promise<ApiResponse> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/add_money`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    });
    return handleResponse(response);
  }

  static async getPortfolio(): Promise<Portfolio> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/portfolio`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  }

  // Trading endpoints
  static async buyAsset(symbol: string, quantity: number): Promise<ApiResponse> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ symbol, quantity }),
    });
    return handleResponse(response);
  }

  static async sellAsset(symbol: string, quantity: number): Promise<ApiResponse> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/sell`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ symbol, quantity }),
    });
    return handleResponse(response);
  }
}

// Utility functions for token management
export const setAuthToken = (token: string): void => {
  localStorage.setItem('access_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('access_token');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Export individual functions for convenience
export const {
  register,
  login,
  addMoney,
  getPortfolio,
  buyAsset,
  sellAsset,
} = ApiService;
