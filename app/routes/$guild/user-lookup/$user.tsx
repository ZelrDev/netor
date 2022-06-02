import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getDBGuild } from "~/models/dbGuild.server";
import { getAPIGuild } from "~/requests/apiGuild.server";
import type { DBGuild } from "~/models/dbGuild.server";
import type { APIGuild } from "~/requests/apiGuild.server";
import { getSession } from "~/sessions";
import { HeaderSimple } from "~/components/Header";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { Avatar, Container, Group, Stack, Text, Title } from "@mantine/core";
import { APIUser, getAPIUser } from "~/requests/apiUser";

import { discordAvatar, error } from "~/utils";
import errors from "~/errors.json";
import { DoubleNavbar } from "~/components/Navbar";

type LoaderData = {
  dbGuild: DBGuild;
  apiGuild: APIGuild;
  apiUser: APIUser;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400);
  error(uri, `session is required`, 400);
  error(params.user, `params.user is required`, 400);

  const [dbGuild, apiGuild, apiUser] = await Promise.all([
    getDBGuild(params.guild, uri),
    getAPIGuild(params.guild, uri),
    getAPIUser(params.guild, params.user, uri),
  ]);

  error(apiUser.completed, errors.GET_API_USER_FAIL, 404);

  return json<LoaderData>({
    apiGuild: apiGuild.result!,
    dbGuild,
    apiUser: apiUser.result!,
  });
};
export default function Index() {
  const { apiUser, apiGuild } = useLoaderData() as LoaderData;

  return (
    <DoubleNavbar>
      <Breadcrumbs
        items={[
          {
            title: "← Back",
            onClick: () => history.back(),
          },
        ]}
      />

      <Group>
        <Avatar radius="xl" src={discordAvatar(apiUser.id, apiUser.avatar)} />

        <Title order={1}>{apiUser.username}</Title>
      </Group>
      <Stack spacing="xs">
        <Text>
          This user in not in{" "}
          <span style={{ fontWeight: 700 }}>{apiGuild.name}</span>, however we
          can show basic information:
        </Text>
        <Text>
          ID: <span style={{ fontWeight: 700 }}>{apiUser.id}</span>
        </Text>
        <Text>
          User:{" "}
          <span style={{ fontWeight: 700 }}>
            {apiUser.username}#{apiUser.discriminator}
          </span>
        </Text>
      </Stack>
    </DoubleNavbar>
  );
}
