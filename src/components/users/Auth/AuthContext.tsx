import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * AuthContext — localStorage-backed placeholder auth
 * -----------------------------------------------------------------------
 * Stands in for real backend auth until the database exists. Users are
 * stored as an array under USERS_KEY; the active session is just a
 * pointer (their email) under SESSION_KEY.
 *
 * IMPORTANT: passwords are stored in PLAIN TEXT here. That is only
 * acceptable because this is a throwaway localStorage placeholder for
 * frontend development. Once a real backend exists, passwords must be
 * hashed server-side (bcrypt/argon2) — never store or compare plaintext
 * passwords in production, ever.
 *
 * Swap this whole file for real API calls (POST /auth/signup,
 * POST /auth/login, JWT storage, etc.) later — every component consumes
 * it through useAuth(), so the swap shouldn't require touching the UI.
 */

export interface StoredUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  country: string | null;
  gender: string | null;
  dob: string | null;
  createdAt: string;
}

export type PublicUser = Omit<StoredUser, "password">;

type AuthResult = { success: true } | { success: false; error: string };

interface AuthContextValue {
  user: PublicUser | null;
  isSignedIn: boolean;
  signup: (data: Omit<StoredUser, "id" | "createdAt">) => AuthResult;
  login: (email: string, password: string) => AuthResult;
  logout: () => void;
  updateUser: (updates: Partial<Omit<StoredUser, "id" | "password" | "createdAt">>) => void;
}

const USERS_KEY = "molu_users";
const SESSION_KEY = "molu_session_email";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // e.g. private browsing storage limits — fail silently
  }
}

function toPublicUser(user: StoredUser): PublicUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user;
  return rest;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Lazy initializer reads localStorage synchronously on first render —
  // avoids a flash of "signed out" UI on page load for already-logged-in
  // users, since there's no effect/async gap before the real state is known.
  const [user, setUser] = useState<PublicUser | null>(() => {
    try {
      const sessionEmail = localStorage.getItem(SESSION_KEY);
      if (!sessionEmail) return null;
      const found = readUsers().find((u) => u.email.toLowerCase() === sessionEmail.toLowerCase());
      return found ? toPublicUser(found) : null;
    } catch {
      return null;
    }
  });

  const signup: AuthContextValue["signup"] = (data) => {
    const users = readUsers();
    const exists = users.some((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) {
      return { success: false, error: "An account with this email already exists." };
    }
    const newUser: StoredUser = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    writeUsers([...users, newUser]);
    localStorage.setItem(SESSION_KEY, newUser.email);
    setUser(toPublicUser(newUser));
    return { success: true };
  };

  const login: AuthContextValue["login"] = (email, password) => {
    const users = readUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found || found.password !== password) {
      return { success: false, error: "Incorrect email or password." };
    }
    localStorage.setItem(SESSION_KEY, found.email);
    setUser(toPublicUser(found));
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const updateUser: AuthContextValue["updateUser"] = (updates) => {
    if (!user) return;
    const users = readUsers();
    const updated = users.map((u) =>
      u.email.toLowerCase() === user.email.toLowerCase() ? { ...u, ...updates } : u
    );
    writeUsers(updated);
    setUser({ ...user, ...updates });
  };

  return (
    <AuthContext.Provider value={{ user, isSignedIn: !!user, signup, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}