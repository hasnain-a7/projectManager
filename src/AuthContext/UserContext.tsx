// src/AuthContext/UserContextId.tsx
import { createContext, useState, useContext } from "react";

type UserContextIdType = {
  userContextId: string | null;
  setUserId: (id: string) => void;
};

const UserContextId = createContext<UserContextIdType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userContextId, setUserId] = useState<string | null>(null);

  return (
    <UserContextId.Provider value={{ userContextId, setUserId }}>
      {children}
    </UserContextId.Provider>
  );
};

export const useUserContextId = () => {
  const context = useContext(UserContextId);
  if (!context) {
    throw new Error("useUserContextId must be used within a UserProvider");
  }
  return context;
};

export default UserContextId;
