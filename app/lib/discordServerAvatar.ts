export function discordServerAvatar(
  id?: string | undefined | null,
  hash?: string | undefined | null
) {
  return hash ? `https://cdn.discordapp.com/icons/${id}/${hash}.png` : "";
}
export function discordAvatar(
  id?: string | undefined | null,
  hash?: string | undefined | null
) {
  return hash ? `https://cdn.discordapp.com/avatars/${id}/${hash}.png` : "";
}
