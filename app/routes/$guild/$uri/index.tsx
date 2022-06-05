import { ArrowRightIcon } from "@heroicons/react/solid";
import {
  Button,
  Center,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
  useSubmit,
} from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { ButtonsGroup } from "~/components/ButtonsGroup";
import {
  createSessionURI,
  deleteSessionURI,
  deleteURI,
  getSessionURI,
  getURI,
} from "~/models/dbGuild.server";
import type { APIUser } from "~/requests/apiUser";
import { getAPIUser } from "~/requests/apiUser";
import { getSession, commitSession } from "~/sessions";
import { discordAvatar, error, safeRedirect } from "~/utils";

type LoaderData = {
  beforeUser: APIUser;
  afterUser: APIUser;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const session_uri = session.get("uuid");
  const url = new URL(request.url);
  const callback_uri = url.searchParams.get("url");

  error(params.guild, `params.guild is required`, 400);
  error(params.uri, `params.uri is required`, 400);

  if (session_uri) {
    const loggedIn = await getSessionURI(params.guild, session_uri);
    if (loggedIn) {
      const uri = await getURI(params.guild, params.uri);
      if (uri?.user_id) {
        if (loggedIn.user_id !== uri?.user_id) {
          const [beforeUser, afterUser] = await Promise.all([
            getAPIUser(params.guild, loggedIn?.user_id, loggedIn.token),
            getAPIUser(params.guild, uri?.user_id, loggedIn.token),
          ]);

          error(beforeUser.completed, `Couldn't get current user`, 500);
          error(afterUser.completed, `Couldn't get URI user`, 500);

          return json<LoaderData>({
            beforeUser: beforeUser.result!,
            afterUser: afterUser.result!,
          });
        }
      }
    }
  }

  const uuid = await createSessionURI(params.guild, params.uri);
  await deleteURI(params.guild, params.uri);
  session.set("uuid", uuid);

  return redirect(safeRedirect(callback_uri || `/${params.guild}/apps`), {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  const data = await request.formData();
  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");
  const switchUser = data.get("switch");
  const url = new URL(request.url);
  const callback_uri = url.searchParams.get("url");

  error(params.guild, `params.guild is required`, 400, true);
  error(params.uri, `params.uri is required`, 400, true);
  error(uri, `session is required`, 400, true);
  error(switchUser, `switch is required`, 400, true);

  if (switchUser === "yes") {
    await deleteSessionURI(params.guild, uri);
    const uuid = await createSessionURI(params.guild, params.uri);
    await deleteURI(params.guild, params.uri);
    session.set("uuid", uuid);
    return redirect(safeRedirect(callback_uri || `/${params.guild}/apps`), {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } else {
    await deleteURI(params.guild, params.uri);
    return redirect(safeRedirect(callback_uri || `/${params.guild}/apps`));
  }
};

export default function Index() {
  const { search } = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const submit = useSubmit();
  const urlParams = new URLSearchParams(search);
  const { afterUser, beforeUser } = useLoaderData() as LoaderData;

  const switchUser = (switchUser: "yes" | "no") => {
    let formData = new FormData();
    formData.append("switch", switchUser);

    submit(formData, { method: "post" });
    navigate(safeRedirect(urlParams.get("url") || `/${params.guild}/apps`));
  };

  return (
    <Center style={{ height: "100vh" }}>
      <Paper
        p="md"
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        })}
        shadow="md"
        radius="md"
      >
        <Stack>
          <Title
            align="center"
            style={{
              fontWeight: 900,
            }}
          >
            Switch user?
          </Title>
          <Group>
            <Paper
              p="md"
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[7]
                    : theme.colors.gray[0],
              })}
              shadow="md"
              radius="md"
            >
              <Image
                radius="md"
                src={discordAvatar(beforeUser.id, beforeUser.avatar)}
              />
              <Title order={2} pt="xs">
                {beforeUser.username}
              </Title>
              <Text weight={400}>#{beforeUser.discriminator}</Text>
            </Paper>
            <ThemeIcon
              sx={(theme) => ({
                boxShadow: theme.shadows.md,
              })}
              variant="gradient"
              gradient={{ from: "blue", to: "indigo" }}
              radius="xl"
              size="xl"
            >
              <ArrowRightIcon style={{ padding: 10 }} />
            </ThemeIcon>
            <Paper
              p="md"
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[7]
                    : theme.colors.gray[0],
              })}
              shadow="md"
              radius="md"
            >
              <Image
                radius="md"
                src={discordAvatar(afterUser.id, afterUser.avatar)}
              />
              <Title order={2} pt="xs">
                {afterUser.username}
              </Title>
              <Text weight={400}>#{afterUser.discriminator}</Text>
            </Paper>
          </Group>
          <ButtonsGroup>
            <Button onClick={() => switchUser("yes")}>Yes</Button>
            <Button onClick={() => switchUser("no")}>No</Button>
          </ButtonsGroup>
        </Stack>
      </Paper>
    </Center>
  );
}
