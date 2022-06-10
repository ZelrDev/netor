import type { APIUser } from "~/api-requests/apiUser.server";

export type LoaderData = {
  beforeUser: APIUser;
  afterUser: APIUser;
};
