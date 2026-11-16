export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// The browser calls the backend directly for search, the newsletter and the contact form.
export const publicApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
