import { describe, expect, it } from 'vitest';
import type { ConversationRequest } from '../types';
import { runDemoScript } from './demo-script';

const req = (text: string, extra: Partial<ConversationRequest> = {}): ConversationRequest => ({
  text,
  inputMode: 'text',
  attachments: [],
  locale: 'en',
  ...extra,
});

describe('demo script (preview-only canned replies)', () => {
  it('A: crop concern surfaces NARI context without a diagnosis', () => {
    const reply = runDemoScript(req('My tomato plants look weak today.'));
    expect(reply.domains).toEqual(['nari']);
    expect(reply.related).toContain('crop');
    const insight = reply.blocks.find((b) => b.kind === 'agri-insight');
    expect(insight && 'body' in insight && insight.body).toMatch(/Nothing has been diagnosed/);
    expect(reply.source).toBe('demo');
  });

  it('B: reminder is proposed (not sent) for a trusted person', () => {
    const reply = runDemoScript(req('Remind Rajesh tomorrow morning to check irrigation.'));
    expect(reply.domains).toEqual(['maitri']);
    const block = reply.blocks.find((b) => b.kind === 'reminder');
    expect(block?.kind === 'reminder' && block.reminder).toMatchObject({
      personId: 'p-rajesh',
      status: 'proposed',
      task: 'Check irrigation',
      whenLabel: 'Tomorrow, 7:00 AM',
    });
  });

  it('C: combined request yields ONE reply drawing on both domains', () => {
    const reply = runDemoScript(req('My tomato field looks weak and remind Rajesh tomorrow to inspect irrigation.'));
    expect(reply.domains.sort()).toEqual(['maitri', 'nari']);
    expect(reply.blocks.some((b) => b.kind === 'agri-insight')).toBe(true);
    expect(reply.blocks.some((b) => b.kind === 'reminder')).toBe(true);
  });

  it('D: unavailable sensor is reported without inventing a reading', () => {
    const reply = runDemoScript(req('What is the soil moisture?'));
    const sensor = reply.blocks.find((b) => b.kind === 'sensor');
    expect(sensor?.kind === 'sensor' && sensor.reading.state).toBe('unavailable');
    expect(sensor?.kind === 'sensor' && sensor.reading.displayValue).toBeUndefined();
    expect(JSON.stringify(reply)).not.toMatch(/\d+(\.\d+)?\s*%/);
  });

  it('E: physical request shows the RAKSHA boundary and nothing else actionable', () => {
    const reply = runDemoScript(req('Send the robot to spray that area.'));
    expect(reply.blocks.some((b) => b.kind === 'safety')).toBe(true);
    expect(reply.blocks.some((b) => b.kind === 'reminder')).toBe(false);
  });

  it('replies in Telugu when the farmer writes Telugu, even with an English UI', () => {
    const reply = runDemoScript(req('నేల తేమ ఎంత ఉంది?'));
    const first = reply.blocks[0];
    expect(first?.kind === 'text' && first.text).toMatch(/[ఀ-౿]/);
  });

  it('image attachments get an honest placeholder, not a diagnosis', () => {
    const reply = runDemoScript(req('', { inputMode: 'image', attachments: [{ id: 'i', name: 'leaf.jpg', previewUrl: 'blob:x' }] }));
    expect(reply.blocks[0]).toMatchObject({ kind: 'text', text: expect.stringMatching(/Leaf image received/) });
    expect(reply.blocks.some((b) => b.kind === 'image-received')).toBe(true);
  });
});
