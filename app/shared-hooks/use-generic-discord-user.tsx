import type { APIGuildMember } from "~/api-requests/apiGuildMember.server";
import type { APIUser } from "~/api-requests/apiUser.server";

function isAPIUserFunction(object: any): object is APIUser {
  return "username" in object;
}

export const useGenericDiscordUser = (user?: APIUser | APIGuildMember) => {
  if (!user) return;
  const isAPIUser = isAPIUserFunction(user);
  if (isAPIUser) return user;
  else return user?.user!;
};
