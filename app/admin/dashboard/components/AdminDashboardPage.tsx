"use client";

import { DATE_FORMAT, TIME_ZONE } from "@/utils/constants";
import { Box, Container, Flex, Select, Stack, Title } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendarEvent } from "@tabler/icons-react";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import Overview from "./OverviewTab/Overview";

const DAYS_OPTIONS = [
  { value: "7", label: "Last Week" },
  { value: "30", label: "Last Month" },
  { value: "360", label: "Last Year" },
  { value: "0", label: "Custom" },
];

const AdminDashboardPage = () => {
  const [selectedDays, setSelectedDays] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  const currentDate = moment.tz(TIME_ZONE).toDate();
  const firstDayOfCurrentYear = moment({
    year: moment.tz(TIME_ZONE).year(),
    month: 0,
    day: 1,
  }).toDate();

  const [startDateFilter, setStartDateFilter] = useState<Date | null>(firstDayOfCurrentYear);
  const [endDateFilter, setEndDateFilter] = useState<Date | null>(currentDate);

  useEffect(() => {
    if (selectedDays && Number(selectedDays) > 0) {
      const currDate = new Date();
      const startDate = new Date(currentDate);
      startDate.setDate(currDate.getDate() - Number(selectedDays));

      setStartDateFilter(startDate);
      setEndDateFilter(currDate);
    }
  }, [selectedDays]);

  return (
    <Container p={0} maw={1024} h="100%">
      <Stack>
        <Title order={2}>Admin Dashboard</Title>

        <Stack>
          <Flex gap="xs" justify="flex-end">
            <Select
              label="Date"
              placeholder="Select days"
              data={DAYS_OPTIONS}
              value={selectedDays}
              onChange={setSelectedDays}
              searchable
              disabled={isFetching}
            />

            {selectedDays === "0" && (
              <>
                <DatePickerInput
                  label="Start Date"
                  placeholder="Select a start date"
                  value={startDateFilter}
                  onChange={(value) => setStartDateFilter(value ? new Date(value) : null)}
                  leftSection={<IconCalendarEvent size={16} />}
                  dropdownType="popover"
                  minDate={new Date("2025-01-01")}
                  maxDate={currentDate}
                  valueFormat={DATE_FORMAT}
                  w={120}
                />
                <DatePickerInput
                  label="End Date"
                  placeholder="Select a end date"
                  value={endDateFilter}
                  onChange={(value) => setEndDateFilter(value ? new Date(value) : null)}
                  leftSection={<IconCalendarEvent size={16} />}
                  dropdownType="popover"
                  minDate={startDateFilter || new Date()}
                  maxDate={currentDate}
                  valueFormat={DATE_FORMAT}
                  w={120}
                />
              </>
            )}
          </Flex>
        </Stack>
        <Box>
          <Overview
            selectedDays={selectedDays}
            startDateFilter={startDateFilter}
            endDateFilter={endDateFilter}
            setIsFetching={setIsFetching}
          />
        </Box>
      </Stack>
    </Container>
  );
};

export default AdminDashboardPage;
