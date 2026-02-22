// App Info
export const APP_NAME = 'AwaazAI';
export const API_VERSION = 'v1';
export const API_PREFIX = `/api/${API_VERSION}`;

// Status
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  DELETED: 'deleted',
  SUSPENDED: 'suspended',
} as const;

// User Roles
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  ORG_OWNER: 'org_owner',
  ORG_MEMBER: 'org_member',
} as const;

// Subscription Plans
export const PLANS = {
  FREE: 'free',
  BASIC: 'basic',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const;

// Voice Status
export const VOICE_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  READY: 'ready',
  FAILED: 'failed',
} as const;

// Meeting Status (B2B)
export const MEETING_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  ENDED: 'ended',
  CANCELLED: 'cancelled',
} as const;

// Message Types
export const MESSAGE_TYPE = {
  TEXT: 'text',
  AUDIO: 'audio',
  SYSTEM: 'system',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
