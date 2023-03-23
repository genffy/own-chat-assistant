import React, { useState } from "react";
import { Text } from "@mantine/core";
import {
  AI_API_CONFIG,
  ApiFormDataType,
  getFormData,
  LOCAL_TOGGLE_SETTING_FOLD,
  NUMBER_INPUT_TYPE,
  OPENAI_API_CONFIG_PARAMS_TYPE,
  SELEC_INPUT_TYPE,
} from "@/constants";
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from "@tabler/icons-react";
import { useLocalStorage } from "react-use";
type ConfigParamProps = {
  onChange?: (data: ApiFormDataType) => void;
  onRest?: () => void;
  meta: ApiFormDataType;
}
export default function ConfigParam({ onChange, meta, onRest }: ConfigParamProps) {
  const [error] = useState<string>("");
  function handleReset() {
    // reset to default
    onRest && onRest();
  }

  function onChangeHandle(val: string | number, key: string) {
    let p, a;
    if (key === "api") {
      a = val as unknown as string;
    } else if (key === 'platform') {
      p = val as unknown as string;
    }
    const d = getFormData(p, a);
    d.params[key] = val;
    onChange && onChange(d);
  }
  // FIXME: bugs
  const [fold, setFold] = useLocalStorage<boolean>(LOCAL_TOGGLE_SETTING_FOLD, false);
  return (
    <div
      className={`relative h-full bg-gray-100 text-gray-800 ${!!fold ? "" : "w-[33.33%]"}`}
    >
      <div
        className={`absolute inset-y-10 left-0 z-50 inline-flex w-10 cursor-pointer items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:text-gray-900`}
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
          className={`relative flex flex-grow flex-col justify-between overflow-hidden rounded-lg bg-white shadow-xl ${!!fold ? "w-0" : "w-full"
            }`}
        >
          <header className='w-full bg-gray-300 p-4 text-center'>
            <h1 className='text-2xl font-semibold'>Update Config</h1>
          </header>
          <main className='overflow-auto flex-1 p-4'>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className='space-y-4'>
                <div key='platform'>
                  <label
                    htmlFor='api'
                    className='mb-2 block text-sm font-medium text-gray-900 '
                  >
                    Platform
                  </label>
                  <div className='flex flex-wrap'>
                    {AI_API_CONFIG.map(({ platform, disabled, name }) => {
                      return (
                        <div key={platform} className='mr-4 flex items-center'>
                          <input
                            id={platform}
                            type='radio'
                            value={platform}
                            disabled={disabled}
                            checked={meta['platform'] === platform}
                            name='inline-radio-group'
                            className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 '
                            onChange={(e) => onChangeHandle(e.currentTarget.value, "platform")}
                          />
                          <label
                            htmlFor={platform}
                            className='ml-2 text-sm font-medium text-gray-900 '
                          >
                            {name}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div key='api'>
                  <label
                    htmlFor='api'
                    className='mb-2 block text-sm font-medium text-gray-900 '
                  >
                    Api
                  </label>
                  <select
                    id='api'
                    className='focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 '
                    required
                    key='api'
                    placeholder='Pick one'
                    value={meta["api"] as string}
                    onChange={(e) => onChangeHandle(e.currentTarget.value, "api")}
                  >
                    {meta.config ? (
                      meta.config.map((k) => {
                        return (
                          <option key={k.api} value={k.api}>
                            {k.api}
                          </option>
                        );
                      })
                    ) : (
                      <>Nothing here</>
                    )}
                  </select>
                </div>
                {/* dymamic form render */}
                {
                  meta.extraForms && <ExtraForm forms={meta.extraForms} data={meta.params} onChange={onChangeHandle} />
                }
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
              onClick={handleReset}
            >
              Rest
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

function ExtraForm({ forms, onChange, data }: RenderFormsProps) {
  return (
    <>
      {forms.map(({ type, key, name, require, ...rest }: OPENAI_API_CONFIG_PARAMS_TYPE) => {
        if (type === "number") {
          const conf = rest as NUMBER_INPUT_TYPE;
          return (
            <div key={key}>
              <label
                htmlFor={key}
                className='mb-2 block text-sm font-medium text-gray-900 '
              >
                {name}
              </label>
              <input
                type='number'
                name={key}
                id={key}
                className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 '
                required={require}
                step={conf.step}
                key={key}
                max={conf.max}
                min={conf.min}
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
                className='mb-2 block text-sm font-medium text-gray-900'
              >
                {name}
              </label>
              <select
                id={key}
                className='focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 '
                required={require}
                key={key}
                placeholder='Pick one'
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
