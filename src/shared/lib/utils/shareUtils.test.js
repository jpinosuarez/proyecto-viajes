/* @vitest-environment jsdom */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import domtoimage from 'dom-to-image-more';
import { captureNodeAsPng, shareImage } from './shareUtils';

vi.mock('dom-to-image-more', () => ({
  default: {
    toBlob: vi.fn(),
  },
}));

describe('shareUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    if (typeof HTMLAnchorElement !== 'undefined') {
      HTMLAnchorElement.prototype.click = vi.fn();
    }
    document.execCommand = vi.fn(() => false);

    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      createLinearGradient: () => ({ addColorStop: vi.fn() }),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      set fillStyle(_) {},
      set font(_) {},
      set textAlign(_) {},
    }));
    HTMLCanvasElement.prototype.toBlob = vi.fn((callback) => {
      callback(new Blob(['fallback'], { type: 'image/png' }));
    });

    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = vi.fn(() => 'blob:test-url');
    }
    if (!window.URL.revokeObjectURL) {
      window.URL.revokeObjectURL = vi.fn();
    }
  });

  it('returns shared when Web Share succeeds', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(globalThis.navigator, 'canShare', {
      configurable: true,
      value: vi.fn(() => true),
    });
    Object.defineProperty(globalThis.navigator, 'share', {
      configurable: true,
      value: shareMock,
    });

    const result = await shareImage(new Blob(['ok'], { type: 'image/png' }), {
      title: 'My route',
      text: 'My share text',
    });

    expect(result.status).toBe('shared');
    expect(shareMock).toHaveBeenCalledTimes(1);
  });

  it('returns clipboard when Web Share is unavailable and clipboard works', async () => {
    Object.defineProperty(globalThis.navigator, 'canShare', {
      configurable: true,
      value: vi.fn(() => false),
    });
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    const result = await shareImage(new Blob(['ok'], { type: 'image/png' }), {
      title: 'My route',
      text: 'My share text',
      url: 'https://example.com/trips/1',
    });

    expect(result.status).toBe('clipboard');
  });

  it('returns downloaded when clipboard fallback fails', async () => {
    Object.defineProperty(globalThis.navigator, 'canShare', {
      configurable: true,
      value: vi.fn(() => false),
    });
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn().mockRejectedValue(new Error('No permission')),
      },
    });

    const result = await shareImage(new Blob(['ok'], { type: 'image/png' }), {
      title: 'My route',
      text: 'My share text',
    });

    expect(result.status).toBe('downloaded');
  });

  it('returns dismissed when user cancels native share', async () => {
    Object.defineProperty(globalThis.navigator, 'canShare', {
      configurable: true,
      value: vi.fn(() => true),
    });
    Object.defineProperty(globalThis.navigator, 'share', {
      configurable: true,
      value: vi.fn().mockRejectedValue({ name: 'AbortError' }),
    });

    const result = await shareImage(new Blob(['ok'], { type: 'image/png' }), {
      title: 'My route',
      text: 'My share text',
    });

    expect(result.status).toBe('dismissed');
  });

  it('uses fallback blob when DOM capture fails', async () => {
    domtoimage.toBlob.mockRejectedValueOnce(new Error('tainted canvas'));
    const node = document.createElement('div');
    node.innerHTML = '<div>content</div>';

    const blob = await captureNodeAsPng(node, { fallbackMessage: 'Fallback ready' });

    expect(blob).toBeInstanceOf(Blob);
    expect(domtoimage.toBlob).toHaveBeenCalledTimes(1);
  });
});
