"use client";

import { insertError } from "@/app/actions";
import { useUserData } from "@/stores/useUserStore";
import { ROW_PER_PAGE } from "@/utils/constants";
import { formatDate, formatTime, formatWordDate, statusToColor } from "@/utils/functions";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { AppointmentStatusEnum, AppointmentTableType } from "@/utils/types";
import {
  ActionIcon,
  Badge,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconArrowsMaximize, IconCalendarMonth } from "@tabler/icons-react";
import { isError } from "lodash";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { getAppointmentList } from "../actions";
import AppointmentFilter from "./AppointmentFilter";

export type AppointmentTableFilterType = {
  type: string | null;
  status: AppointmentStatusEnum | null;
};

type Props = {
  initialAppointmentList: AppointmentTableType[];
  initialAppointmentListCount: number;
  appointmentTypeOptions: string[];
};

const AppointmentListPage = ({
  initialAppointmentList,
  initialAppointmentListCount,
  appointmentTypeOptions,
}: Props) => {
  const supabaseClient = createSupabaseBrowserClient();
  const userData = useUserData();
  const router = useRouter();
  const pathname = usePathname();
  const { colors } = useMantineTheme();

  const [appointmentList, setAppointmentList] = useState(initialAppointmentList);
  const [appointmentListCount, setAppointmentListCount] = useState(initialAppointmentListCount);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<AppointmentTableType>>({
    columnAccessor: "appointment_date_created",
    direction: "desc",
  });
  const [navigatingAppointment, setNavigatingAppointment] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
      return;
    }
    const values = getValues();
    fetchAppointmentList({ ...values, page });
  }, [sortStatus]);

  const methods = useForm<AppointmentTableFilterType>({
    defaultValues: {
      type: null,
      status: null,
    },
  });
  const { getValues, handleSubmit } = methods;

  const fetchAppointmentList = async (formData: AppointmentTableFilterType & { page: number }) => {
    if (!userData) {
      notifications.show({
        message: "User data is not available. Please refresh the page.",
        color: "red",
      });
      return;
    }
    try {
      setIsLoading(true);
      const { type, status, page } = formData;

      const { data, count } = await getAppointmentList(supabaseClient, {
        page,
        limit: ROW_PER_PAGE,
        sortStatus,
        userId: userData.id,
        type,
        status,
      });
      setAppointmentList(data);
      setAppointmentListCount(count);
    } catch (e) {
      if (isError(e)) {
        await insertError(supabaseClient, {
          errorTableInsert: {
            error_message: e.message,
            error_url: pathname,
            error_function: "fetchAppointmentList",
            error_user_id: userData.id,
          },
        });
      }
      notifications.show({
        message: "Something went wrong. Please try again later.",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePagination = async (newPage: number) => {
    if (page === newPage) return;
    setPage(newPage);
    const values = getValues();
    await fetchAppointmentList({ ...values, page: newPage });
  };

  const onSubmit = async (data: AppointmentTableFilterType) => {
    await fetchAppointmentList({ ...data, page: 1 });
  };

  const handleRefresh = async () => {
    const values = getValues();
    await fetchAppointmentList({ ...values, page });
  };

  return (
    <Container py="xl">
      <Stack gap="xs">
        <Group mb="md" wrap="nowrap">
          <IconCalendarMonth color="gray" />
          <Title order={2}>Appointment List</Title>
        </Group>
        <Paper shadow="xl" withBorder p="xl">
          <Stack gap="sm">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <AppointmentFilter
                  handleRefresh={handleRefresh}
                  isLoading={isLoading}
                  appointmentTypeOptions={appointmentTypeOptions}
                />
              </form>
            </FormProvider>
            <DataTable<AppointmentTableType>
              className="custom-appointment-table"
              minHeight={400}
              idAccessor="appointment_id"
              withTableBorder
              highlightOnHover
              striped
              records={appointmentList}
              totalRecords={appointmentListCount}
              recordsPerPage={ROW_PER_PAGE}
              fetching={isLoading}
              page={page}
              onPageChange={handlePagination}
              sortStatus={sortStatus}
              onSortStatusChange={setSortStatus}
              styles={{
                header: {
                  fontStyle: "italic",
                  backgroundColor: colors.cyan[7],
                  color: "white",
                  transition: "background-color 0.2s ease",
                },
              }}
              columns={[
                {
                  accessor: "appointment_detail.appointment_detail_type",
                  title: "Appointment Type",
                  render: ({ appointment_detail }) => (
                    <Text>{appointment_detail.appointment_detail_type}</Text>
                  ),
                },
                {
                  accessor: "appointment_date_created",
                  title: "Date Created",
                  textAlign: "center",
                  sortable: true,
                  render: ({ appointment_date_created }) => (
                    <Text>{formatDate(new Date(appointment_date_created))}</Text>
                  ),
                },
                {
                  accessor: "appointment_status",
                  title: "Appointment Status",
                  textAlign: "center",
                  render: ({ appointment_status }) => (
                    <Badge color={statusToColor(appointment_status)}>{appointment_status}</Badge>
                  ),
                },
                {
                  accessor: "appointment_schedule",
                  title: "Date Scheduled",
                  sortable: true,
                  render: ({ appointment_schedule }) => (
                    <Stack gap={0}>
                      <Text>Date: {formatWordDate(new Date(appointment_schedule))}</Text>
                      <Text>Time: {formatTime(new Date(appointment_schedule))}</Text>
                    </Stack>
                  ),
                },
                {
                  accessor: "appointment_id",
                  title: "View",
                  textAlign: "center",
                  render: ({ appointment_id }) => (
                    <ActionIcon
                      onClick={() => {
                        if (navigatingAppointment) return;
                        setNavigatingAppointment(appointment_id);
                        router.push(`/user/appointment/${appointment_id}`);
                      }}
                      variant="light"
                      disabled={
                        Boolean(navigatingAppointment) && navigatingAppointment !== appointment_id
                      }
                      loading={
                        Boolean(navigatingAppointment) && navigatingAppointment === appointment_id
                      }
                    >
                      <IconArrowsMaximize size={14} />
                    </ActionIcon>
                  ),
                },
              ]}
            />
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default AppointmentListPage;
