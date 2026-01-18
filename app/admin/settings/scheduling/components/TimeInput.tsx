import { ActionIcon, useMantineTheme } from "@mantine/core";
import { TimeInput as MantineTimeInput } from "@mantine/dates";
import { IconClock } from "@tabler/icons-react";
import { useRef } from "react";

type Props = {
  schedule_slot_id: string;
  value: string;
  updateSlot: (schedule_slot_id: string, value: string) => void;
};

const TimeInput = ({ schedule_slot_id, value, updateSlot }: Props) => {
  const theme = useMantineTheme();

  const ref = useRef<HTMLInputElement>(null);
  const pickerControl = (
    <ActionIcon variant="subtle" color="gray" onClick={() => ref.current?.showPicker()}>
      <IconClock size={16} stroke={1.5} />
    </ActionIcon>
  );
  return (
    <MantineTimeInput
      value={value}
      onChange={(e) => {
        updateSlot(schedule_slot_id, e.currentTarget.value);
      }}
      styles={{
        input: {
          fontWeight: 600,
          border: `2px solid ${theme.colors.cyan[2]}`,
        },
      }}
      ref={ref}
      rightSection={pickerControl}
      size="md"
    />
  );
};

export default TimeInput;
