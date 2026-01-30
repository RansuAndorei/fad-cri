"use client";

import { insertError } from "@/app/actions";
import { useUserData } from "@/stores/useUserStore";
import { FAQS_DATA } from "@/utils/constants";
import { isAppError } from "@/utils/functions";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { FAQCategoryEnum, FAQSettingsType } from "@/utils/types";
import {
  Accordion,
  ActionIcon,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconChevronDown,
  IconChevronUp,
  IconDeviceFloppy,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { v4 } from "uuid";
import { insertFAQs } from "../actions";

import { Controller, useFieldArray, useForm } from "react-hook-form";

type Props = {
  faqList: FAQSettingsType[];
};

type FormValues = {
  faqs: FAQSettingsType[];
};

const FAQSettingsPage = ({ faqList }: Props) => {
  const supabaseClient = createSupabaseBrowserClient();
  const pathname = usePathname();
  const userData = useUserData();

  const initialFaqsRef = useRef<FAQSettingsType[]>(faqList);
  const [loadingCategory, setLoadingCategory] = useState<FAQCategoryEnum | null>(null);

  const categories = Object.keys(FAQS_DATA) as FAQCategoryEnum[];

  const { control, setValue, getValues } = useForm<FormValues>({
    defaultValues: { faqs: faqList },
    mode: "onChange",
  });

  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: "faqs",
    keyName: "keyId",
  });

  const getCategoryFAQs = (category: FAQCategoryEnum) => {
    const fields = getValues("faqs");
    return fields
      .filter((f) => f.faq_category === category)
      .sort((a, b) => a.faq_order - b.faq_order);
  };

  const hasCategoryChanges = (category: FAQCategoryEnum) => {
    const current = getCategoryFAQs(category);
    const initial = initialFaqsRef.current
      .filter((f) => f.faq_category === category)
      .sort((a, b) => a.faq_order - b.faq_order);

    if (current.length !== initial.length) return true;

    return current.some(
      (f, i) =>
        f.faq_order !== initial[i].faq_order ||
        f.faq_question !== initial[i].faq_question ||
        f.faq_answer !== initial[i].faq_answer,
    );
  };

  const addFAQ = (category: FAQCategoryEnum) => {
    const categoryFAQs = getCategoryFAQs(category);
    const nextOrder =
      categoryFAQs.length > 0 ? Math.max(...categoryFAQs.map((f) => f.faq_order)) + 1 : 1;

    append({
      faq_id: v4(),
      faq_date_created: new Date().toISOString(),
      faq_category: category,
      faq_order: nextOrder,
      faq_question: "",
      faq_answer: "",
    });
  };

  const removeFAQ = (index: number, category: FAQCategoryEnum) => {
    remove(index);
    const fields = getValues("faqs");
    const updated = fields.map((f) => {
      const idx = getCategoryFAQs(category).findIndex((x) => x.faq_id === f.faq_id);
      return f.faq_category === category ? { ...f, faq_order: idx + 1 } : f;
    });

    setValue("faqs", updated);
  };

  const moveFAQ = (index: number, category: FAQCategoryEnum, direction: "up" | "down") => {
    const categoryFAQs = getCategoryFAQs(category);
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= categoryFAQs.length) return;

    const fieldsArray = getValues("faqs");
    const currentFAQ = categoryFAQs[index];
    const swapFAQ = categoryFAQs[swapIndex];

    const globalIndex = fieldsArray.findIndex((f) => f.faq_id === currentFAQ.faq_id);
    const globalSwapIndex = fieldsArray.findIndex((f) => f.faq_id === swapFAQ.faq_id);

    swap(globalIndex, globalSwapIndex);

    const newFields = getValues("faqs").map((f) => {
      if (f.faq_category !== category) return f;

      const newIndex = getValues("faqs")
        .filter((x) => x.faq_category === category)
        .findIndex((x) => x.faq_id === f.faq_id);

      return { ...f, faq_order: newIndex + 1 };
    });

    setValue("faqs", newFields);
  };

  const saveCategory = async (category: FAQCategoryEnum) => {
    if (!userData) return;

    const fields = getValues("faqs");

    let hasError = false;
    const updatedFAQs = fields.map((f) => {
      if (f.faq_category !== category) return f;
      const questionError = !f.faq_question.trim() ? "Question is required" : "";
      const answerError = !f.faq_answer.trim() ? "Answer is required" : "";
      if (questionError || answerError) hasError = true;
      return { ...f, questionError, answerError };
    });

    setValue("faqs", updatedFAQs);

    if (hasError) {
      notifications.show({ message: "Please fix errors before saving.", color: "orange" });
      return;
    }

    try {
      setLoadingCategory(category);

      const payload = updatedFAQs.filter((f) => f.faq_category === category);

      await insertFAQs(supabaseClient, { category, faqs: payload });

      initialFaqsRef.current = [
        ...initialFaqsRef.current.filter((f) => f.faq_category !== category),
        ...payload,
      ];

      notifications.show({
        message: `${FAQS_DATA[category].label} saved successfully.`,
        color: "green",
      });
    } catch (e) {
      notifications.show({
        message: "Something went wrong. Please try again later.",
        color: "red",
      });
      if (isAppError(e)) {
        await insertError(supabaseClient, {
          errorTableInsert: {
            error_message: e.message,
            error_url: pathname,
            error_function: "saveCategory",
            error_user_email: userData.email,
            error_user_id: userData.id,
          },
        });
      }
    } finally {
      setLoadingCategory(null);
    }
  };

  return (
    <Container maw={1024}>
      <Stack>
        <Group>
          <Box>
            <Title order={2}>FAQs</Title>
            <Text c="dimmed">Manage frequently asked questions displayed to clients.</Text>
          </Box>
        </Group>

        <Paper p={{ base: "sm", xs: "xl" }} shadow="xl" radius="sm">
          <Stack gap="lg">
            <Accordion variant="separated">
              {categories.map((category) => {
                const list = getCategoryFAQs(category);

                return (
                  <Accordion.Item key={category} value={category}>
                    <Accordion.Control>
                      <Group justify="space-between">
                        <Text fw={600}>{FAQS_DATA[category].label}</Text>
                        <Badge color={FAQS_DATA[category].color}>{list.length}</Badge>
                      </Group>
                    </Accordion.Control>

                    <Accordion.Panel>
                      <Stack>
                        {list.length === 0 && (
                          <Paper p="lg" ta="center" shadow="xs" withBorder>
                            <Text c="dimmed">No FAQs yet</Text>
                          </Paper>
                        )}

                        {list.map((faq, index) => {
                          const fieldIndex = fields.findIndex((f) => f.faq_id === faq.faq_id);
                          return (
                            <Paper key={faq.faq_id} p="md" radius="md" withBorder shadow="xs">
                              <Group align="flex-start">
                                <Badge color={FAQS_DATA[category].color} variant="light">
                                  {faq.faq_order}
                                </Badge>

                                <Box flex={1}>
                                  <Controller
                                    name={`faqs.${fieldIndex}.faq_question`}
                                    control={control}
                                    render={({ field }) => (
                                      <TextInput
                                        label="Question"
                                        {...field}
                                        error={faq.questionError}
                                        mb="sm"
                                      />
                                    )}
                                  />

                                  <Controller
                                    name={`faqs.${fieldIndex}.faq_answer`}
                                    control={control}
                                    render={({ field }) => (
                                      <Textarea
                                        label="Answer"
                                        {...field}
                                        error={faq.answerError}
                                        autosize
                                        maxRows={4}
                                      />
                                    )}
                                  />
                                </Box>
                              </Group>

                              <Divider my="sm" />

                              <Group justify="space-between">
                                <Group>
                                  <Tooltip label="Move up">
                                    <ActionIcon
                                      disabled={index === 0}
                                      onClick={() => moveFAQ(index, category, "up")}
                                      color={FAQS_DATA[category].color}
                                    >
                                      <IconChevronUp size={16} />
                                    </ActionIcon>
                                  </Tooltip>

                                  <Tooltip label="Move down">
                                    <ActionIcon
                                      disabled={index === list.length - 1}
                                      onClick={() => moveFAQ(index, category, "down")}
                                      color={FAQS_DATA[category].color}
                                    >
                                      <IconChevronDown size={16} />
                                    </ActionIcon>
                                  </Tooltip>
                                </Group>

                                <ActionIcon
                                  color="red"
                                  onClick={() => removeFAQ(fieldIndex, category)}
                                  variant="light"
                                >
                                  <IconTrash size={16} />
                                </ActionIcon>
                              </Group>
                            </Paper>
                          );
                        })}

                        <Group justify="space-between">
                          <Button
                            size="xs"
                            variant="light"
                            leftSection={<IconPlus size={14} />}
                            onClick={() => addFAQ(category)}
                          >
                            Add FAQ
                          </Button>

                          <Button
                            size="xs"
                            leftSection={<IconDeviceFloppy size={14} />}
                            loading={loadingCategory === category}
                            disabled={!hasCategoryChanges(category)}
                            onClick={() => saveCategory(category)}
                          >
                            Save changes
                          </Button>
                        </Group>
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default FAQSettingsPage;
