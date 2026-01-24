import { APPOINTMENT_STATUS_OPTIONS } from "@/utils/constants";
import { SelectDataType } from "@/utils/types";
import { Button, Divider, Flex, Select } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { Controller, useFormContext } from "react-hook-form";
import { AppointmentTableFilterType } from "./AppointmentListPage";

type Props = {
  handleRefresh: () => Promise<void>;
  isLoading: boolean;
  serviceTypeOptions: string[];
  userList?: SelectDataType[];
};

const AppointmentFilter = ({ handleRefresh, isLoading, serviceTypeOptions, userList }: Props) => {
  const { control } = useFormContext<AppointmentTableFilterType>();

  return (
    <Flex gap="xs" wrap="wrap" align="center">
      <Flex gap="xs" align="center" className="flexGrow" justify="center">
        {userList ? (
          <Controller
            control={control}
            name="user"
            render={({ field: { value, onChange } }) => (
              <Select
                placeholder="Name"
                data={userList}
                className="flexGrow"
                clearable
                value={value}
                onChange={(value) => {
                  onChange(value);
                  handleRefresh();
                }}
              />
            )}
          />
        ) : null}
        <Controller
          control={control}
          name="type"
          render={({ field: { value, onChange } }) => (
            <Select
              placeholder="Service Type"
              data={serviceTypeOptions}
              className="flexGrow"
              clearable
              value={value}
              onChange={(value) => {
                onChange(value);
                handleRefresh();
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="status"
          render={({ field: { value, onChange } }) => (
            <Select
              placeholder="Appointment Status"
              data={APPOINTMENT_STATUS_OPTIONS}
              className="flexGrow"
              clearable
              value={value}
              onChange={(value) => {
                onChange(value);
                handleRefresh();
              }}
            />
          )}
        />
      </Flex>
      <Divider orientation="vertical" />
      <Button
        variant="light"
        leftSection={<IconRefresh size={14} />}
        onClick={async () => await handleRefresh()}
        disabled={isLoading}
        className="flexGrow"
      >
        Refresh
      </Button>
    </Flex>
  );
};

export default AppointmentFilter;
