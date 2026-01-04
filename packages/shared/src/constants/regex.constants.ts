/**
 * Email validation regex
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Turkish phone number regex (with or without country code)
 */
export const PHONE_REGEX = /^(\+90|0)?[5][0-9]{9}$/;

/**
 * International phone number regex
 */
export const PHONE_INTERNATIONAL_REGEX = /^\+?[1-9]\d{1,14}$/;

/**
 * URL validation regex
 */
export const URL_REGEX =
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

/**
 * UUID v4 validation regex
 */
export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Password validation regex (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
 */
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

/**
 * Strong password regex (includes special characters)
 */
export const PASSWORD_STRONG_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Username validation regex (alphanumeric, underscore, 3-20 chars)
 */
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

/**
 * Slug validation regex
 */
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Hex color validation regex
 */
export const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

/**
 * Credit card number regex (basic validation)
 */
export const CREDIT_CARD_REGEX = /^\d{13,19}$/;

/**
 * Turkish TC Kimlik number regex
 */
export const TC_KIMLIK_REGEX = /^[1-9][0-9]{10}$/;

/**
 * Turkish tax number regex
 */
export const TAX_NUMBER_REGEX = /^[0-9]{10}$/;

/**
 * IP address v4 regex
 */
export const IPV4_REGEX =
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

