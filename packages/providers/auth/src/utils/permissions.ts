/**
 * Permission constants
 * Define all available permissions in the system
 */
export const PERMISSIONS = {
  // User management
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',

  // Role management
  ROLES_VIEW: 'roles:view',
  ROLES_MANAGE: 'roles:manage',

  // Content management
  CONTENT_VIEW: 'content:view',
  CONTENT_CREATE: 'content:create',
  CONTENT_UPDATE: 'content:update',
  CONTENT_DELETE: 'content:delete',
  CONTENT_PUBLISH: 'content:publish',

  // Settings
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_MANAGE: 'settings:manage',

  // Analytics
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',

  // System
  SYSTEM_ADMIN: 'system:admin',
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;
export type Permission = (typeof PERMISSIONS)[PermissionKey];

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  userPermissions: string[],
  permission: Permission
): boolean {
  // Super admin has all permissions
  if (userPermissions.includes(PERMISSIONS.SYSTEM_ADMIN)) {
    return true;
  }

  return userPermissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(
  userPermissions: string[],
  permissions: Permission[]
): boolean {
  if (userPermissions.includes(PERMISSIONS.SYSTEM_ADMIN)) {
    return true;
  }

  return permissions.some((p) => userPermissions.includes(p));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(
  userPermissions: string[],
  permissions: Permission[]
): boolean {
  if (userPermissions.includes(PERMISSIONS.SYSTEM_ADMIN)) {
    return true;
  }

  return permissions.every((p) => userPermissions.includes(p));
}

/**
 * Get default permissions for a role
 */
export function getDefaultPermissionsForRole(role: string): Permission[] {
  switch (role) {
    case 'super_admin':
      return [PERMISSIONS.SYSTEM_ADMIN];

    case 'admin':
      return [
        PERMISSIONS.USERS_VIEW,
        PERMISSIONS.USERS_CREATE,
        PERMISSIONS.USERS_UPDATE,
        PERMISSIONS.ROLES_VIEW,
        PERMISSIONS.CONTENT_VIEW,
        PERMISSIONS.CONTENT_CREATE,
        PERMISSIONS.CONTENT_UPDATE,
        PERMISSIONS.CONTENT_DELETE,
        PERMISSIONS.CONTENT_PUBLISH,
        PERMISSIONS.SETTINGS_VIEW,
        PERMISSIONS.SETTINGS_MANAGE,
        PERMISSIONS.ANALYTICS_VIEW,
        PERMISSIONS.ANALYTICS_EXPORT,
      ];

    case 'editor':
      return [
        PERMISSIONS.CONTENT_VIEW,
        PERMISSIONS.CONTENT_CREATE,
        PERMISSIONS.CONTENT_UPDATE,
        PERMISSIONS.CONTENT_PUBLISH,
      ];

    case 'viewer':
      return [PERMISSIONS.CONTENT_VIEW, PERMISSIONS.ANALYTICS_VIEW];

    case 'user':
    default:
      return [PERMISSIONS.CONTENT_VIEW];
  }
}

