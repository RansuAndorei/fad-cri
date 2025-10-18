import { insertError } from "@/app/actions";
import { useUserData } from "@/stores/useUserStore";
import { ROW_PER_PAGE } from "@/utils/constants";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { DashboardClientType, DashboardTypeType, StackedBarChartDataType } from "@/utils/types";
import { Box, Flex, LoadingOverlay, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { isError } from "lodash";
import moment from "moment";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  getAppointmentStatusCount,
  getAppointmentStatusMonthlyCount,
  getDashboardClientList,
  getDashboardTypeList,
} from "../../action";
import { RadialChartData } from "../Chart/RadialChart";
import AppointmentStatusTracker from "./AppointmentStatusTracker";
import ClientTable from "./ClientTable/ClientTable";
import MonthlyStatistics from "./MonthlyStatistics";
import TypeTable from "./TypeTable/TypeTable";

type Props = {
  startDateFilter: Date | null;
  endDateFilter: Date | null;
  selectedDays: string | null;
  setIsFetching: Dispatch<SetStateAction<boolean>>;
};

const Overview = ({ startDateFilter, endDateFilter, selectedDays, setIsFetching }: Props) => {
  const supabaseClient = createSupabaseBrowserClient();
  const pathname = usePathname();
  const userData = useUserData();

  const [isFetchingTotalAppointments, setIsFetchingTotalAppointments] = useState(true);
  const [isFetchingClient, setIsFetchingClient] = useState(true);
  const [isFetchingType, setIsFetchingType] = useState(true);
  const [isFetchingMonthlyStatistics, setIsFetchingMonthlyStatistics] = useState(false);

  const [appointmentStatusCount, setAppointmentStatusCount] = useState<RadialChartData[] | null>(
    null,
  );
  const [totalAppointmentCount, setTotalAppointmentCount] = useState(0);
  const [clientList, setClientList] = useState<DashboardClientType[]>([]);
  const [clientOffset, setClientOffset] = useState(0);
  const [isClientFetchable, setIsClientFetchable] = useState(true);

  const [totalTypeCount, setTotalTypeCount] = useState(0);
  const [typeList, setTypeList] = useState<DashboardTypeType[]>([]);
  const [typeOffset, setTypeOffset] = useState(0);
  const [isTypeFetchable, setIsTypeFetchable] = useState(true);

  const [monthlyChartData, setMonthlyChartData] = useState<StackedBarChartDataType[]>([]);

  useEffect(() => {
    if (!startDateFilter || !endDateFilter) return;
    const fetchOverviewData = async () => {
      endDateFilter?.setHours(23, 59, 59, 999);

      try {
        setIsFetching(true);
        setIsFetchingTotalAppointments(true);
        setIsFetchingClient(true);
        setIsFetchingMonthlyStatistics(true);

        const [
          { appointmentStatusCountData, totalCount },
          clientList,
          typeList,
          monthlyRequestData,
        ] = await Promise.all([
          getAppointmentStatusCount(supabaseClient, {
            startDate: moment(startDateFilter).format(),
            endDate: moment(endDateFilter).format(),
          }),
          getDashboardClientList(supabaseClient, {
            offset: clientOffset,
            limit: ROW_PER_PAGE,
            startDate: moment(startDateFilter).format(),
            endDate: moment(endDateFilter).format(),
          }),
          getDashboardTypeList(supabaseClient, {
            offset: typeOffset,
            limit: ROW_PER_PAGE,
            startDate: moment(startDateFilter).format(),
            endDate: moment(endDateFilter).format(),
          }),
          getAppointmentStatusMonthlyCount(supabaseClient, {
            startDate: moment(startDateFilter).format(),
            endDate: moment(endDateFilter).format(),
          }),
        ]);

        setAppointmentStatusCount(appointmentStatusCountData);
        setTotalAppointmentCount(totalCount);
        setTotalTypeCount(totalTypeCount);
        setClientList(clientList);
        setTypeList(typeList);
        setMonthlyChartData(monthlyRequestData.data);

        if (clientList.length < ROW_PER_PAGE) {
          setIsClientFetchable(false);
        }
        if (typeList.length < ROW_PER_PAGE) {
          setIsTypeFetchable(false);
        }
      } catch (e) {
        notifications.show({
          message: "Something went wrong. Please try again later.",
          color: "red",
        });
        if (isError(e)) {
          await insertError(supabaseClient, {
            errorTableInsert: {
              error_message: e.message,
              error_url: pathname,
              error_function: "fetchOverviewData",
              error_user_email: userData?.email,
              error_user_id: userData?.id,
            },
          });
        }
      } finally {
        setIsFetching(false);
        setIsFetchingTotalAppointments(false);
        setIsFetchingClient(false);
        setIsFetchingType(false);
        setIsFetchingMonthlyStatistics(false);
      }
    };
    fetchOverviewData();
  }, [selectedDays, startDateFilter, endDateFilter]);

  const loadMoreClient = async () => {
    try {
      setIsFetchingClient(true);
      const clientList = await getDashboardClientList(supabaseClient, {
        offset: clientOffset,
        limit: ROW_PER_PAGE,
        startDate: moment(startDateFilter).format(),
        endDate: moment(endDateFilter).format(),
      });
      setClientList(clientList);
      if (clientList.length < ROW_PER_PAGE) {
        setIsClientFetchable(false);
      }
    } catch (e) {
      notifications.show({
        message: "Something went wrong. Please try again later.",
        color: "red",
      });
      if (isError(e)) {
        await insertError(supabaseClient, {
          errorTableInsert: {
            error_message: e.message,
            error_url: pathname,
            error_function: "loadMoreClient",
            error_user_email: userData?.email,
            error_user_id: userData?.id,
          },
        });
      }
    } finally {
      setIsFetchingClient(false);
    }
  };

  const loadMoreType = async () => {
    try {
      setIsFetchingType(true);
      const typeList = await getDashboardTypeList(supabaseClient, {
        offset: typeOffset,
        limit: ROW_PER_PAGE,
        startDate: moment(startDateFilter).format(),
        endDate: moment(endDateFilter).format(),
      });
      setTypeList(typeList);
      if (typeList.length < ROW_PER_PAGE) {
        setIsTypeFetchable(false);
      }
    } catch (e) {
      notifications.show({
        message: "Something went wrong. Please try again later.",
        color: "red",
      });
      if (isError(e)) {
        await insertError(supabaseClient, {
          errorTableInsert: {
            error_message: e.message,
            error_url: pathname,
            error_function: "loadMoreType",
            error_user_email: userData?.email,
            error_user_id: userData?.id,
          },
        });
      }
    } finally {
      setIsFetchingType(false);
    }
  };

  return (
    <Stack w="100%" align="center" pos="relative">
      <Flex w="100%" align="flex-start" justify={{ xl: "space-between" }} gap="md" wrap="wrap">
        <Box w={{ base: "100%", sm: 360 }} h={470} pos="relative">
          <LoadingOverlay
            visible={isFetchingTotalAppointments}
            loaderProps={{ type: "bars" }}
            overlayProps={{ blur: 0, opacity: 0.5 }}
          />

          <AppointmentStatusTracker
            data={appointmentStatusCount || []}
            totalAppointmentCount={totalAppointmentCount}
          />
        </Box>
        <Box w={{ base: "100%", sm: 300 }} h={470} pos="relative">
          <LoadingOverlay
            visible={isFetchingClient}
            loaderProps={{ type: "bars" }}
            overlayProps={{ blur: 0, opacity: 0.5 }}
          />
          <ClientTable
            clientList={clientList.length > 0 ? clientList : []}
            loadMoreClient={loadMoreClient}
            isClientFetchable={isClientFetchable}
            clientOffset={clientOffset}
            setClientOffset={setClientOffset}
          />
        </Box>
        <Box w={{ base: "100%", sm: 300 }} h={470} pos="relative">
          <LoadingOverlay
            visible={isFetchingType}
            loaderProps={{ type: "bars" }}
            overlayProps={{ blur: 0, opacity: 0.5 }}
          />
          <TypeTable
            typeList={typeList.length > 0 ? typeList : []}
            loadMoreType={loadMoreType}
            isTypeFetchable={isTypeFetchable}
            typeOffset={typeOffset}
            setTypeOffset={setTypeOffset}
          />
        </Box>
      </Flex>
      <Flex w="100%" align="flex-start" gap="xl" wrap="wrap">
        <Box style={{ flex: 1 }} w="100%" pos="relative">
          <LoadingOverlay
            visible={isFetchingMonthlyStatistics}
            loaderProps={{ type: "bars" }}
            overlayProps={{ blur: 0, opacity: 0.5 }}
          />
          <MonthlyStatistics
            monthlyChartData={monthlyChartData}
            startDateFilter={startDateFilter}
            endDateFilter={endDateFilter}
          />
        </Box>
      </Flex>
    </Stack>
  );
};

export default Overview;
