const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003/api';

// Token management
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function setToken(token: string): void {
  localStorage.setItem('token', token);
}

export function removeToken(): void {
  localStorage.removeItem('token');
}

// API request helper
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || 'Request failed');
  }

  // Handle empty responses (204 No Content, or empty body)
  const text = await response.text();
  if (!text) {
    return undefined as T;
  }
  return JSON.parse(text);
}

// Auth API
export const auth = {
  register: (data: { email: string; password: string; name: string }) =>
    request<{ access_token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () => request<{ id: string; email: string; name: string }>('/auth/me'),
};

// Projects API
export const projects = {
  list: () => request<{ projects: Project[]; total: number }>('/projects/'),

  get: (id: string) => request<Project>(`/projects/${id}`),

  create: (data: { name: string; description?: string; migration_type: string }) =>
    request<Project>('/projects/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Project>) =>
    request<Project>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<void>(`/projects/${id}`, { method: 'DELETE' }),
};

// Connections API
export const connections = {
  list: () => request<{ connections: Connection[]; total: number }>('/connections/'),

  get: (id: string) => request<Connection>(`/connections/${id}`),

  create: (data: ConnectionCreate) =>
    request<Connection>('/connections/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  test: (data: ConnectionCreate) =>
    request<{ success: boolean; message: string }>('/connections/test', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  testSaved: (id: string) =>
    request<{ success: boolean; message: string }>(`/connections/${id}/test`, {
      method: 'POST',
    }),

  delete: (id: string) =>
    request<void>(`/connections/${id}`, { method: 'DELETE' }),
};

// Analysis API
export const analysis = {
  quick: (connectionId: string) =>
    request<AnalysisResult>('/analysis/quick', {
      method: 'POST',
      body: JSON.stringify({ connection_id: connectionId }),
    }),

  run: (projectId: string, connectionId: string) =>
    request<Analysis>(`/analysis/run/${projectId}`, {
      method: 'POST',
      body: JSON.stringify({ connection_id: connectionId }),
    }),

  get: (id: string) => request<Analysis>(`/analysis/${id}`),

  getTables: (id: string) => request<{ tables: Table[] }>(`/analysis/${id}/tables`),

  getRisks: (id: string) =>
    request<{ risks: Risk[]; summary: { errors: number; warnings: number; info: number } }>(
      `/analysis/${id}/risks`
    ),

  listForProject: (projectId: string) =>
    request<Analysis[]>(`/analysis/project/${projectId}`),
};

// Types
export interface Project {
  id: string;
  name: string;
  description: string | null;
  migration_type: 'mssql_to_snowflake' | 'mysql_to_snowflake' | 'postgres_to_snowflake';
  status: string;
  owner_id: string;
  source_connection_id: string | null;
  target_connection_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Connection {
  id: string;
  name: string;
  db_type: 'mssql' | 'mysql' | 'postgres' | 'snowflake';
  host: string;
  port: number;
  database: string;
  username: string;
  ssl_enabled: boolean;
  warehouse: string | null;
  schema_name: string | null;
  role: string | null;
  is_tested: boolean;
  last_tested_at: string | null;
  created_at: string;
}

export interface ConnectionCreate {
  name: string;
  db_type: 'mssql' | 'mysql' | 'postgres' | 'snowflake';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl_enabled: boolean;
  warehouse?: string;
  schema_name?: string;
  role?: string;
}

export interface Analysis {
  id: string;
  project_id: string;
  connection_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  tables_count: number;
  total_rows: number;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  schema_data?: {
    database: string;
    db_type: string;
    tables: Table[];
  };
  risks?: Risk[];
}

export interface AnalysisResult {
  success: boolean;
  database?: string;
  db_type?: string;
  tables_count: number;
  total_rows: number;
  tables: Table[];
  risks: Risk[];
  error?: string;
}

export interface Table {
  name: string;
  type: string;
  row_count: number;
  columns: Column[];
  indexes: Index[];
  has_primary_key: boolean;
}

export interface Column {
  name: string;
  data_type: string;
  nullable: boolean;
  default: string | null;
}

export interface Index {
  name: string;
  unique: boolean;
  columns: string[];
}

export interface Risk {
  table: string;
  column: string | null;
  type: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
}
