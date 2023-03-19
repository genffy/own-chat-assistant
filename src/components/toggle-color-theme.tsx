import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";

export default function ToggleColorTheme() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <ActionIcon variant='outline' onClick={() => toggleColorScheme()} title='Toggle color scheme'>
      {dark ? <IconSun /> : <IconMoonStars />}
    </ActionIcon>
  );
}
