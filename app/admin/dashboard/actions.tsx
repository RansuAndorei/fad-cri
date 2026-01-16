import { APPOINTMENT_STATUS_OPTIONS } from "@/utils/constants";
import { Database } from "@/utils/database";
import { StackedBarChartDataType } from "@/utils/types";
import { SupabaseClient } from "@supabase/supabase-js";
import moment from "moment";

export const getAppointmentStatusCount = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    startDate: string;
    endDate: string;
  },
) => {
  const { data, error } = await supabaseClient
    .rpc("get_appointment_status_count", {
      input_data: {
        ...params,
        appointmentStatusList: APPOINTMENT_STATUS_OPTIONS.map(({ value }) => value),
      },
    })
    .select("*");
  if (error) throw error;

  const formattedData = data as unknown as {
    data: { label: string; value: number }[];
    totalCount: number;
  };

  return {
    appointmentStatusCountData: formattedData.data,
    totalCount: formattedData.totalCount,
  };
};

export const getDashboardClientList = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    offset: number;
    limit: number;
    startDate: string;
    endDate: string;
  },
) => {
  const { data, error } = await supabaseClient
    .rpc("get_dashboard_client_list", {
      input_data: params,
    })
    .select("*");
  if (error) throw error;

  return data;
};

export const getDashboardTypeList = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    offset: number;
    limit: number;
    startDate: string;
    endDate: string;
  },
) => {
  const { data, error } = await supabaseClient
    .rpc("get_dashboard_type_list", {
      input_data: params,
    })
    .select("*");
  if (error) throw error;

  return data;
};

export const getAppointmentStatusMonthlyCount = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    startDate: string;
    endDate: string;
  },
) => {
  const { startDate, endDate } = params;

  const startDateObj = moment(startDate);
  const endDateObj = moment(endDate).endOf("month");

  const monthRanges = [];
  while (startDateObj.isSameOrBefore(endDateObj, "month")) {
    const startOfMonth = startDateObj.clone().startOf("month");
    const endOfMonth = startDateObj.clone().endOf("month");

    monthRanges.push({
      start_of_month: startOfMonth.format(),
      end_of_month: endOfMonth.isSameOrBefore(endDateObj)
        ? endOfMonth.format()
        : endDateObj.format(),
    });

    startDateObj.add(1, "month");
  }

  const [{ data: monthlyData, error: monthlyError }, { data: totalCount, error: totalError }] =
    await Promise.all([
      supabaseClient
        .rpc("get_appointment_status_monthly_count", {
          input_data: {
            monthRanges,
          },
        })
        .select("*"),
      supabaseClient
        .rpc("get_appointment_total_count", {
          input_data: {
            startDate,
            endDate,
          },
        })
        .select("*"),
    ]);
  if (monthlyError) throw monthlyError;
  if (totalError) throw totalError;
  return {
    data: monthlyData as StackedBarChartDataType[],
    totalCount: Number(totalCount),
  };
};
