/**
 * Password hashing using Web Crypto API (PBKDF2 + SHA-256).
 * This replaces Node's crypto.scrypt which isn't available on Workers.
 *
 * Format: pbkdf2:sha256:iterations:salt:hash (all base64url-encoded)
 */

const PBKDF2_ITERATIONS = 100_000;
const PBKDF2_KEY_LENGTH = 32; // 256 bits
const PBKDF2_HASH = "SHA-256";
const SALT_LENGTH = 16; // 128 bits

function base64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64url(str: string): Uint8Array {
  const raw = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = raw + "=".repeat((4 - (raw.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

/**
 * Hash a password using PBKDF2. Returns a portable string encoding.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: PBKDF2_HASH,
    },
    keyMaterial,
    PBKDF2_KEY_LENGTH * 8,
  );

  const hash = base64url(derivedBits);
  const saltStr = base64url(salt.buffer);

  // Format: algorithm:iterations:salt:hash
  return `pbkdf2:${PBKDF2_ITERATIONS}:${saltStr}:${hash}`;
}

/**
 * Verify a password against a hash string produced by hashPassword.
 */
export async function verifyPassword(
  password: string,
  encoded: string,
): Promise<boolean> {
  try {
    const parts = encoded.split(":");
    if (parts.length !== 4 || parts[0] !== "pbkdf2") {
      return false;
    }

    const iterations = parseInt(parts[1], 10);
    const salt = fromBase64url(parts[2]);
    const expectedHash = parts[3];

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits"],
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations,
        hash: PBKDF2_HASH,
      },
      keyMaterial,
      // derive the same key length from the stored algorithm
      // decode the expected hash to get the key length
      fromBase64url(expectedHash).length * 8,
    );

    const computedHash = base64url(derivedBits);
    return computedHash === expectedHash;
  } catch {
    return false;
  }
}
