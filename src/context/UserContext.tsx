import { createContext, useContext, useEffect, useMemo, useState } from "react";

const USER_STORAGE_KEY = "loopPlus:userProfile";

type UserProfile = {
  displayName: string;
  company?: string;
  isGuest: boolean;
};

type UserContextValue = {
  profile: UserProfile | null;
  hasOnboarded: boolean;
  loading: boolean;
  completeOnboarding: (profile: UserProfile) => void;
  resetOnboarding: () => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

const readStoredProfile = (): UserProfile | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserProfile;
    if (!parsed?.displayName) return null;
    return {
      displayName: parsed.displayName,
      company: parsed.company,
      isGuest: Boolean(parsed.isGuest),
    };
  } catch (error) {
    console.warn("[UserContext] Failed to parse stored profile", error);
    return null;
  }
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    const storedProfile = readStoredProfile();
    if (storedProfile) {
      setProfile(storedProfile);
      setHasOnboarded(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!profile) return;

    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const completeOnboarding = (nextProfile: UserProfile) => {
    setProfile(nextProfile);
    setHasOnboarded(true);
  };

  const resetOnboarding = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(USER_STORAGE_KEY);
    }
    setProfile(null);
    setHasOnboarded(false);
  };

  const value = useMemo(
    () => ({
      profile,
      hasOnboarded,
      loading,
      completeOnboarding,
      resetOnboarding,
    }),
    [profile, hasOnboarded, loading],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

