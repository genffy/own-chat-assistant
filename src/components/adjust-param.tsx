import React, { useState } from "react";
import {
  Group,
  Button,
  Paper,
  Text,
  LoadingOverlay,
  Anchor,
  useMantineTheme,
  Drawer,
  Burger,
  Select,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { OPENAI_API_CONFIG, OPENAI_API_CONFIG_PARAMS_TYPE, OPENAI_API_TYPE } from "@/constants";
import ExtraForm from "./_extra-form";

export interface AuthenticationFormProps {
  noShadow?: boolean;
  noPadding?: boolean;
  noSubmit?: boolean;
  style?: React.CSSProperties;
}

export default function AdjustParam({ noShadow, noPadding, noSubmit, style }: AuthenticationFormProps) {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(true);
  const [formType, setFormType] = useState<"register" | "login">("register");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const theme = useMantineTheme();

  const toggleFormType = () => {
    setFormType((current) => (current === "register" ? "login" : "register"));
    setError("");
  };

  const apis: OPENAI_API_TYPE[] = Object.keys(OPENAI_API_CONFIG) as OPENAI_API_TYPE[];
  const [data, setData] = useState<Record<string, any>>({
    api: apis[0],
  });
  const [extraForms, setExtraForms] = useState<OPENAI_API_CONFIG_PARAMS_TYPE[]>(OPENAI_API_CONFIG[apis[0]]);
  const handleSubmit = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      setError(formType === "register" ? "User with this email already exists" : "User with this email does not exist");
    }, 3000);
  };

  function onChangeHandle(val: string | number | OPENAI_API_TYPE, key: string) {
    if (key === "api") {
      setExtraForms(OPENAI_API_CONFIG[val as OPENAI_API_TYPE]);
      // TODO clear all data
    }
    data[key] = val;
    setData({ ...data });
  }

  const match = useMediaQuery("(max-width: 768px)");
  return (
    <>
      <Burger opened={drawerOpened} onClick={toggleDrawer} />
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        // TODO condition size
        size={match ? "100%" : "50%"}
        padding='md'
        title='Setting'
        zIndex={1000000}
        position='right'
      >
        <Paper
          p={noPadding ? 0 : "lg"}
          shadow={noShadow ? undefined : "sm"}
          style={style}
          sx={{
            position: "relative",
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
          }}
        >
          <form onSubmit={() => handleSubmit()}>
            <LoadingOverlay visible={loading} />
            <Select
              mt='md'
              required
              label='Choose Api want to use'
              placeholder='Pick one'
              data={apis}
              value={data["api"]}
              maxDropdownHeight={400}
              nothingFound='Nothing here'
              onChange={(val: string) => onChangeHandle(val, "api")}
            />
            {/* dymamic form render */}
            <ExtraForm forms={extraForms} onChange={onChangeHandle} />
            {error && (
              <Text color='red' size='sm' mt='sm'>
                {error}
              </Text>
            )}

            {!noSubmit && (
              <Group position='apart' mt='xl'>
                <Anchor component='button' type='button' color='dimmed' onClick={toggleFormType} size='sm'>
                  {formType === "register" ? "Have an account? Login" : "Don't have an account? Register"}
                </Anchor>
                <Group grow>
                  <Button variant='outline'>Cancel</Button>

                  <Button color='blue' type='submit'>
                    Save
                  </Button>
                </Group>
              </Group>
            )}
          </form>
        </Paper>
      </Drawer>
    </>
  );
}
