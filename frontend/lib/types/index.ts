// ─── Enums ───────────────────────────────────────────────────────────────────
export type UserRole = 'ADMIN' | 'COMERCIAL' | 'TECNICO';
export type QuoteStatus = 'BORRADOR' | 'ENVIADA' | 'APROBADA' | 'RECHAZADA';
export type WorkOrderStatus = 'RECIBIDO' | 'EN_PROCESO' | 'CALIBRADO' | 'LISTO_ENVIO' | 'DESPACHADO';
export type ServiceType = 'PROPIO' | 'TERCERIZADO';
export type EmailRequestStatus = 'PENDIENTE' | 'PROCESADO' | 'DESCARTADO';

// ─── Entities ─────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  companyName: string;
  nit?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  client: Client;
  clientId: string;
  createdBy: User;
  status: QuoteStatus;
  totalValue: number;
  notes?: string;
  pdfUrl?: string;
  validUntil?: string;
  items: QuoteItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Equipment {
  id: string;
  client: Client;
  clientId: string;
  internalCode: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  capacity?: string;
  location?: string;
  receivedAt: string;
  receivedBy?: User;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrder {
  id: string;
  otNumber: string;
  equipment: Equipment;
  equipmentId: string;
  client: Client;
  clientId: string;
  quote?: Quote;
  quoteId?: string;
  assignedTo?: User;
  serviceType: ServiceType;
  status: WorkOrderStatus;
  technicalNotes?: string;
  stickerPrinted: boolean;
  dispatchedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatusHistory {
  id: string;
  workOrderId: string;
  changedBy: User;
  previousStatus?: string;
  newStatus: string;
  notes?: string;
  changedAt: string;
}

export interface EmailRequest {
  id: string;
  rawContent: string;
  extractedData?: Record<string, any>;
  client?: Client;
  status: EmailRequestStatus;
  processedBy?: User;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  user?: User;
  userId?: string;
  action: string;
  resource: string;
  description?: string;
  createdAt: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// ─── API Responses ────────────────────────────────────────────────────────────
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface CreateClientDto {
  companyName: string;
  nit?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  notes?: string;
}

export interface CreateQuoteItemDto {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateQuoteDto {
  clientId: string;
  status?: QuoteStatus;
  notes?: string;
  validUntil?: string;
  items: CreateQuoteItemDto[];
}

export interface CreateEquipmentDto {
  clientId: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  capacity?: string;
  location?: string;
  notes?: string;
}

export interface CreateWorkOrderDto {
  equipmentId: string;
  clientId: string;
  quoteId?: string;
  assignedToId?: string;
  serviceType?: ServiceType;
  technicalNotes?: string;
}

export interface ChangeStatusDto {
  status: WorkOrderStatus;
  notes?: string;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export interface OtStats {
  total: number;
  byStatus: { status: WorkOrderStatus; count: string }[];
}
