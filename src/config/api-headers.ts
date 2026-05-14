export const NGROK_SKIP_BROWSER_WARNING_HEADER_NAME = 'ngrok-skip-browser-warning';
export const NGROK_SKIP_BROWSER_WARNING_HEADER_VALUE = 'true';

export const API_DEFAULT_HEADERS: Readonly<Record<string, string>> = {
  [NGROK_SKIP_BROWSER_WARNING_HEADER_NAME]: NGROK_SKIP_BROWSER_WARNING_HEADER_VALUE,
};
