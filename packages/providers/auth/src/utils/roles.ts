/**
 * Role constants
 */
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
  USER: 'user',
  GUEST: 'guest',
} as const;

export type RoleKey = keyof typeof ROLES;
export type Role = (typeof ROLES)[RoleKey];

/**
 * Role hierarchy - higher number means more privileges
 */
export const ROLE_HIERARCHY: Record<Role, number> = {
  [ROLES.SUPER_ADMIN]: 100,
  [ROLES.ADMIN]: 80,
  [ROLES.EDITOR]: 60,
  [ROLES.VIEWER]: 40,
  [ROLES.USER]: 20,
  [ROLES.GUEST]: 0,
};

/**
 * Get the hierarchy level for a role
 */
export function getRoleLevel(role: string): number {
  return ROLE_HIERARCHY[role as Role] ?? 0;
}

/**
 * Check if a role has at least the specified level
 */
export function hasMinimumRole(userRole: string, minRole: Role): boolean {
  const userLevel = getRoleLevel(userRole);
  const minLevel = ROLE_HIERARCHY[minRole];

  return userLevel >= minLevel;
}

/**
 * Get all roles that are equal or higher than the specified role
 */
export function getRolesAbove(role: Role): Role[] {
  const minLevel = ROLE_HIERARCHY[role];
  return Object.entries(ROLE_HIERARCHY)
    .filter(([, level]) => level >= minLevel)
    .map(([r]) => r as Role);
}

/**
 * Get all roles that are equal or lower than the specified role
 */
export function getRolesBelow(role: Role): Role[] {
  const maxLevel = ROLE_HIERARCHY[role];
  return Object.entries(ROLE_HIERARCHY)
    .filter(([, level]) => level <= maxLevel)
    .map(([r]) => r as Role);
}

/**
 * Role display names
 */
export const ROLE_LABELS: Record<Role, string> = {
  [ROLES.SUPER_ADMIN]: 'Süper Admin',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.EDITOR]: 'Editör',
  [ROLES.VIEWER]: 'İzleyici',
  [ROLES.USER]: 'Kullanıcı',
  [ROLES.GUEST]: 'Misafir',
};

/**
 * Get display name for a role
 */
export function getRoleLabel(role: string): string {
  return ROLE_LABELS[role as Role] ?? role;
}

