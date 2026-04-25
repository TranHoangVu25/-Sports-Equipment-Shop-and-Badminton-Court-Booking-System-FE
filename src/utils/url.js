const ENCODE_PREFIX = "v1_";

export const encodeId = (id) => {
  if (id === undefined || id === null || id === "") return id;

  // Convert to string, base64 encode, then make URL-safe.
  const encoded = btoa(String(id))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return `${ENCODE_PREFIX}${encoded}`;
};

export const decodeId = (encodedId) => {
  if (encodedId === undefined || encodedId === null || encodedId === "") return encodedId;

  const rawValue = String(encodedId);

  // Backward compatibility: old links used raw IDs.
  if (!rawValue.startsWith(ENCODE_PREFIX)) {
    return rawValue;
  }

  try {
    let base64 = rawValue.slice(ENCODE_PREFIX.length).replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }
    return atob(base64);
  } catch (error) {
    return rawValue;
  }
};
