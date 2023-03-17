import { OPENAI_API_CONFIG_PARAMS_TYPE, NUMBER_INPUT_TYPE, SELEC_INPUT_TYPE } from "@/constants";
import { NumberInput, Select, TextInput } from "@mantine/core";
import { IconAt } from "@tabler/icons-react";

type RenderFormsProps = {
  forms: OPENAI_API_CONFIG_PARAMS_TYPE[];
  onChange: (val: number | string, key: string) => void;
};

export default function ExtraForm({ forms, onChange }: RenderFormsProps) {
  return (
    <>
      {forms.map(({ type, key, name, require, desc, ...rest }: OPENAI_API_CONFIG_PARAMS_TYPE) => {
        if (type === "number") {
          const conf = rest as NUMBER_INPUT_TYPE;
          return (
            <NumberInput
              required={require}
              step={conf.step}
              label={name}
              key={key}
              max={conf.max}
              min={conf.min}
              defaultValue={conf.default}
              placeholder='Your age'
              withAsterisk
              onChange={(val) => onChange(val, key)}
            />
          );
        } else if (type === "select") {
          const conf = rest as SELEC_INPUT_TYPE;
          return (
            <Select
              required={require}
              label={name}
              key={key}
              mt='md'
              placeholder='Pick one'
              data={conf.options}
              maxDropdownHeight={400}
              nothingFound='Nothing here'
              defaultValue={conf.default}
              onChange={(val: string) => onChange(val, key)}
            />
          );
        } else {
          return (
            <TextInput
              key={key}
              mt='md'
              required
              placeholder='Your email'
              label='Email'
              icon={<IconAt size={16} stroke={1.5} />}
            />
          );
        }
      })}
    </>
  );
}
