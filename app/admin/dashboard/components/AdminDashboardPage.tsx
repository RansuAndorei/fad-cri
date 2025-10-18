"use client";

import { Box, Container, Flex, Group, SegmentedControl, Select, Stack, Title } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendarEvent } from "@tabler/icons-react";
import { startCase } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import Overview from "./OverviewTab/Overview";

const TABS = ["overview"];
const DAYS_OPTIONS = [
  { value: "7", label: "Last Week" },
  { value: "30", label: "Last Month" },
  { value: "360", label: "Last Year" },
  { value: "0", label: "Custom" },
];

const AdminDashboardPage = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedDays, setSelectedDays] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  const currentDate = moment().toDate();
  const firstDayOfCurrentYear = moment({
    year: moment().year(),
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

  const renderTabs = (tab: string) => {
    switch (tab) {
      case "overview":
        return (
          <Overview
            selectedDays={selectedDays}
            startDateFilter={startDateFilter}
            endDateFilter={endDateFilter}
            setIsFetching={setIsFetching}
          />
        );
    }
  };

  return (
    <Container p={0} maw={1024} h="100%">
      <Stack>
        <Title order={2}>Admin Dashboard</Title>

        <Flex
          justify="space-between"
          align="flex-end"
          rowGap="sm"
          wrap="wrap"
          direction={{ base: "column-reverse", sm: "row" }}
        >
          <SegmentedControl
            value={selectedTab}
            onChange={setSelectedTab}
            data={TABS.map((tab) => ({ value: tab, label: startCase(tab) }))}
          />
          <Group gap="xs">
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
                  valueFormat="YYYY-MM-DD"
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
                  valueFormat="YYYY-MM-DD"
                  w={120}
                />
              </>
            )}
          </Group>
        </Flex>
        <Box>{renderTabs(selectedTab)}</Box>
      </Stack>
    </Container>
  );
};

export default AdminDashboardPage;
