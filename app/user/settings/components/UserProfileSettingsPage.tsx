"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  FileButton,
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
import {
  IconCalendar,
  IconCamera,
  IconDeviceFloppy,
  IconLock,
  IconMail,
  IconPhone,
  IconShieldCheck,
  IconUser,
} from "@tabler/icons-react";
import { useState } from "react";

const UserProfileSettingsPage = () => {
  const theme = useMantineTheme();
  const computedColorScheme = useComputedColorScheme();
  const isDark = computedColorScheme === "dark";

  // User data state
  const [firstName, setFirstName] = useState("Juan");
  const [lastName, setLastName] = useState("Dela Cruz");
  const [email, setEmail] = useState("juan.delacruz@example.com");
  const [phoneNumber, setPhoneNumber] = useState("09123456789");
  const [gender, setGender] = useState<string>("MALE");
  const [birthDate, setBirthDate] = useState<string | null>("04-26-2000");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Password reset state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [saved, setSaved] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [passwordModalOpened, { open: openPasswordModal, close: closePasswordModal }] =
    useDisclosure(false);

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    console.log(avatarFile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setPasswordChanged(true);
    setTimeout(() => {
      setPasswordChanged(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      closePasswordModal();
    }, 2000);
  };

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
          <Title order={1} mb="xs" c={theme.colors.cyan[7]}>
            My Profile
          </Title>
          <Text size="lg" c="dimmed">
            Manage your personal information and security
          </Text>
        </Box>

        <Stack gap="lg" mt="xl">
          {/* Avatar Section */}
          <Paper
            p="xl"
            radius="lg"
            shadow="sm"
            style={{ border: `2px solid ${theme.colors.cyan[2]}` }}
          >
            <Group>
              <Box style={{ position: "relative" }}>
                <Avatar
                  src={avatar}
                  size={120}
                  radius={120}
                  style={{ border: `4px solid ${theme.colors.cyan[5]}` }}
                >
                  {firstName.charAt(0)}
                  {lastName.charAt(0)}
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
                <Text fw={700} size="xl" color={theme.colors.cyan[7]}>
                  {firstName} {lastName}
                </Text>
                <Text size="sm" c="dimmed">
                  {email}
                </Text>
                <Badge mt="xs" variant="light" color="cyan">
                  Active Member
                </Badge>
              </Box>
            </Group>
          </Paper>

          {/* Personal Information */}
          <Paper
            p="xl"
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
                  value={firstName}
                  onChange={(e) => setFirstName(e.currentTarget.value)}
                  leftSection={<IconUser size={18} />}
                  styles={{
                    input: { border: `2px solid ${theme.colors.yellow[2]}` },
                  }}
                />
                <TextInput
                  label="Last Name"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.currentTarget.value)}
                  leftSection={<IconUser size={18} />}
                  styles={{
                    input: { border: `2px solid ${theme.colors.yellow[2]}` },
                  }}
                />
              </Group>

              <TextInput
                label="Email Address"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                leftSection={<IconMail size={18} />}
                type="email"
                styles={{
                  input: { border: `2px solid ${theme.colors.yellow[2]}` },
                }}
              />

              <TextInput
                label="Phone Number"
                placeholder="09123456789"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.currentTarget.value)}
                leftSection={<IconPhone size={18} />}
                styles={{
                  input: { border: `2px solid ${theme.colors.yellow[2]}` },
                }}
              />

              <Group grow>
                <Select
                  label="Gender"
                  placeholder="Select gender"
                  value={gender}
                  onChange={(val) => setGender(val || "MALE")}
                  data={[
                    { value: "MALE", label: "Male" },
                    { value: "FEMALE", label: "Female" },
                    { value: "OTHER", label: "Other" },
                  ]}
                  styles={{
                    input: { border: `2px solid ${theme.colors.yellow[2]}` },
                  }}
                />
                <DateInput
                  label="Birth Date"
                  placeholder="Select date"
                  value={birthDate}
                  onChange={(val) => setBirthDate(val)}
                  leftSection={<IconCalendar size={18} />}
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
            p="xl"
            radius="lg"
            shadow="sm"
            style={{ border: `2px solid ${theme.colors.cyan[2]}` }}
          >
            <Group justify="space-between" mb="md">
              <Group>
                <IconShieldCheck size={24} color={theme.colors.cyan[5]} />
                <Box>
                  <Text fw={600} size="lg" color={theme.colors.cyan[7]}>
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
                Password last changed: Never
              </Text>
            </Group>
          </Paper>

          {/* Save Button */}
          <Group justify="flex-end">
            <Button
              leftSection={<IconDeviceFloppy size={20} />}
              onClick={handleSaveProfile}
              size="md"
              radius="md"
            >
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </Group>
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
        >
          <Stack gap="md">
            <PasswordInput
              label="Current Password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.currentTarget.value)}
              leftSection={<IconLock size={18} />}
              styles={{
                input: { border: `2px solid ${theme.colors.cyan[2]}` },
              }}
            />

            <PasswordInput
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.currentTarget.value)}
              leftSection={<IconLock size={18} />}
              styles={{
                input: { border: `2px solid ${theme.colors.cyan[2]}` },
              }}
            />

            <PasswordInput
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
              leftSection={<IconLock size={18} />}
              error={
                confirmPassword && newPassword !== confirmPassword ? "Passwords do not match" : null
              }
              styles={{
                input: { border: `2px solid ${theme.colors.cyan[2]}` },
              }}
            />

            <Divider />

            <Group justify="flex-end">
              <Button variant="light" onClick={closePasswordModal}>
                Cancel
              </Button>
              <Button
                onClick={handleChangePassword}
                disabled={
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword
                }
                radius="md"
              >
                {passwordChanged ? "Password Changed!" : "Change Password"}
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Container>
    </Box>
  );
};

export default UserProfileSettingsPage;
