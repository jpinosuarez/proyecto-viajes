import domtoimage from 'dom-to-image-more';
import { logger } from './logger';

/**
 * Capture a DOM node as a PNG blob (for stories and sharing).
 * @param {HTMLElement} node
 * @param {{ width?: number, height?: number, scale?: number, fallbackMessage?: string }} opts
 * @returns {Promise<Blob>}
 */
export const captureNodeAsPng = async (
  node,
  {
    width = 1080,
    height = 1920,
    scale = 1,
    fallbackMessage = 'Your travel story is ready to share',
  } = {}
) => {
  if (!node) throw new Error('No node provided for capture');

  try {
    const blob = await domtoimage.toBlob(node.firstElementChild || node, {
      width,
      height,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      },
      quality: 0.95,
    });

    return blob;
  } catch (err) {
    // Graceful degradation: if canvas is tainted (CORS) or capture fails,
    // generate a minimal fallback image with just the gradient + text.
    logger.warn('DOM capture failed, generating fallback image', err);
    return generateFallbackBlob(width, height, fallbackMessage);
  }
};

/**
 * Fallback renderer: returns a branded gradient card when DOM capture fails.
 * @param {number} w
 * @param {number} h
 * @param {string} fallbackMessage
 * @returns {Promise<Blob>}
 */
const generateFallbackBlob = (w, h, fallbackMessage) =>
  new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // Gradient background
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#2C3E50');
    grad.addColorStop(1, '#0f766e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Branding text
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = 'bold 48px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('KEEPTRIP', w / 2, h / 2 - 20);
    ctx.font = '28px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(fallbackMessage, w / 2, h / 2 + 30);

    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });

/**
 * Convert a Blob into a File (required by Web Share API file sharing).
 * @param {Blob} blob
 * @param {string} filename
 * @returns {File}
 */
const blobToFile = (blob, filename = 'keeptrip-story.png') =>
  new File([blob], filename, { type: blob.type || 'image/png' });

/**
 * Creates an evocative clipboard text fallback for manual sharing.
 * @param {{ title?: string, text?: string, url?: string }} opts
 * @returns {string}
 */
const buildClipboardFallbackText = ({ title = '', text = '', url = '' } = {}) => {
  const lines = [
    title ? `✈️ ${title}` : '',
    text || 'I just captured a new story in Keeptrip.',
    url ? `🔗 ${url}` : '',
    'Shared from Keeptrip',
  ].filter(Boolean);

  return lines.join('\n');
};

/**
 * Copy text to clipboard with runtime fallback.
 * @param {string} text
 * @returns {Promise<boolean>}
 */
const copyTextToClipboard = async (text) => {
  if (!text) return false;

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    logger.warn('Clipboard API writeText failed, trying fallback', { error: error?.message });
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'true');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    return copied;
  } catch (error) {
    logger.warn('Clipboard fallback failed', { error: error?.message });
    return false;
  }
};

/**
 * Share an image with layered fallback: Web Share -> Clipboard text -> Download.
 * @param {Blob} blob - PNG blob
 * @param {{ title?: string, text?: string, url?: string, filename?: string, clipboardText?: string }} opts
 * @returns {Promise<{ status: 'shared'|'clipboard'|'downloaded'|'dismissed', copiedText?: string }>}
 */
export const shareImage = async (
  blob,
  {
    title = 'My trip — Keeptrip',
    text = '',
    url = '',
    filename = 'keeptrip-story.png',
    clipboardText = '',
  } = {}
) => {
  const file = blobToFile(blob, filename);
  const manualShareText = clipboardText || buildClipboardFallbackText({ title, text, url });

  // 1) Web Share API (mobile)
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title,
        text: text || manualShareText,
        files: [file],
      });
      return { status: 'shared', copiedText: manualShareText };
    } catch (err) {
      if (err.name === 'AbortError') return { status: 'dismissed', copiedText: manualShareText };
      logger.warn('Web Share failed, trying clipboard fallback', err);
    }
  }

  // 2) Clipboard text fallback (useful for WhatsApp/manual share)
  const copied = await copyTextToClipboard(manualShareText);
  if (copied) {
    return { status: 'clipboard', copiedText: manualShareText };
  }

  // 3) Last resort: download image
  downloadBlob(blob, filename);
  return { status: 'downloaded', copiedText: manualShareText };
};

/**
 * Download a blob as a file.
 * @param {Blob} blob
 * @param {string} filename
 */
export const downloadBlob = (blob, filename = 'keeptrip-story.png') => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
};
