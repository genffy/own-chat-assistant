import { OPENAI_API_CONFIG_PARAMS_TYPE, NUMBER_INPUT_TYPE, SELEC_INPUT_TYPE } from "@/constants";
import { NumberInput, Select } from "@mantine/core";

type RenderFormsProps = {
  forms: OPENAI_API_CONFIG_PARAMS_TYPE[];
  data: Record<string, number | string>;
  onChange: (val: number | string, key: string) => void;
};

export default function ExtraForm({ forms, onChange, data }: RenderFormsProps) {
  return (
    <>
      {forms.map(({ type, key, name, require, ...rest }: OPENAI_API_CONFIG_PARAMS_TYPE) => {
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
              precision={1}
              defaultValue={conf.default}
              value={data[key] as number}
              placeholder='Number'
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
              value={data[key] as string}
              onChange={(val: string) => onChange(val, key)}
            />
          );
        } else {
          return null;
        }
      })}
    </>
  );
}
