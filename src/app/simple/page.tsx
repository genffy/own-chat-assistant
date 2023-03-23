"use client";
import ConfigForm from "./component/config-form";
import Chats from "./component/chats";

export default function Chat() {
  return (
    <div className={`flex h-screen w-full flex-nowrap dark:bg-gray-800 `}>
      <Chats></Chats>
      <ConfigForm></ConfigForm>
    </div>
  );
}
