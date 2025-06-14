import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";

const ColorSchemeToggle = () => {
  const { setColorScheme, colorScheme } = useMantineColorScheme();

  return (
    <ActionIcon
      onClick={() => setColorScheme(colorScheme === "light" ? "dark" : "light")}
      variant="light"
    >
      {colorScheme === "dark" ? <IconSun size={16} /> : <IconMoonStars size={16} />}
    </ActionIcon>
  );
};

export default ColorSchemeToggle;
