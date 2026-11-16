import test from 'node:test';
import assert from 'node:assert/strict';
import { getPublicStatus } from '../src/public.js';
import { mission } from './helpers.js';

test('T08 - le suivi public affiche la référence et le statut', () => {
  const summary = getPublicStatus(mission());
  assert.equal(summary.id, 'SOS-204');
  assert.equal(summary.status, 'planned');
});

test('RO-08 - uniquement les champs publics autorisés', () => {
  const original = { ...mission(), droneId: 'DR-07' };
  const before = structuredClone(original);
  assert.deepEqual(getPublicStatus(original), {
    id: 'SOS-204',
    status: 'planned',
    history: ['planned'],
  });
  assert.deepEqual(original, before);
});

test('RO-08 - historique public indépendant', () => {
  const original = mission();
  const before = structuredClone(original);
  const summary = getPublicStatus(original);
  assert.notStrictEqual(summary.history, original.history);
  summary.history.push('en_route');
  assert.deepEqual(original, before);
});
