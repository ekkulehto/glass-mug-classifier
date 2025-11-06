const GRAPH = 'https://graph.microsoft.com/v1.0';

export type UserProfile = {
  displayName: string | null;
  email: string | null;
};

type MeResponse = {
  displayName?: string | null;
  mail?: string | null;
  userPrincipalName?: string | null;
};

function pickEmail(me: MeResponse): string | null {
  if (me.mail && me.mail.includes('@')) return me.mail;
  const upn = me.userPrincipalName ?? '';
  const m = upn.match(/^(.+?)#EXT#@/i);
  if (m) return m[1].replace('_', '@');
  return upn || null;
}

export async function fetchGraphBasic(accessToken: string): Promise<UserProfile> {
  const res = await fetch(
    `${GRAPH}/me?$select=displayName,mail,userPrincipalName`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error(`Graph /me failed: ${res.status}`);
  const me = (await res.json()) as MeResponse;
  return { displayName: me.displayName ?? null, email: pickEmail(me) };
}
