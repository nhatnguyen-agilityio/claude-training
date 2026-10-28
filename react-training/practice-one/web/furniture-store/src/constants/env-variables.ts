export const API_ENDPOINT =
  import.meta.env.VITE_ENV === 'stag'
    ? import.meta.env.VITE_STAG_API_URL
    : import.meta.env.VITE_LOCAL_API_URL;
