"use client";

import { insertError, uploadImage } from "@/app/actions";
import PasswordInputWithStrengthMeter from "@/app/sign-up/components/PasswordInputWithStrengthMeter";
import { useUserActions, useUserData, useUserProfile } from "@/stores/useUserStore";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { UserProfilePasswordType } from "@/utils/types";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  FileButton,
  Flex,
  Group,
  Modal,
  Paper,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  useComputedColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCalendar,
  IconCamera,
  IconDeviceFloppy,
  IconGenderMale,
  IconLock,
  IconMail,
  IconShieldCheck,
  IconUser,
} from "@tabler/icons-react";
import { isEqual, isError } from "lodash";
import moment from "moment";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { resetPassword, updateUser } from "../actions";
import ProfileSkeleton from "./ProfileSkeleton";

const UserProfileSettingsPage = () => {
  const supabaseClient = createSupabaseBrowserClient();
  const theme = useMantineTheme();
  const pathname = usePathname();
  const computedColorScheme = useComputedColorScheme();
  const userProfile = useUserProfile();
  const userData = useUserData();
  const { setUserProfile } = useUserActions();

  const [userProfileData, setUserProfileData] = useState(userProfile || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [passwordModalOpened, { open: openPasswordModal, close: closePasswordModal }] =
    useDisclosure(false);

  const isDark = computedColorScheme === "dark";
  const userMetadata = userData?.app_metadata;
  const isUserEmailProviderOnly =
    userMetadata?.provider === "email" &&
    userMetadata.providers.includes("email") &&
    userMetadata.providers.length === 1;

  const formMethods = useForm<UserProfilePasswordType>({
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = formMethods;

  const handleAvatarChange = (file: File | null) => {
    if (file) {
      setAvatarFile(file);
      handleUpdateUserData("user_avatar", URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!userProfileData || !userProfile) return;

    const {
      user_first_name,
      user_last_name,
      user_email,
      user_phone_number,
      user_gender,
      user_birth_date,
    } = userProfileData;

    const trimmedFirstName = user_first_name.trim();
    const trimmedLastName = user_last_name.trim();
    const trimmedEmail = user_email.trim();

    const errors: string[] = [];
    if (!trimmedFirstName) errors.push("First Name");
    if (!trimmedLastName) errors.push("Last Name");
    if (!trimmedEmail) errors.push("Email");
    if (!user_phone_number) errors.push("Phone Number");
    if (!user_gender) errors.push("Gender");
    if (!user_birth_date) errors.push("Birth Date");

    if (errors.length > 0) {
      notifications.show({
        message: `${errors.join(", ")} ${errors.length === 1 ? "is" : "are"} required`,
        color: "orange",
      });
      return;
    }

    try {
      setIsLoading(true);

      let newAvatarUrl = "";
      if (avatarFile) {
        const { publicUrl } = await uploadImage(supabaseClient, {
          image: avatarFile,
          bucket: "USER_AVATARS",
          fileName: avatarFile.name,
        });
        newAvatarUrl = publicUrl;
      }

      await updateUser(supabaseClient, {
        userData: {
          user_avatar: newAvatarUrl || userProfile.user_avatar,
          user_first_name: trimmedFirstName,
          user_last_name: trimmedLastName,
          user_email: trimmedEmail,
          user_phone_number: userProfileData.user_phone_number,
          user_gender: userProfileData.user_gender,
          user_birth_date: userProfileData.user_birth_date,
        },
        userId: userProfile.user_id,
      });

      setUserProfile({
        ...userProfile,
        user_first_name: trimmedFirstName,
        user_last_name: trimmedLastName,
        user_email: trimmedEmail,
        user_phone_number: userProfileData.user_phone_number,
        user_gender: userProfileData.user_gender,
        user_birth_date: userProfileData.user_birth_date,
      });

      notifications.show({
        message: "Profile updated successfully.",
        color: "green",
      });
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
            error_function: "handleSave",
            error_user_email: userProfile.user_email,
            error_user_id: userProfile.user_id,
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (data: UserProfilePasswordType) => {
    if (!userProfile) return;

    setIsLoading(true);
    try {
      if (isUserEmailProviderOnly) {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email: userProfile.user_email,
          password: data.oldPassword,
        });
        if (error) throw error.message;
      }
      const { error } = await resetPassword(supabaseClient, { password: data.password });
      if (error) throw error.message;
      notifications.show({
        message: "Password updated.",
        color: "green",
      });
      reset();
      closePasswordModal();
    } catch (e) {
      let errorMessage = "";
      errorMessage = e as unknown as string;
      if (errorMessage === "Invalid login credentials") errorMessage = "Wrong old password.";
      notifications.show({
        message: errorMessage,
        color: "red",
      });
      if (isError(e)) {
        await insertError(supabaseClient, {
          errorTableInsert: {
            error_message: e.message,
            error_url: pathname,
            error_function: "handleChangePassword",
            error_user_email: userProfile.user_email,
            error_user_id: userProfile.user_id,
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUserData = (key: string, value: string | null) => {
    setUserProfileData((prev) => {
      if (prev) {
        return {
          ...prev,
          [key]: value,
        };
      } else {
        return null;
      }
    });
  };

  if (!userProfileData || !userData) return <ProfileSkeleton />;

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${theme.colors.cyan[isDark ? 3 : 0]} 0%, ${theme.colors.yellow[isDark ? 9 : 0]} 100%)`,
        padding: "48px 0",
      }}
    >
      <Container size="md">
        {/* Header */}
        <Box>
          <Title order={1} mb="xs" c={isDark ? "cyan.0" : "cyan"}>
            My Profile
          </Title>
          <Text size="lg" c={isDark ? "gray.1" : "dimmed"}>
            Manage your personal information and security
          </Text>
        </Box>

        <Stack gap="lg" mt="xl">
          {/* Avatar Section */}
          <Paper
            p={{ base: "lg", xs: "xl" }}
            radius="lg"
            shadow="sm"
            style={{ border: `2px solid ${theme.colors.cyan[2]}` }}
          >
            <Group>
              <Box style={{ position: "relative" }}>
                <Avatar
                  src={userProfileData.user_avatar}
                  size={120}
                  radius={120}
                  style={{ border: `4px solid ${theme.colors.cyan[5]}` }}
                >
                  {userProfileData.user_first_name.charAt(0)}
                  {userProfileData.user_last_name.charAt(0)}
                </Avatar>
                <FileButton onChange={handleAvatarChange} accept="image/png,image/jpeg">
                  {(props) => (
                    <Box
                      {...props}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        background: `linear-gradient(135deg, ${theme.colors.cyan[5]} 0%, ${theme.colors.yellow[4]} 100%)`,
                        borderRadius: "50%",
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        border: `3px solid ${theme.white}`,
                      }}
                    >
                      <IconCamera size={18} color={theme.white} />
                    </Box>
                  )}
                </FileButton>
              </Box>
              <Box>
                <Text fw={700} size="xl" c={theme.colors.cyan[7]}>
                  {userProfileData.user_first_name} {userProfileData.user_last_name}
                </Text>
                <Text size="sm" c="dimmed">
                  {userProfileData.user_email}
                </Text>
                <Badge mt="xs" variant="light" color="cyan">
                  Active Member
                </Badge>
              </Box>
            </Group>
          </Paper>

          {/* Personal Information */}
          <Paper
            p={{ base: "lg", xs: "xl" }}
            radius="lg"
            shadow="sm"
            style={{ border: `2px solid ${theme.colors.yellow[2]}` }}
          >
            <Group mb="lg">
              <IconUser size={24} color={theme.colors.yellow[4]} />
              <Box>
                <Text fw={600} size="lg" c={theme.colors.yellow[7]}>
                  Personal Information
                </Text>
                <Text size="sm" c="dimmed">
                  Update your personal details
                </Text>
              </Box>
            </Group>

            <Stack gap="md">
              <Group grow>
                <TextInput
                  label="First Name"
                  placeholder="Enter first name"
                  value={userProfileData.user_first_name}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    handleUpdateUserData("user_first_name", value);
                  }}
                  styles={{
                    input: { border: `2px solid ${theme.colors.yellow[2]}` },
                  }}
                />
                <TextInput
                  label="Last Name"
                  placeholder="Enter last name"
                  value={userProfileData.user_last_name}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    handleUpdateUserData("user_last_name", value);
                  }}
                  styles={{
                    input: { border: `2px solid ${theme.colors.yellow[2]}` },
                  }}
                />
              </Group>

              <TextInput
                label="Email Address"
                placeholder="your.email@example.com"
                value={userProfileData.user_email}
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  handleUpdateUserData("user_email", value);
                }}
                leftSection={<IconMail size={14} />}
                type="email"
                styles={{
                  input: { border: `2px solid ${theme.colors.yellow[2]}` },
                }}
                readOnly
                variant="filled"
              />

              <TextInput
                label="Phone Number"
                placeholder="09123456789"
                value={userProfileData.user_phone_number}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  let value = e.currentTarget.value;
                  value = value.replace(/\D/g, "");
                  if (value.length > 10) {
                    value = value.slice(0, 10);
                  }
                  if (value && !value.startsWith("9")) {
                    return;
                  }
                  handleUpdateUserData("user_phone_number", value);
                }}
                leftSection={<Text size="sm">+63</Text>}
                styles={{
                  input: { border: `2px solid ${theme.colors.yellow[2]}` },
                }}
              />

              <Group grow>
                <Select
                  label="Gender"
                  placeholder="Select gender"
                  value={userProfileData.user_gender}
                  onChange={(val) => handleUpdateUserData("user_gender", val)}
                  data={[
                    { value: "MALE", label: "Male" },
                    { value: "FEMALE", label: "Female" },
                    { value: "OTHER", label: "Other" },
                  ]}
                  styles={{
                    input: { border: `2px solid ${theme.colors.yellow[2]}` },
                  }}
                  leftSection={<IconGenderMale size={14} />}
                />
                <DateInput
                  label="Birth Date"
                  placeholder="Select date"
                  value={userProfileData.user_birth_date}
                  onChange={(val) => handleUpdateUserData("user_birth_date", val)}
                  leftSection={<IconCalendar size={14} />}
                  maxDate={new Date()}
                  styles={{
                    input: { border: `2px solid ${theme.colors.yellow[2]}` },
                  }}
                />
              </Group>
            </Stack>
          </Paper>

          {/* Security Section */}
          <Paper
            p={{ base: "lg", xs: "xl" }}
            radius="lg"
            shadow="sm"
            style={{ border: `2px solid ${theme.colors.cyan[2]}` }}
          >
            <Group justify="space-between" mb="md">
              <Group>
                <IconShieldCheck size={24} color={theme.colors.cyan[5]} />
                <Box>
                  <Text fw={600} size="lg" c={theme.colors.cyan[7]}>
                    Security
                  </Text>
                  <Text size="sm" c="dimmed">
                    Manage your password and security settings
                  </Text>
                </Box>
              </Group>
              <Button
                leftSection={<IconLock size={18} />}
                onClick={openPasswordModal}
                variant="light"
                color="cyan"
                radius="md"
              >
                Change Password
              </Button>
            </Group>

            <Divider my="md" />

            <Group gap="xs">
              <IconLock size={16} color={theme.colors.cyan[5]} />
              <Text size="sm" c="dimmed">
                User data last changed: {moment(userData.updated_at).fromNow()}
              </Text>
            </Group>
          </Paper>

          {/* Save Button */}
          <Flex align="center" justify="flex-end">
            <Button
              size="md"
              leftSection={<IconDeviceFloppy size={18} />}
              onClick={handleSave}
              loading={isLoading}
              disabled={isEqual(userProfile, userProfileData)}
            >
              Save
            </Button>
          </Flex>
        </Stack>

        {/* Password Change Modal */}
        <Modal
          opened={passwordModalOpened}
          onClose={closePasswordModal}
          title="Change Password"
          centered
          radius="md"
          styles={{
            title: { fontSize: 20, fontWeight: 600, color: theme.colors.cyan[7] },
          }}
          withCloseButton={false}
          closeOnClickOutside={false}
          closeOnEscape={false}
        >
          <form onSubmit={handleSubmit(handleChangePassword)}>
            <Stack gap="md">
              {isUserEmailProviderOnly ? (
                <PasswordInput
                  label="Old Password"
                  placeholder="Old password"
                  error={errors.oldPassword?.message}
                  {...register("oldPassword", {
                    required: "Old password field cannot be empty",
                  })}
                />
              ) : null}
              <FormProvider {...formMethods}>
                <PasswordInputWithStrengthMeter />
              </FormProvider>
              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword", {
                  required: "Confirm password field cannot be empty",
                  validate: (value, formValues) =>
                    value === formValues.password || "Your password does not match.",
                })}
              />
              <Divider />

              <Group justify="flex-end">
                <Button variant="light" onClick={closePasswordModal} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" radius="md" loading={isLoading}>
                  Change Password
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Container>
    </Box>
  );
};

export default UserProfileSettingsPage;
