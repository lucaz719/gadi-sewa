export type UserRole = 'garage' | 'vendor' | 'customer' | 'admin';

export interface AuthUser {
  id?: number;
  role: UserRole;
  enterprise_id?: number | null;
  [key: string]: unknown;
}

interface AuthSession {
  user: AuthUser;
  csrfToken: string | null;
  issuedAt: number;
  expiresAt: number | null;
  refreshExpiresAt: number | null;
  accessToken?: string | null;
}

const AUTH_SESSION_KEY = 'gadisewa_auth_session';
const LEGACY_TOKEN_KEY = 'gadisewa_auth_token';
const LEGACY_USER_KEY = 'gadisewa_auth_user';
export const AUTH_CHANGE_EVENT = 'gadisewa-auth-changed';

const VALID_ROLES: UserRole[] = ['garage', 'vendor', 'customer', 'admin'];

const isBrowser = () => typeof window !== 'undefined';

const getStorage = () => (isBrowser() ? window.sessionStorage : null);

const emitAuthChange = () => {
  if (isBrowser()) {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
};

const removeLegacySession = () => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(LEGACY_TOKEN_KEY);
  window.localStorage.removeItem(LEGACY_USER_KEY);
};

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  const [, payload] = token.split('.');
  if (!payload || !isBrowser()) return null;

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return JSON.parse(window.atob(padded));
  } catch {
    return null;
  }
};

const isValidRole = (value: unknown): value is UserRole =>
  typeof value === 'string' && VALID_ROLES.includes(value as UserRole);

const normalizeUser = (value: unknown): AuthUser | null => {
  if (!value || typeof value !== 'object') return null;
  const role = (value as Record<string, unknown>).role;
  return isValidRole(role) ? value as AuthUser : null;
};

const toTimestamp = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const resolveAccessExpiry = (value?: unknown, fallbackToken?: string | null) => {
  const timestamp = toTimestamp(value);
  if (timestamp) return timestamp;

  if (fallbackToken) {
    const exp = decodeJwtPayload(fallbackToken)?.exp;
    if (typeof exp === 'number' && Number.isFinite(exp) && exp > 0) {
      return exp * 1000;
    }
  }

  return null;
};

const parseStoredSession = (rawSession: string | null): AuthSession | null => {
  if (!rawSession) return null;

  try {
    const parsed = JSON.parse(rawSession) as AuthSession;
    const user = normalizeUser(parsed.user);
    if (!user) return null;

    return {
      user,
      csrfToken: typeof parsed.csrfToken === 'string' ? parsed.csrfToken : null,
      issuedAt: typeof parsed.issuedAt === 'number' ? parsed.issuedAt : Date.now(),
      expiresAt: toTimestamp(parsed.expiresAt),
      refreshExpiresAt: toTimestamp(parsed.refreshExpiresAt),
      accessToken: typeof parsed.accessToken === 'string' ? parsed.accessToken : null,
    };
  } catch {
    return null;
  }
};

const migrateLegacySession = (): AuthSession | null => {
  if (!isBrowser()) return null;

  const legacyToken = window.localStorage.getItem(LEGACY_TOKEN_KEY);
  const legacyUserRaw = window.localStorage.getItem(LEGACY_USER_KEY);
  if (!legacyToken || !legacyUserRaw) {
    removeLegacySession();
    return null;
  }

  try {
    const user = normalizeUser(JSON.parse(legacyUserRaw));
    if (!user) {
      removeLegacySession();
      return null;
    }

    const session: AuthSession = {
      user,
      csrfToken: null,
      issuedAt: Date.now(),
      expiresAt: resolveAccessExpiry(undefined, legacyToken),
      refreshExpiresAt: null,
      accessToken: legacyToken,
    };
    getStorage()?.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    removeLegacySession();
    return session;
  } catch {
    removeLegacySession();
    return null;
  }
};

const persistSession = (session: AuthSession | null) => {
  const storage = getStorage();
  if (!storage) return;
  if (session) storage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  else storage.removeItem(AUTH_SESSION_KEY);
};

const isRefreshExpired = (session: AuthSession) =>
  typeof session.refreshExpiresAt === 'number' && session.refreshExpiresAt <= Date.now();

export const auth = {
  setSession: (payload: {
    user: unknown;
    csrf_token?: string | null;
    expires_at?: string | number | null;
    refresh_expires_at?: string | number | null;
    access_token?: string | null;
  }) => {
    const user = normalizeUser(payload.user);
    if (!getStorage() || !user) {
      throw new Error('Invalid authentication response.');
    }

    const session: AuthSession = {
      user,
      csrfToken: typeof payload.csrf_token === 'string' ? payload.csrf_token : null,
      issuedAt: Date.now(),
      expiresAt: resolveAccessExpiry(payload.expires_at, payload.access_token || null),
      refreshExpiresAt: toTimestamp(payload.refresh_expires_at),
      accessToken: typeof payload.access_token === 'string' ? payload.access_token : null,
    };

    persistSession(session);
    removeLegacySession();
    emitAuthChange();
    return session;
  },

  updateCsrfToken: (csrfToken: string | null) => {
    const session = auth.getSession();
    if (!session) return null;
    const nextSession = { ...session, csrfToken };
    persistSession(nextSession);
    emitAuthChange();
    return nextSession;
  },

  clearSession: () => {
    persistSession(null);
    removeLegacySession();
    emitAuthChange();
  },

  getSession: () => {
    const session = parseStoredSession(getStorage()?.getItem(AUTH_SESSION_KEY) || null) || migrateLegacySession();
    if (!session) return null;
    if (isRefreshExpired(session)) {
      auth.clearSession();
      return null;
    }
    return session;
  },

  getUser: () => auth.getSession()?.user || null,
  getCsrfToken: () => auth.getSession()?.csrfToken || null,
  getAccessToken: () => auth.getSession()?.accessToken || null,
  needsRefresh: () => {
    const expiresAt = auth.getSession()?.expiresAt;
    return typeof expiresAt === 'number' && expiresAt <= Date.now() + 60_000;
  },

  isAllowedRole: (role: unknown, allowedRoles?: UserRole[]) =>
    isValidRole(role) && (!allowedRoles?.length || allowedRoles.includes(role)),

  getDefaultRouteForRole: (role?: string | null) => {
    if (role === 'vendor') return '/vendor';
    if (role === 'customer') return '/portal';
    if (role === 'admin') return '/admin';
    return '/dashboard';
  },
};
