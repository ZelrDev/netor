import {
  Accordion,
  Box,
  Button,
  Checkbox,
  ColorInput,
  Footer,
  Group,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { EmbedVisualizer, parseContent, parseTitle } from "embed-visualizer";
import { useEffect } from "react";
import { openError } from "~/hooks/openError";
import { DBGuild, DBGuildEmbeds } from "~/models/dbGuild.server";
import { APIGuild } from "~/requests/apiGuild.server";
import { APIGuildChannels } from "~/requests/apiGuildChannels.server";

function validURL(str: string) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

type LoaderData = {
  dbGuild: DBGuild;
  dbGuildEmbeds: DBGuildEmbeds;
  apiGuild: APIGuild;
  apiGuildChannels: APIGuildChannels;
};

export const EmbedCreator = () => {
  const { dbGuild, apiGuild, apiGuildChannels, dbGuildEmbeds } =
    useLoaderData() as LoaderData;

  const { pathname } = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const modals = useModals();

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      url: "",
      footer_text: "",
      footer_icon_url: "",
      color: "#000000",
      image_url: "",
      thumbnail_url: "",
      author_name: "",
      author_url: "",
      author_avatar_url: "",
      fields: [
        {
          name: "",
          value: "",
          inline: false,
        },
      ],
    },
    validationRules: {
      title: (value, form) => value !== "" || form?.description !== "",
      description: (value, form) => value !== "" || form?.title !== "",
      url: (value) => value === "" || validURL(value),
      footer_icon_url: (value) => value === "" || validURL(value),
      image_url: (value) => value === "" || validURL(value),
      thumbnail_url: (value) => value === "" || validURL(value),
      author_avatar_url: (value) => value === "" || validURL(value),
      author_url: (value) => value === "" || validURL(value),
    },
    errorMessages: {
      title: "Either title or description required",
      description: "Either title or description required",
      url: "Must be a valid URL",
      footer_icon_url: "Must be a valid URL",
      image_url: "Must be a valid URL",
      thumbnail_url: "Must be a valid URL",
      author_avatar_url: "Must be a valid URL",
      author_url: "Must be a valid URL",
    },
  });

  useEffect(() => {
    form.setFieldValue("fields", []);
  }, []);

  const embed = {
    title: form.values.title || undefined,
    description: form.values.description || undefined,
    url: form.values.url || undefined,
    color: form.values.color
      ? parseInt(form.values.color.substring(1), 16)
      : undefined,
    footer: form.values.footer_text
      ? {
          text: form.values.footer_text || undefined,
          icon_url: form.values.footer_icon_url || undefined,
        }
      : undefined,
    ...(form.values.author_name
      ? {
          author: {
            name: form.values.author_name,
            url: form.values.author_url || undefined,
            icon_url: form.values.author_avatar_url || undefined,
          },
        }
      : undefined),
    image: form.values.image_url
      ? {
          url: form.values.image_url,
        }
      : undefined,
    thumbnail: {
      url: form.values.thumbnail_url || undefined,
    },
    fields:
      form.values.fields.length !== 0
        ? form.values.fields
            .filter((field) => field.name && field.value)
            .map((field) => ({
              name: field.name,
              value: field.value,
              inline: field.inline,
            }))
        : undefined,
  };

  return (
    <Group style={{ alignItems: "start" }} pt="md" spacing="xl" grow>
      <form
        onSubmit={form.onSubmit((values) => {
          let formData = new FormData();
          formData.append("embed", JSON.stringify(embed));

          fetch(pathname, {
            body: formData,
            method: "post",
          }).then(async (res) => {
            if (!res.ok) {
              const text = await res.text();
              openError(modals, text);
            } else {
              navigate(`/${params.guild}/apps/embed-generator`);
            }
          });
        })}
      >
        <Stack>
          <TextInput
            label="Title"
            placeholder=""
            {...form.getInputProps("title")}
          />
          <TextInput
            label="Description"
            placeholder=""
            {...form.getInputProps("description")}
          />
          <TextInput
            label="URL"
            placeholder=""
            {...form.getInputProps("url")}
          />
          <ColorInput
            label="Color"
            placeholder=""
            disallowInput
            {...form.getInputProps("color")}
          />

          <Accordion>
            <Accordion.Item label="Images">
              <Stack>
                <TextInput
                  label="Image URL"
                  placeholder=""
                  {...form.getInputProps("image_url")}
                />
                <TextInput
                  label="Thumbnail URL"
                  placeholder=""
                  {...form.getInputProps("thumbnail_url")}
                />
              </Stack>
            </Accordion.Item>
            <Accordion.Item label="Author">
              <Stack>
                <TextInput
                  label="Name"
                  placeholder=""
                  {...form.getInputProps("author_name")}
                />
                <TextInput
                  label="URL"
                  placeholder=""
                  {...form.getInputProps("author_url")}
                />
                <TextInput
                  label="Avatar URL"
                  placeholder=""
                  {...form.getInputProps("author_avatar_url")}
                />
              </Stack>
            </Accordion.Item>
            <Accordion.Item label="Footer">
              <Stack>
                <TextInput
                  label="Text"
                  placeholder=""
                  {...form.getInputProps("footer_text")}
                />
                <TextInput
                  label="Icon URL"
                  placeholder=""
                  {...form.getInputProps("footer_icon_url")}
                />
              </Stack>
            </Accordion.Item>
            <Accordion.Item label="Fields">
              <Stack spacing="xl">
                {...form.values.fields.map((field, idx) => (
                  <Stack key={idx}>
                    <TextInput
                      required
                      label="Name"
                      placeholder=""
                      value={field.name}
                      onChange={(click) => {
                        const shallowCopy = [...form.values.fields];
                        shallowCopy[idx].name = click.target.value;
                        form.setFieldValue("fields", shallowCopy);
                      }}
                    />
                    <TextInput
                      required
                      label="Value"
                      placeholder=""
                      value={field.value}
                      onChange={(click) => {
                        const shallowCopy = [...form.values.fields];
                        shallowCopy[idx].value = click.target.value;
                        form.setFieldValue("fields", shallowCopy);
                      }}
                    />
                    <Checkbox
                      label="Inline"
                      placeholder=""
                      checked={field.inline}
                      onChange={(click) => {
                        const shallowCopy = [...form.values.fields];
                        shallowCopy[idx].inline = click.target.checked;
                        form.setFieldValue("fields", shallowCopy);
                      }}
                    />
                    <Button
                      onClick={() => {
                        let shallowCopy = [...form.values.fields];
                        shallowCopy = shallowCopy.filter(
                          (x, _idx) => _idx !== idx
                        );
                        form.setFieldValue("fields", shallowCopy);
                      }}
                      color="red"
                    >
                      Remove Field
                    </Button>
                  </Stack>
                ))}
                <Button
                  onClick={() => {
                    const shallowCopy = [...form.values.fields];
                    shallowCopy.push({
                      name: "",
                      value: "",
                      inline: false,
                    });
                    form.setFieldValue("fields", shallowCopy);
                  }}
                >
                  Add Field
                </Button>
              </Stack>
            </Accordion.Item>
          </Accordion>
        </Stack>

        <Group mt="md">
          <Button type="submit">Create</Button>
        </Group>
      </form>
      <EmbedVisualizer
        onError={(error: any) => console.log(error)}
        embed={{
          embed,
        }}
      />
    </Group>
  );
};
