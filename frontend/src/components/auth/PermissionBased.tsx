import type { ReactNode } from "react";
import { useAppSelector } from "../../app/hooks";

interface PermissionBasedProps {
  permission: string;
  children: ReactNode;
}

export function PermissionBased({ permission, children }: PermissionBasedProps) {
  const user = useAppSelector((state) => state.auth.user);
  const permissions = user?.role?.permissions?.map((item) => item.name) || [];
  if (user?.role?.name === "admin" || permissions.includes(permission)) {
    return <>{children}</>;
  }
  return null;
}
