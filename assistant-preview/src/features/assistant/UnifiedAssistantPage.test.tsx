import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../../App';
import { createMockAdapters, type MockOptions } from '../../lib/assistant/mock/mock-adapters';

const fetchSpy = vi.fn();

function setup(options: MockOptions = {}) {
  const user = userEvent.setup();
  render(<App adapters={createMockAdapters({ latencyMs: 0, ...options })} />);
  return { user };
}

const assistantMessages = () => document.querySelectorAll('.msg--assistant');

beforeEach(() => {
  localStorage.clear();
  fetchSpy.mockReset();
  vi.stubGlobal('fetch', fetchSpy);
});

describe('Unified assistant page', () => {
  it('shows one conversation with subtle capability indicators, not a mode switch', async () => {
    setup();
    expect(screen.getByRole('heading', { name: /how is the farm today/i })).toBeInTheDocument();
    const caps = screen.getByRole('list', { name: /available capabilities/i });
    expect(within(caps).getByText(/NARI · Agriculture/)).toBeInTheDocument();
    expect(within(caps).getByText(/MAITRI · Context/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /switch|mode/i })).not.toBeInTheDocument();
  });

  it('handles the combined scenario as a single reply and confirms the reminder in preview only', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /tomato field looks weak and remind rajesh/i }));

    await screen.findByText(/Drew on: NARI · Agriculture \+ MAITRI · Context/);
    expect(assistantMessages()).toHaveLength(1);
    expect(screen.getByText(/no message will be sent to Rajesh/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /confirm reminder/i }));
    await screen.findByText(/reminder saved in preview/i);

    const tasks = document.getElementById('ctx-tasks')!;
    await waitFor(() => expect(within(tasks).getByText('Inspect irrigation')).toBeInTheDocument());
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('never invents a soil moisture reading', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /what is the soil moisture/i }));
    await screen.findByText(/soil moisture is currently unavailable/i);
    const reply = assistantMessages()[0] as HTMLElement;
    expect(within(reply).getByText('Not connected')).toBeInTheDocument();
    expect(reply.textContent).not.toMatch(/\d+(\.\d+)?\s*%/);
  });

  it('shows the RAKSHA boundary for robot requests with no way to trigger action', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /send the robot to spray/i }));
    const note = await screen.findByRole('note', { name: /RAKSHA safety review required/i });
    expect(within(note).getByText(/physical action not authorized from conversation/i)).toBeInTheDocument();
    expect(within(note).getByRole('button', { name: /open safety review/i })).toBeDisabled();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('lets the farmer review, reveal and remove memories; sharing is off by default', async () => {
    const { user } = setup();
    await user.click(await screen.findByRole('button', { name: /review & manage/i }));
    const dialog = await screen.findByRole('dialog', { name: /what maitri remembers/i });

    expect(within(dialog).getByText(/hidden for privacy/i)).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Show' }));
    expect(within(dialog).getByText(/crop loan follow-up/i)).toBeInTheDocument();

    const langItem = within(dialog).getByText('Preferred language').closest('li')!;
    expect(within(langItem).getByText(/Sharing: Not shared/)).toBeInTheDocument();
    await user.click(within(langItem).getByRole('button', { name: 'Remove' }));
    await waitFor(() => expect(within(dialog).queryByText('Preferred language')).not.toBeInTheDocument());
  });

  it('switches UI language without touching the conversation', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'తెలుగు' }));
    expect(screen.getByText('MahaaAi సహాయకుడు')).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('te');
  });

  it('sends an attached photo and shows the honest placeholder reply', async () => {
    const { user } = setup();
    const file = new File(['x'], 'leaf.jpg', { type: 'image/jpeg' });
    await user.upload(screen.getByTestId('photo-input'), file);
    expect(screen.getByRole('button', { name: /remove photo leaf.jpg/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Send' }));
    await screen.findByText(/Leaf image received\. NARI analysis would appear here/);
    expect(screen.getByRole('img', { name: 'leaf.jpg' })).toBeInTheDocument();
  });

  it('runs the mock voice flow end to end', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<App adapters={createMockAdapters({ latencyMs: 50 })} />);
      await user.click(screen.getByRole('button', { name: /speak your message/i }));
      await act(async () => {
        vi.advanceTimersByTime(210); // step = 100ms → "hearing" phase
      });
      expect(screen.getByText(/Hearing you: “My tomato plants”/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /stop listening/i })).toHaveAttribute('aria-pressed', 'true');
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
      await screen.findByText(/Spoken/);
      await screen.findByText(/let’s look at it together/i);
    } finally {
      vi.useRealTimers();
    }
  });

  it('explains when microphone permission is denied', async () => {
    const { user } = setup({ voiceMode: 'denied' });
    await user.click(screen.getByRole('button', { name: /speak your message/i }));
    await screen.findByText(/microphone permission denied/i);
  });

  it('disables the mic when no microphone is available', () => {
    setup({ voiceMode: 'unavailable' });
    expect(screen.getByRole('button', { name: /speak your message/i })).toBeDisabled();
    expect(screen.getByText(/microphone not available/i)).toBeInTheDocument();
  });
});
