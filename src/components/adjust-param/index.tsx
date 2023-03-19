import React, { useEffect, useState } from "react";
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
import { useDisclosure, useMediaQuery, useLocalStorage } from "@mantine/hooks";
import {
  LOCAL_OPENAI_PARAMS_KEY,
  OPENAI_API_CONFIG,
  OPENAI_API_CONFIG_PARAMS_TYPE,
  OPENAI_API_TYPE,
} from "@/constants";
import ExtraForm from "./_extra-form";

export default function AdjustParam() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false, {
    onOpen() {
      setLoading(false);
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const theme = useMantineTheme();

  const apis: OPENAI_API_TYPE[] = Object.keys(OPENAI_API_CONFIG) as OPENAI_API_TYPE[];
  const [data, setData] = useState<Record<string, string | number>>({
    api: apis[0],
  });
  const [lsData, setLsData] = useLocalStorage({
    key: LOCAL_OPENAI_PARAMS_KEY,
    defaultValue: JSON.stringify(data),
  });
  useEffect(() => {
    try {
      if (Object.keys(lsData)) {
        const _data = JSON.parse(lsData);
        if (_data.api) {
          const _forms = OPENAI_API_CONFIG[_data.api as OPENAI_API_TYPE];
          setExtraForms(_forms);
        }
        setData(JSON.parse(lsData));
      }
    } catch (e) {}
  }, [lsData]);
  const [extraForms, setExtraForms] = useState<OPENAI_API_CONFIG_PARAMS_TYPE[]>(OPENAI_API_CONFIG[apis[0]]);

  const handleSubmit = () => {
    setLoading(true);
    setError("");
    setLsData(JSON.stringify(data));
    closeDrawer();
  };

  function onChangeHandle(val: string | number | OPENAI_API_TYPE, key: string) {
    if (key === "api") {
      const _forms = OPENAI_API_CONFIG[val as OPENAI_API_TYPE];
      setExtraForms(_forms);
      const obj: Record<string, string | number> = {};
      obj[key] = val;
      _forms.forEach((item) => {
        obj[item.key] = item.default;
      });
      setData({ ...obj });
    } else {
      data[key] = val;
      setData({ ...data });
    }
  }

  function cancelHandle() {
    closeDrawer();
  }

  const match = useMediaQuery("(max-width: 768px)");
  return (
    <>
      <Burger opened={drawerOpened} onClick={toggleDrawer} />
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size={match ? "100%" : "50%"}
        padding='md'
        title='Setting'
        zIndex={1000000}
        position='right'
      >
        <Paper
          p={"lg"}
          shadow={"sm"}
          sx={{
            position: "relative",
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <LoadingOverlay visible={loading} />
            <Select
              mt='md'
              required
              label='Choose Api want to use'
              placeholder='Pick one'
              data={apis}
              value={data["api"] as string}
              maxDropdownHeight={400}
              nothingFound='Nothing here'
              onChange={(val: string) => onChangeHandle(val, "api")}
            />
            {/* dymamic form render */}
            <ExtraForm forms={extraForms} data={data} onChange={onChangeHandle} />
            {error && (
              <Text color='red' size='sm' mt='sm'>
                {error}
              </Text>
            )}
            <Group position='apart' mt='xl'>
              <Anchor href='https://platform.openai.com/docs/api-reference' target='_blank' color='dimmed' size='sm'>
                More details, api-reference
              </Anchor>
              <Group grow>
                <Button variant='outline' onClick={() => cancelHandle()}>
                  Cancel
                </Button>
                <Button color='blue' type='submit'>
                  Save
                </Button>
              </Group>
            </Group>
          </form>
        </Paper>
      </Drawer>
    </>
  );
}
