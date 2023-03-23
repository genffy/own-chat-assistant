"use client";
import ConfigForm from "./component/config-form";
import Chats from "./component/chats";
import { ApiFormDataType, getFormData, LOCAL_OPENAI_PARAMS_KEY } from "@/constants";
import { useState, useEffect } from "react";
import { useLocalStorage } from "react-use";

export default function Chat() {
  const [meta, setMeta] = useState<ApiFormDataType>(getFormData());
  const [lsData, setLsData] = useLocalStorage(LOCAL_OPENAI_PARAMS_KEY, JSON.stringify(meta));

  useEffect(() => {
    try {
      if (lsData && Object.keys(lsData)) {
        const _data = JSON.parse(lsData);
        const d = getFormData(_data.platform, _data.api);
        setMeta({ ..._data, ...d });
      }
    } catch (e) {}
  }, [lsData]);
  return (
    <div className={`flex h-screen w-full flex-nowrap dark:bg-gray-800 `}>
      <Chats meta={meta}></Chats>
      <ConfigForm meta={meta} onChange={(data) => {
        setMeta(data)
        setLsData(JSON.stringify(data));
      }} onRest={() => {
        setMeta(getFormData());
        setLsData(JSON.stringify(getFormData()));
      }}></ConfigForm>
    </div>
  );
}
