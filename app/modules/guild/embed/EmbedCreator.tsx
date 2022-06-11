import {
  Accordion,
  Button,
  Checkbox,
  ColorInput,
  Group,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { EmbedVisualizer } from "embed-visualizer";
import { useEffect } from "react";
import type DiscordEmbed from "types/DiscordEmbed";
import type { APIGuild } from "~/api-requests/apiGuild.server";
import { useTypeSafeTranslation } from "~/shared-hooks/use-type-safe-translation";
import { useGuild } from "../use-guild";

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

export const EmbedCreator = (props: {
  apiGuild: APIGuild;
  onCreate?: (embed: DiscordEmbed) => void;
}) => {
  const { t } = useTypeSafeTranslation();
  const { createEmbed } = useGuild(props.apiGuild);

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
      title: t("errors.embedCreator.content"),
      description: t("errors.embedCreator.content"),
      url: t("errors.embedCreator.validURL"),
      footer_icon_url: t("errors.embedCreator.validURL"),
      image_url: t("errors.embedCreator.validURL"),
      thumbnail_url: t("errors.embedCreator.validURL"),
      author_avatar_url: t("errors.embedCreator.validURL"),
      author_url: t("errors.embedCreator.validURL"),
    },
  });

  useEffect(() => {
    form.setFieldValue("fields", []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          props.onCreate && props.onCreate(embed);
          setTimeout(() => createEmbed(embed), 50);
        })}
      >
        <Stack>
          <TextInput
            label={t("modules.embedGenerator.creator.title")}
            placeholder=""
            {...form.getInputProps("title")}
          />
          <TextInput
            label={t("modules.embedGenerator.creator.description")}
            placeholder=""
            {...form.getInputProps("description")}
          />
          <TextInput
            label={t("modules.embedGenerator.creator.url")}
            placeholder=""
            {...form.getInputProps("url")}
          />
          <ColorInput
            label={t("modules.embedGenerator.creator.color")}
            placeholder=""
            disallowInput
            {...form.getInputProps("color")}
          />

          <Accordion>
            <Accordion.Item
              label={t(
                "modules.embedGenerator.creator.categories.images.title"
              )}
            >
              <Stack>
                <TextInput
                  label={t(
                    "modules.embedGenerator.creator.categories.images.imageUrl"
                  )}
                  placeholder=""
                  {...form.getInputProps("image_url")}
                />
                <TextInput
                  label={t(
                    "modules.embedGenerator.creator.categories.images.thumbnailUrl"
                  )}
                  placeholder=""
                  {...form.getInputProps("thumbnail_url")}
                />
              </Stack>
            </Accordion.Item>
            <Accordion.Item
              label={t(
                "modules.embedGenerator.creator.categories.author.title"
              )}
            >
              <Stack>
                <TextInput
                  label={t(
                    "modules.embedGenerator.creator.categories.author.name"
                  )}
                  placeholder=""
                  {...form.getInputProps("author_name")}
                />
                <TextInput
                  label={t(
                    "modules.embedGenerator.creator.categories.author.url"
                  )}
                  placeholder=""
                  {...form.getInputProps("author_url")}
                />
                <TextInput
                  label={t(
                    "modules.embedGenerator.creator.categories.author.avatarUrl"
                  )}
                  placeholder=""
                  {...form.getInputProps("author_avatar_url")}
                />
              </Stack>
            </Accordion.Item>
            <Accordion.Item
              label={t(
                "modules.embedGenerator.creator.categories.footer.title"
              )}
            >
              <Stack>
                <TextInput
                  label={t(
                    "modules.embedGenerator.creator.categories.footer.text"
                  )}
                  placeholder=""
                  {...form.getInputProps("footer_text")}
                />
                <TextInput
                  label={t(
                    "modules.embedGenerator.creator.categories.footer.iconUrl"
                  )}
                  placeholder=""
                  {...form.getInputProps("footer_icon_url")}
                />
              </Stack>
            </Accordion.Item>
            <Accordion.Item
              label={t(
                "modules.embedGenerator.creator.categories.fields.title"
              )}
            >
              <Stack spacing="xl">
                {...form.values.fields.map((field, idx) => (
                  <Stack key={idx}>
                    <TextInput
                      required
                      label={t(
                        "modules.embedGenerator.creator.categories.fields.name"
                      )}
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
                      label={t(
                        "modules.embedGenerator.creator.categories.fields.value"
                      )}
                      placeholder=""
                      value={field.value}
                      onChange={(click) => {
                        const shallowCopy = [...form.values.fields];
                        shallowCopy[idx].value = click.target.value;
                        form.setFieldValue("fields", shallowCopy);
                      }}
                    />
                    <Checkbox
                      label={t(
                        "modules.embedGenerator.creator.categories.fields.inline"
                      )}
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
                      {t(
                        "modules.embedGenerator.creator.categories.fields.removeField"
                      )}
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
                  {t(
                    "modules.embedGenerator.creator.categories.fields.addField"
                  )}
                </Button>
              </Stack>
            </Accordion.Item>
          </Accordion>
        </Stack>

        <Group mt="md">
          <Button type="submit">{t("common.create")}</Button>
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
