import { z } from 'zod';
import { UserRole, UserStatus } from './user.enums';
import { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from './user.constants';

/**
 * User ID schema
 */
export const userIdSchema = z.string().uuid('Geçersiz kullanıcı ID');

/**
 * Email schema
 */
export const emailSchema = z
  .string()
  .email('Geçerli bir e-posta adresi giriniz')
  .max(255, 'E-posta en fazla 255 karakter olabilir');

/**
 * Password schema
 */
export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Şifre en az ${PASSWORD_MIN_LENGTH} karakter olmalıdır`)
  .max(PASSWORD_MAX_LENGTH, `Şifre en fazla ${PASSWORD_MAX_LENGTH} karakter olabilir`)
  .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
  .regex(/[a-z]/, 'Şifre en az bir küçük harf içermelidir')
  .regex(/[0-9]/, 'Şifre en az bir rakam içermelidir');

/**
 * Full name schema
 */
export const fullNameSchema = z
  .string()
  .min(2, 'İsim en az 2 karakter olmalıdır')
  .max(100, 'İsim en fazla 100 karakter olabilir');

/**
 * User role schema
 */
export const userRoleSchema = z.nativeEnum(UserRole);

/**
 * User status schema
 */
export const userStatusSchema = z.nativeEnum(UserStatus);

/**
 * Base user schema
 */
export const userSchema = z.object({
  id: userIdSchema,
  email: emailSchema,
  fullName: fullNameSchema,
  role: userRoleSchema,
  status: userStatusSchema,
  avatarUrl: z.string().url().optional(),
  phone: z.string().max(20).optional(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  lastLoginAt: z.coerce.date().optional(),
});

/**
 * Create user schema
 */
export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: fullNameSchema,
  role: userRoleSchema.optional(),
  avatarUrl: z.string().url().optional(),
  phone: z.string().max(20).optional(),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * Update user schema
 */
export const updateUserSchema = z.object({
  email: emailSchema.optional(),
  fullName: fullNameSchema.optional(),
  role: userRoleSchema.optional(),
  status: userStatusSchema.optional(),
  avatarUrl: z.string().url().optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * User filter schema
 */
export const userFilterSchema = z.object({
  search: z.string().optional(),
  role: userRoleSchema.optional(),
  status: userStatusSchema.optional(),
  createdAfter: z.coerce.date().optional(),
  createdBefore: z.coerce.date().optional(),
});

/**
 * Schema types
 */
export type UserSchema = z.infer<typeof userSchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type UserFilterSchema = z.infer<typeof userFilterSchema>;

