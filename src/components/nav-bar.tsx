import { useDisclosure } from "@mantine/hooks";
import { IconAdjustments } from "@tabler/icons-react";
import { Drawer, Button } from "@mantine/core";
import AdjustParam from "./adjust-param";

export default function NavBar() {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <nav className='flex items-center justify-end bg-gray-800 px-4 py-3'>
        <Button className='text-gray-300 hover:text-white' onClick={open}>
          <IconAdjustments />
        </Button>
      </nav>
      <Drawer position='left' opened={opened} onClose={close} size='100%' title='Setting'>
        <AdjustParam></AdjustParam>
      </Drawer>
    </>
  );
}
