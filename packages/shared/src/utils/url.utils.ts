/**
 * Builds a query string from an object
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

/**
 * Parses a query string into an object
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const query = queryString.startsWith('?') ? queryString.slice(1) : queryString;

  if (!query) return {};

  const params = new URLSearchParams(query);
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}

/**
 * Checks if a string is a valid URL
 */
export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets the base URL from a full URL
 */
export function getBaseUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return '';
  }
}

/**
 * Gets the pathname from a URL
 */
export function getPathname(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.pathname;
  } catch {
    return '';
  }
}

/**
 * Joins URL segments together
 */
export function joinUrl(...segments: string[]): string {
  return segments
    .map((segment, index) => {
      if (index === 0) {
        return segment.replace(/\/+$/, '');
      }
      return segment.replace(/^\/+|\/+$/g, '');
    })
    .filter(Boolean)
    .join('/');
}

/**
 * Adds or updates query parameters in a URL
 */
export function updateUrlParams(
  url: string,
  params: Record<string, string | number | boolean | undefined | null>
): string {
  try {
    const parsed = new URL(url);

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) {
        parsed.searchParams.delete(key);
      } else {
        parsed.searchParams.set(key, String(value));
      }
    }

    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Gets a specific query parameter from a URL
 */
export function getUrlParam(url: string, param: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get(param);
  } catch {
    return null;
  }
}

/**
 * Removes specified query parameters from a URL
 */
export function removeUrlParams(url: string, params: string[]): string {
  try {
    const parsed = new URL(url);

    for (const param of params) {
      parsed.searchParams.delete(param);
    }

    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Checks if a URL is absolute
 */
export function isAbsoluteUrl(url: string): boolean {
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url);
}

/**
 * Extracts the domain from a URL
 */
export function getDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return '';
  }
}

