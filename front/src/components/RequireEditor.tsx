import { ReactNode } from "react";
import { useAuth } from "../store/AuthContext";

export const RequireEditor: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  return user?.editor ? <>{children}</> : null;
};
