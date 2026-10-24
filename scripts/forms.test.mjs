import { test } from 'node:test';
import assert from 'node:assert/strict';
// Node >= 22.22.3 executes TypeScript imports with type stripping.
import { CONTACT_FORM_NAME, encodeContact, sendContact } from '../src/app/features/contact-form.ts';
const fixture = { name: '  Ana  ', email: 'ana@example.com', phone: '', profile: 'Empresa', service: 'Relatórios Financeiros', message: 'Gostaria de saber mais sobre relatórios.', consent: true, 'bot-field': '' };
test('serializes and trims all contact fields for Netlify', () => {
  const form = encodeContact(fixture);
  assert.equal(form.get('form-name'), CONTACT_FORM_NAME);
  assert.equal(form.get('name'), 'Ana');
  assert.equal(form.get('consent'), 'Sim');
  assert.equal(form.get('service'), 'Relatórios Financeiros');
});
test('handles an accepted submission', async () => {
  await sendContact(encodeContact(fixture), async (url, init) => {
    assert.equal(url, '/netlify-forms.html');
    assert.equal(init?.method, 'POST');
    assert.match(init?.headers['Content-Type'], /application\/x-www-form-urlencoded/);
    return new Response(null, { status: 200 });
  });
});
test('never treats an HTTP rejection as success', async () => {
  await assert.rejects(() => sendContact(encodeContact(fixture), async () => new Response(null, { status: 403 })), /Não foi possível/);
});
