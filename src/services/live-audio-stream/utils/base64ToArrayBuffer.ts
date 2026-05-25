const BASE64_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const BASE64_LOOKUP = buildBase64Lookup();

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const cleanBase64 = base64.replace(new RegExp('=+$'), '');
  const outputLength = Math.floor((cleanBase64.length * 3) / 4);
  const bytes = new Uint8Array(outputLength);
  let buffer = 0;
  let bits = 0;
  let offset = 0;

  for (const character of cleanBase64) {
    const value = BASE64_LOOKUP[character];

    if (value === undefined) {
      continue;
    }

    buffer = buffer * 64 + value;
    bits += 6;

    if (bits >= 8) {
      bits -= 8;
      bytes[offset] = Math.floor(buffer / 2 ** bits) % 256;
      offset += 1;
    }
  }

  return bytes.buffer.slice(0, offset);
}

function buildBase64Lookup(): Record<string, number> {
  return BASE64_ALPHABET.split('').reduce<Record<string, number>>(
    (lookup, character, index) => {
      lookup[character] = index;
      return lookup;
    },
    {},
  );
}
