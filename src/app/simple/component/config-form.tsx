import React, { useEffect, useState } from "react";
import { Text } from "@mantine/core";
import {
  AI_API_CONFIG,
  API_TYPE,
  LOCAL_OPENAI_PARAMS_KEY,
  LOCAL_TOGGLE_SETTING_FOLD,
  NUMBER_INPUT_TYPE,
  OPENAI_API_CONFIG,
  OPENAI_API_CONFIG_PARAMS_TYPE,
  OPENAI_API_TYPE,
  SELEC_INPUT_TYPE,
} from "@/constants";
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from "@tabler/icons-react";
import { useLocalStorage } from "react-use";

export default function AdjustParam() {
  const [error, setError] = useState<string>("");

  const apis: OPENAI_API_TYPE[] = Object.keys(OPENAI_API_CONFIG) as OPENAI_API_TYPE[];
  const [data, setData] = useState<Record<string, string | number>>({
    api: apis[0],
  });
  const [lsData, setLsData] = useLocalStorage(LOCAL_OPENAI_PARAMS_KEY, JSON.stringify(data));
  useEffect(() => {
    try {
      if (lsData && Object.keys(lsData)) {
        const _data = JSON.parse(lsData);
        if (_data.api) {
          const _forms = OPENAI_API_CONFIG[_data.api as OPENAI_API_TYPE];
          setExtraForms(_forms);
        }
        setData(JSON.parse(lsData));
      }
    } catch (e) {}
  }, [lsData]);
  const [extraForms, setExtraForms] = useState<OPENAI_API_CONFIG_PARAMS_TYPE[]>(
    OPENAI_API_CONFIG[apis[0]],
  );

  const handleSubmit = () => {
    setError("");
    setLsData(JSON.stringify(data));
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
  // FIXME: bugs
  const [fold, setFold] = useLocalStorage<boolean>(LOCAL_TOGGLE_SETTING_FOLD, false);

  // platforms
  const platforms = Object.keys(AI_API_CONFIG) as API_TYPE[];

  return (
    <div
      className={`relative min-h-screen bg-gray-100 text-gray-800 ${!!fold ? "" : "w-[33.33%]"}`}
    >
      {/* side bar button */}
      <div
        className={`absolute inset-y-0 left-0 z-50 inline-flex w-10 cursor-pointer items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:text-gray-900`}
        onClick={() => {
          setFold(!fold);
        }}
      >
        {fold ? <IconLayoutSidebarLeftExpand /> : <IconLayoutSidebarLeftCollapse />}
      </div>
      <div
        className={`relative flex h-full flex-col items-center justify-center py-10 pr-10 ${!!fold ? "" : "pl-10"
          }`}
      >
        <div
          className={`relative flex flex-grow flex-col overflow-hidden rounded-lg bg-white shadow-xl ${!!fold ? "w-0" : "w-full"
            }`}
        >
          <header className='w-full bg-gray-300 p-4 text-center'>
            <h1 className='text-2xl font-semibold'>Update Config</h1>
          </header>
          <main className='overflow-auto p-4'>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className='space-y-4'>
                <div key='platform'>
                  <label
                    htmlFor='api'
                    className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Platform
                  </label>
                  <div className='flex flex-wrap'>
                    {platforms.map((k) => {
                      const item = AI_API_CONFIG[k];
                      return (
                        <div key={k} className='mr-4 flex items-center'>
                          <input
                            id={k}
                            type='radio'
                            value={k}
                            disabled={item.disabled}
                            checked={item.selected}
                            name='inline-radio-group'
                            className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
                          />
                          <label
                            htmlFor={k}
                            className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                          >
                            {item.name}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div key='api'>
                  <label
                    htmlFor='api'
                    className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Api
                  </label>
                  <select
                    id='api'
                    className='focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                    required
                    key='api'
                    placeholder='Pick one'
                    defaultValue={data["api"]}
                    value={data["api"] as string}
                    onChange={(e) => onChangeHandle(e.currentTarget.value, "api")}
                  >
                    {apis ? (
                      apis.map((k) => {
                        return (
                          <option key={k} value={k}>
                            {k}
                          </option>
                        );
                      })
                    ) : (
                      <>Nothing here</>
                    )}
                  </select>
                </div>
                {/* dymamic form render */}
                <ExtraForm forms={extraForms} data={data} onChange={onChangeHandle} />
              </div>

              {error && (
                <Text color='red' size='sm' mt='sm'>
                  {error}
                </Text>
              )}
            </form>
          </main>
          <footer className='flex w-full justify-end bg-gray-300 p-4'>
            <button
              type='button'
              className='mr-4 flex cursor-pointer items-center justify-center rounded-md bg-white p-3 font-semibold text-gray-800 shadow-md'
            >
              Rest
            </button>
            <button
              type='submit'
              className='flex cursor-pointer items-center justify-center rounded-md bg-blue-600 p-3 text-base font-semibold text-white shadow-md hover:bg-indigo-600'
            >
              Update
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}

type RenderFormsProps = {
  forms: OPENAI_API_CONFIG_PARAMS_TYPE[];
  data: Record<string, number | string>;
  onChange: (val: number | string, key: string) => void;
};

export function ExtraForm({ forms, onChange, data }: RenderFormsProps) {
  return (
    <>
      {forms.map(({ type, key, name, require, ...rest }: OPENAI_API_CONFIG_PARAMS_TYPE) => {
        if (type === "number") {
          const conf = rest as NUMBER_INPUT_TYPE;
          return (
            <div key={key}>
              <label
                htmlFor={key}
                className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
              >
                {name}
              </label>
              <input
                type='number'
                name={key}
                id={key}
                className='focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                required={require}
                step={conf.step}
                key={key}
                max={conf.max}
                min={conf.min}
                defaultValue={conf.default}
                value={data[key] as number}
                placeholder='Number'
                onChange={(e) => onChange(e.currentTarget.value, key)}
              />
            </div>
          );
        } else if (type === "select") {
          const conf = rest as SELEC_INPUT_TYPE;
          return (
            <div key={key}>
              <label
                htmlFor={key}
                className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
              >
                {name}
              </label>
              <select
                id={key}
                className='focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                required={require}
                key={key}
                placeholder='Pick one'
                defaultValue={conf.default}
                value={data[key] as string}
                onChange={(e) => onChange(e.currentTarget.value, key)}
              >
                {conf.options ? (
                  conf.options.map((k) => {
                    return (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    );
                  })
                ) : (
                  <>Nothing here</>
                )}
              </select>
            </div>
          );
        } else {
          return null;
        }
      })}
    </>
  );
}
