import React, { useState } from 'react';
import { useForm } from '@mantine/form';
import { IconLock, IconAt } from '@tabler/icons-react';
import {
  TextInput,
  PasswordInput,
  Group,
  Checkbox,
  Button,
  Paper,
  Text,
  LoadingOverlay,
  Anchor,
  useMantineTheme,
  Drawer,
  Burger,
  Select,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { OPENAI_API_CONFIG } from '@/constants';

export interface AuthenticationFormProps {
  noShadow?: boolean;
  noPadding?: boolean;
  noSubmit?: boolean;
  style?: React.CSSProperties;
}

export default function AdjustParam({
  noShadow,
  noPadding,
  noSubmit,
  style,
}: AuthenticationFormProps) {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(true);
  const [formType, setFormType] = useState<'register' | 'login'>('register');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const theme = useMantineTheme();

  const toggleFormType = () => {
    setFormType((current) => (current === 'register' ? 'login' : 'register'));
    setError('');
  };

  const form = useForm({
    initialValues: {
      apiName: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsOfService: true,
    },
  });

  const handleSubmit = () => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      setError(
        formType === 'register'
          ? 'User with this email already exists'
          : 'User with this email does not exist'
      );
    }, 3000);
  };

  const [apis, setApis] = useState(Object.keys(OPENAI_API_CONFIG).map(k => {
    return {
      value: k,
      label: k
    }
  }))


  return (
    <>
      <Burger opened={drawerOpened} onClick={toggleDrawer} />
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        // TODO condition size
        size={"50%"}
        padding="md"
        title="Setting"
        zIndex={1000000}
        position="right">
        <Paper
          p={noPadding ? 0 : 'lg'}
          shadow={noShadow ? undefined : 'sm'}
          style={style}
          sx={{
            position: 'relative',
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          }}
        >
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <LoadingOverlay visible={loading} />
            <Select
              mt="md"
              required
              label="Choose Api want to use"
              placeholder="Pick one"
              data={apis}
              maxDropdownHeight={400}
              nothingFound="Nobody here"
              {...form.getInputProps('apiName')}
            />

            <TextInput
              mt="md"
              required
              placeholder="Your email"
              label="Email"
              icon={<IconAt size={16} stroke={1.5} />}
              {...form.getInputProps('email')}
            />

            <PasswordInput
              mt="md"
              required
              placeholder="Password"
              label="Password"
              icon={<IconLock size={16} stroke={1.5} />}
              {...form.getInputProps('password')}
            />

            {formType === 'register' && (
              <PasswordInput
                mt="md"
                required
                label="Confirm Password"
                placeholder="Confirm password"
                icon={<IconLock size={16} stroke={1.5} />}
                {...form.getInputProps('confirmPassword')}
              />
            )}

            {error && (
              <Text color="red" size="sm" mt="sm">
                {error}
              </Text>
            )}

            {!noSubmit && (
              <Group position="apart" mt="xl">
                <Anchor
                  component="button"
                  type="button"
                  color="dimmed"
                  onClick={toggleFormType}
                  size="sm"
                >
                  {formType === 'register'
                    ? 'Have an account? Login'
                    : "Don't have an account? Register"}
                </Anchor>
                <Group grow>
                  <Button variant="outline">Cancel</Button>

                  <Button color="blue" type="submit">Save</Button>
                </Group>
              </Group>
            )}
          </form>
        </Paper>
      </Drawer>
    </>
  );
}
