/**
 * Permission check mode
 */
export type PermissionCheck = 'all' | 'any';

/**
 * Role check mode
 */
export type RoleCheck = 'exact' | 'minimum';

/**
 * Access control configuration
 */
export interface AccessControl {
  /**
   * Required roles (user must have one of these)
   */
  roles?: string[];

  /**
   * Required permissions
   */
  permissions?: string[];

  /**
   * Permission check mode
   */
  permissionCheck?: PermissionCheck;

  /**
   * Role check mode
   */
  roleCheck?: RoleCheck;

  /**
   * Minimum role level (for hierarchy check)
   */
  minimumRole?: string;

  /**
   * Custom access check function
   */
  customCheck?: (user: { role: string; permissions: string[] }) => boolean;
}

/**
 * Access check result
 */
export interface AccessCheckResult {
  /**
   * Whether access is granted
   */
  granted: boolean;

  /**
   * Reason for denial (if denied)
   */
  reason?: 'not_authenticated' | 'insufficient_role' | 'missing_permission' | 'custom_check_failed';

  /**
   * Missing roles (if role check failed)
   */
  missingRoles?: string[];

  /**
   * Missing permissions (if permission check failed)
   */
  missingPermissions?: string[];
}

/**
 * Permission definition
 */
export interface PermissionDefinition {
  key: string;
  label: string;
  description?: string;
  category?: string;
}

/**
 * Role definition
 */
export interface RoleDefinition {
  key: string;
  label: string;
  description?: string;
  permissions: string[];
  inherits?: string[];
}

