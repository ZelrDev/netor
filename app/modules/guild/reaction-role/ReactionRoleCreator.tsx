import discordReaction from "~/media/images/discord_reaction.png";
import discordButton from "~/media/images/discord_button.png";
import {
  CheckIcon,
  ExclamationCircleIcon,
  PlusIcon,
} from "@heroicons/react/solid";
import {
  Alert,
  Button,
  Group,
  Image,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Stepper,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { useState } from "react";
import type { DBGuildEmbeds } from "~/models/dbGuild.server";
import type { APIGuildRoles } from "~/api-requests/apiGuildRoles.server";
import { Embeds } from "../embed/Embeds";

type valueof<T> = T[keyof T];

const filterRoles = (roles: APIGuildRoles) =>
  roles.filter((role) => role.name !== "@everyone" && !role.managed);

export const ReactionRoleCreator = (props: {
  dbGuildEmbeds: DBGuildEmbeds;
  apiGuildRoles: APIGuildRoles;
}) => {
  type FormValuesKey = keyof typeof form.values;
  type FormValues = typeof form.values;
  type FormValuesValues = valueof<typeof form.values>;
  type Validation = (value: FormValuesValues, form: FormValues) => boolean;
  const [active, setActive] = useState(0);
  const { dbGuildEmbeds, apiGuildRoles } = props;

  const validate = (rule?: FormValuesKey) => {
    let errors = false;
    for (let _value in form.values) {
      let activeRule = true;
      if (rule) if (rule !== _value) activeRule = false;
      if (activeRule) {
        let value = _value as FormValuesKey;
        let validation: Validation = () => true;
        for (const key in validationRules)
          key === value && (validation = validationRules[key]);
        !validation(form.values[value], form.values) && (errors = true);
      }
    }
    return !errors;
  };

  const validateStep = (silent?: boolean) => {
    if (
      active === 0 &&
      form.values.message_type === "message" &&
      !validate("content")
    ) {
      if (silent) return false;
      form.setFieldError("content", "Content is required");
      return false;
    }
    if (
      active === 0 &&
      form.values.message_type === "embed" &&
      !validate("embed_id")
    ) {
      if (silent) return false;
      form.setFieldError("embed_id", "Embed is required");
      return false;
    }

    return true;
  };

  const nextStep = () => {
    const valid = validateStep();
    if (valid) setActive((current) => (current < 3 ? current + 1 : current));
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const form = useForm({
    initialValues: {
      message_type: "message",
      content: "",
      embed_id: 0,
      role_id: 0,
    },
  });

  const validationRules: { [key: string]: Validation } = {
    content: (value) => value !== "",
    embed_id: (value) => value !== 0,
    role_id: (value) => value !== 0,
  };

  return (
    <>
      <Stepper
        mt="xl"
        style={{ maxWidth: 1200 }}
        active={active}
        onStepClick={setActive}
        breakpoint="sm"
      >
        <Stepper.Step label="Message" description="Message to send">
          <Stack>
            <RadioGroup required {...form.getInputProps("message_type")}>
              <Radio value="message" label="Message" />
              <Radio value="embed" label="Embed" />
            </RadioGroup>

            {form.values.message_type == "message" ? (
              <TextInput
                style={{ maxWidth: 400 }}
                required
                placeholder="Message"
                {...form.getInputProps("content")}
              />
            ) : (
              <>
                <Embeds
                  action={({ embed }) => (
                    <Button
                      onClick={() => {
                        form.setFieldValue("embed_id", embed.id);
                      }}
                      color="green"
                      disabled={embed.id === form.values.embed_id}
                      leftIcon={
                        embed.id === form.values.embed_id && (
                          <CheckIcon height={20} />
                        )
                      }
                    >
                      {embed.id === form.values.embed_id
                        ? "Selected"
                        : "Select"}
                    </Button>
                  )}
                  embeds={dbGuildEmbeds}
                />
                {form.errors.embed_id && (
                  <Alert
                    icon={<ExclamationCircleIcon height={16} />}
                    color="red"
                  >
                    {form.errors.embed_id}
                  </Alert>
                )}
              </>
            )}
          </Stack>
        </Stepper.Step>
        <Stepper.Step label="User Input" description="Reactions or buttons">
          <Group>
            <Paper
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0],
              })}
              shadow="md"
              p="md"
            >
              <Text
                weight={700}
                size="md"
                style={{ letterSpacing: "0.1em" }}
                color="gray"
                align="center"
              >
                SELECT YOUR STYLE
              </Text>
              <Group my="sm" grow style={{ width: 400 }}>
                <Paper
                  radius="md"
                  sx={(theme) => ({
                    transitionProperty: "all",
                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                    transitionDuration: "150ms",
                    "&:hover": {
                      backgroundColor:
                        theme.colorScheme === "dark"
                          ? theme.colors.indigo[9]
                          : theme.colors.indigo[0],
                      transform: "translateY(-0.25rem)",
                    },
                  })}
                >
                  <Image radius="md" src={discordButton} />
                  <Text weight={500} size="xs" mt="xs" align="center" mb="md">
                    EMOJIS + TEXT
                  </Text>
                </Paper>
                <Paper
                  radius="md"
                  sx={(theme) => ({
                    transitionProperty: "all",
                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                    transitionDuration: "150ms",
                    "&:hover": {
                      backgroundColor:
                        theme.colorScheme === "dark"
                          ? theme.colors.indigo[9]
                          : theme.colors.indigo[0],
                      transform: "translateY(-0.25rem)",
                    },
                  })}
                >
                  <Image radius="md" src={discordReaction} />
                  <Text weight={500} size="xs" mt="xs" align="center" mb="md">
                    EMOJIS ONLY
                  </Text>
                </Paper>
              </Group>

              <Select
                onChange={(role) => {
                  role && form.setFieldValue("role_id", parseInt(role));
                }}
                style={{ maxWidth: 400 }}
                data={filterRoles(apiGuildRoles).map((role) => ({
                  label: role.name,
                  value: role.id.toString(),
                }))}
                placeholder="Select role"
              />
            </Paper>
            <Paper
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0],
              })}
              shadow="md"
              p="md"
            >
              <PlusIcon height={24} />
              <Text size="sm" weight={600}>
                Add another action
              </Text>
            </Paper>
          </Group>
        </Stepper.Step>
        <Stepper.Step
          label="Select role"
          description="Select role for when user interacts"
        >
          <Stack>
            <Select
              onChange={(role) => {
                role && form.setFieldValue("role_id", parseInt(role));
              }}
              style={{ maxWidth: 400 }}
              data={filterRoles(apiGuildRoles).map((role) => ({
                label: role.name,
                value: role.id.toString(),
              }))}
              placeholder="Select role"
            />
          </Stack>
        </Stepper.Step>
        <Stepper.Completed>
          Completed, click back button to get to previous step
        </Stepper.Completed>
      </Stepper>

      <Group mt="xl">
        <Button disabled={active === 0} variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button disabled={!validateStep(true)} onClick={nextStep}>
          Next step
        </Button>
      </Group>
    </>
  );
};
