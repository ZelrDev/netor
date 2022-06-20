import type { APIGuild } from "~/api-requests/apiGuild.server";
import type { APIUser } from "~/api-requests/apiUser.server";
import type { APIGuildMember } from "~/api-requests/apiGuildMember.server";
import { useAPI } from "~/shared-hooks/use-api";

function isAPIUserFunction(object: any): object is APIUser {
  return "username" in object;
}

export const useManageMember = (
  guild: APIGuild,
  member: APIGuildMember | APIUser
) => {
  const isAPIUser = isAPIUserFunction(member);

  const request = useAPI({
    guild: guild.id,
    member: isAPIUser ? member.id : member.user!.id,
  });

  const removeMemberTimeout = () => {
    if (isAPIUser) return false;
    const timedOut = member.communication_disabled_until !== null;
    if (timedOut) {
      let formData = new FormData();
      formData.append("user_id", member.user!.id);
      request("removeMemberTimeout", formData);
      return true;
    } else {
      return false;
    }
  };

  const timeoutMember = (ms: string, reason?: string) => {
    if (isAPIUser) return false;
    let formData = new FormData();
    formData.append("user_id", member.user!.id);
    formData.append("time", ms);
    formData.append("reason", !reason ? "No reason specified" : reason);
    request("timeoutMember", formData);
  };

  const kickMember = (reason?: string) => {
    if (isAPIUser) return false;
    let formData = new FormData();
    formData.append("user_id", member.user!.id);
    formData.append("reason", !reason ? "No reason specified" : reason);
    request("kickMember", formData);
  };

  const banMember = (reason?: string) => {
    if (isAPIUser) return false;
    let formData = new FormData();
    formData.append("user_id", member.user!.id);
    formData.append("reason", !reason ? "No reason specified" : reason);
    request("banMember", formData);
  };

  const removeBan = () => {
    let formData = new FormData();
    formData.append("user_id", isAPIUser ? member.id : member.user!.id);
    request("removeBan", formData);
  };

  const removePunishment = (punishmentId: string) => {
    let formData = new FormData();
    formData.append("punishment_id", punishmentId);
    request("removePunishment", formData);
  };

  const removeInvite = (inviteId: string) => {
    let formData = new FormData();
    formData.append("invite_id", inviteId);
    request("removeInvite", formData);
  };

  return {
    timeoutMember,
    banMember,
    removeMemberTimeout,
    removeInvite,
    kickMember,
    removeBan,
    removePunishment,
  };
};
