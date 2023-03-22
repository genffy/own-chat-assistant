import React, { useEffect, useState } from "react";
import {
  Text,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import {
  LOCAL_OPENAI_PARAMS_KEY,
  NUMBER_INPUT_TYPE,
  OPENAI_API_CONFIG,
  OPENAI_API_CONFIG_PARAMS_TYPE,
  OPENAI_API_TYPE,
  SELEC_INPUT_TYPE,
} from "@/constants";
import {
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconPlaystationX,
  IconTrash
} from "@tabler/icons-react";

type AdjustParamProps = {
  toggle: () => void;
};
export default function AdjustParam({ toggle }: AdjustParamProps) {

  const [error, setError] = useState<string>("");

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

  const [fold, setFold] = useState(true);

  function SideBarBtn() {
    return (
      <div
        className={`absolute inset-y-0 -left-6 justify-center z-50 cursor-pointer text-gray-400 bg-transparent hover:text-gray-900 rounded-lg text-sm inline-flex items-center`}
        onClick={() => {
          setFold(!fold);
          toggle();
        }}
      >
        {fold ? <IconLayoutSidebarLeftExpand /> : <IconLayoutSidebarLeftCollapse />}
      </div>
    );
  }
  return (
    <>
      <div className="relative w-full h-full bg-white dark:bg-gray-800">
        <SideBarBtn />
        <div className={`px-4 py-10 ${fold ? 'hidden' : 'block'}`}>
          <h5 id="drawer-label" className="inline-flex items-center mb-6 text-sm font-semibold text-gray-500 uppercase dark:text-gray-400">Update Config</h5>
          <button type="button" data-drawer-dismiss="drawer-update-product-default" aria-controls="drawer-update-product-default" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <IconPlaystationX></IconPlaystationX>
            <span className="sr-only">Close menu</span>
          </button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="space-y-4">
              <div key="api">
                <label htmlFor="api" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Api</label>
                <select id="api" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                  key="api"
                  placeholder='Pick one'
                  defaultValue={data['api']}
                  value={data["api"] as string}
                  onChange={(e) => onChangeHandle(e.currentTarget.value, 'api')}
                >
                  {
                    apis ? apis.map((k) => {
                      return <option key={k} value={k}>{k}</option>
                    }) : <>Nothing here</>
                  }
                </select>
              </div>
              {/* dymamic form render */}
              <ExtraForm forms={extraForms} data={data} onChange={onChangeHandle} />
            </div>
            <div className="bottom-10 right-0 flex justify-center w-full pb-4 mt-4 space-x-4 sm:absolute sm:px-4 sm:mt-0">
              <button type="button" className="w-full justify-center text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                <IconTrash></IconTrash> Cancel
              </button>
              <button type="submit" className="w-full justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Update
              </button>
            </div>
            {error && (
              <Text color='red' size='sm' mt='sm'>
                {error}
              </Text>
            )}
          </form>
        </div>
      </div>
    </>
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
              <label htmlFor={key} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {name}
              </label>
              <input type="number" name={key} id={key} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
              <label htmlFor={key} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{name}</label>
              <select id={key} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required={require}
                key={key}
                placeholder='Pick one'
                defaultValue={conf.default}
                value={data[key] as string}
                onChange={(e) => onChange(e.currentTarget.value, key)}
              >
                {
                  conf.options ? conf.options.map((k) => {
                    return <option key={k} value={k}>{k}</option>
                  }) : <>Nothing here</>
                }
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
