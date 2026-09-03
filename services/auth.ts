export type UserRole = 'garage' | 'vendor' | 'customer' | 'admin';

export interface AuthUser {
  role: UserRole;
  enterprise_id?: number | null;
  [key: string]: unknown;
}

interface AuthSession {
  accessToken: string;
  user: AuthUser;
  issuedAt: number;
  expiresAt: number | null;
}

const AUTH_SESSION_KEY = 'gadisewa_auth_session';
const LEGACY_TOKEN_KEY = 'gadisewa_auth_token';
const LEGACY_USER_KEY = 'gadisewa_auth_user';
export const AUTH_CHANGE_EVENT = 'gadisewa-auth-changed';

const VALID_ROLES: UserRole[] = ['garage', 'vendor', 'customer', 'admin'];

const isBrowser = () => typeof window !== 'undefined';

const getStorage = () => {
  if (!isBrowser()) {
    return null;
  }

  return window.sessionStorage;
};

const emitAuthChange = () => {
  if (isBrowser()) {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
};

const removeLegacySession = () => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(LEGACY_TOKEN_KEY);
  window.localStorage.removeItem(LEGACY_USER_KEY);
};

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  const [, payload] = token.split('.');

  if (!payload || !isBrowser()) {
    return null;
  }

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const decoded = window.atob(padded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const isValidRole = (value: unknown): value is UserRole =>
  typeof value === 'string' && VALID_ROLES.includes(value as UserRole);

const normalizeUser = (value: unknown): AuthUser | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const role = (value as Record<string, unknown>).role;
  if (!isValidRole(role)) {
    return null;
  }

  return value as AuthUser;
};

const resolveExpiresAt = (accessToken: string, expiresIn?: number | null) => {
  if (typeof expiresIn === 'number' && Number.isFinite(expiresIn) && expiresIn > 0) {
    return Date.now() + expiresIn * 1000;
  }

  const payload = decodeJwtPayload(accessToken);
  const exp = payload?.exp;

  if (typeof exp === 'number' && Number.isFinite(exp) && exp > 0) {
    return exp * 1000;
  }

  return null;
};

const isExpired = (session: AuthSession) =>
  typeof session.expiresAt === 'number' && session.expiresAt <= Date.now();

const parseStoredSession = (rawSession: string | null): AuthSession | null => {
  if (!rawSession) {
    return null;
  }

  try {
    const session = JSON.parse(rawSession) as AuthSession;
    if (!session?.accessToken || !normalizeUser(session.user)) {
      return null;
    }

    return {
      accessToken: session.accessToken,
      user: session.user,
      issuedAt: typeof session.issuedAt === 'number' ? session.issuedAt : Date.now(),
      expiresAt: typeof session.expiresAt === 'number' ? session.expiresAt : null,
    };
  } catch {
    return null;
  }
};

const migrateLegacySession = (): AuthSession | null => {
  if (!isBrowser()) {
    return null;
  }

  const legacyToken = window.localStorage.getItem(LEGACY_TOKEN_KEY);
  const legacyUserRaw = window.localStorage.getItem(LEGACY_USER_KEY);

  if (!legacyToken || !legacyUserRaw) {
    removeLegacySession();
    return null;
  }

  try {
    const legacyUser = normalizeUser(JSON.parse(legacyUserRaw));
    if (!legacyUser) {
      removeLegacySession();
      return null;
    }

    const session: AuthSession = {
      accessToken: legacyToken,
      user: legacyUser,
      issuedAt: Date.now(),
      expiresAt: resolveExpiresAt(legacyToken),
    };

    getStorage()?.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    removeLegacySession();
    return session;
  } catch {
    removeLegacySession();
    return null;
  }
};

export const auth = {
  setSession: (payload: { access_token: string; user: unknown; expires_in?: number | null }) => {
    const storage = getStorage();
    const user = normalizeUser(payload.user);

    if (!storage || !payload.access_token || !user) {
      throw new Error('Invalid authentication response.');
    }

    const session: AuthSession = {
      accessToken: payload.access_token,
      user,
      issuedAt: Date.now(),
      expiresAt: resolveExpiresAt(payload.access_token, payload.expires_in),
    };

    storage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    removeLegacySession();
    emitAuthChange();
    return session;
  },

  clearSession: () => {
    getStorage()?.removeItem(AUTH_SESSION_KEY);
    removeLegacySession();
    emitAuthChange();
  },

  getSession: () => {
    const storage = getStorage();
    const storedSession = parseStoredSession(storage?.getItem(AUTH_SESSION_KEY) || null) || migrateLegacySession();

    if (!storedSession) {
      return null;
    }

    if (isExpired(storedSession)) {
      auth.clearSession();
      return null;
    }

    return storedSession;
  },

  getUser: () => auth.getSession()?.user || null,

  getAccessToken: () => auth.getSession()?.accessToken || null,

  isAllowedRole: (role: unknown, allowedRoles?: UserRole[]) =>
    isValidRole(role) && (!allowedRoles?.length || allowedRoles.includes(role)),

  getDefaultRouteForRole: (role?: string | null) => {
    if (role === 'vendor') return '/vendor';
    if (role === 'customer') return '/portal';
    if (role === 'admin') return '/admin';
    return '/dashboard';
  },
};
