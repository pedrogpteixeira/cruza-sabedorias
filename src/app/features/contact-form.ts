export const CONTACT_FORM_NAME = 'cruza-contactos';
export const CONTACT_FORM_ENDPOINT = '/netlify-forms.html';

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  profile: string;
  service: string;
  message: string;
  consent: boolean;
  'bot-field': string;
}

export function encodeContact(payload: ContactPayload): URLSearchParams {
  const params = new URLSearchParams();
  params.set('form-name', CONTACT_FORM_NAME);
  for (const [key, value] of Object.entries(payload)) {
    params.set(key, typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : value.trim());
  }
  return params;
}

export async function sendContact(
  payload: URLSearchParams,
  request: typeof fetch = fetch,
): Promise<void> {
  const response = await request(CONTACT_FORM_ENDPOINT, {
    method: 'POST',
    body: payload.toString(),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error('Não foi possível enviar o pedido. Tente novamente ou mais tarde.');
}
