import { useEffect, useMemo, useState } from "react";
import type { ImageSource } from "expo-image";

const GRAPH = "https://graph.microsoft.com/v1.0";
const PHOTO_META = `${GRAPH}/me/photo`;
const PHOTO_240 = `${GRAPH}/me/photos/240x240/$value`;

async function fetchPhotoEtag(accessToken: string): Promise<string | null> {
  const res = await fetch(PHOTO_META, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (res.status === 404) return null;
  if (!res.ok) return null;

  const meta = await res.json();
  const raw = meta?.["@odata.mediaEtag"];

  return typeof raw === "string" ? raw.replace(/^"+|"+$/g, "") : null;
}

export function useGraphAvatarSource(graphAccessToken: string | null) {
  const [etag, setEtag] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setChecked(false);
      setEtag(null);

      if (!graphAccessToken) { setChecked(true); return; }

      const e = await fetchPhotoEtag(graphAccessToken);

      if (!mounted) return;

      setEtag(e);
      setChecked(true);
    })();
    return () => { mounted = false; };
  }, [graphAccessToken]);

  const hasPhoto = !!etag;

  const source = useMemo<ImageSource | undefined>(() => {
    if (!graphAccessToken || !hasPhoto) return undefined;

    const q = etag ? `?etag=${encodeURIComponent(etag)}` : "";

    return {
      uri: `${PHOTO_240}${q}`,
      headers: { Authorization: `Bearer ${graphAccessToken}` },
    };
  }, [graphAccessToken, hasPhoto, etag]);

  const recyclingKey = etag ?? "no-photo";

  return { source, recyclingKey, hasPhoto, checked };
}
