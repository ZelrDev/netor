import { Code, Title, Text } from "@mantine/core";
import { ModalsContextProps } from "@mantine/modals/lib/context";

export const openError = (modals: ModalsContextProps, error: string) => {
  const formattedError = error
    .replace("<!DOCTYPE html>", "")
    .replace("Invariant failed: ", "")
    .replace("MSG: ", "");
  modals.openModal({
    size: "lg",
    centered: true,
    title: <Title order={2}>Uh oh, something has gone wrong</Title>,
    children: (
      <>
        <Text dangerouslySetInnerHTML={{ __html: formattedError }}></Text>
      </>
    ),
  });
};
