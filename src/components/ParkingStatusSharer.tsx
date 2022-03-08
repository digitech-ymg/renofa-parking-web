import { Stack, HStack, Text } from "@chakra-ui/react";
import { FaComment } from "react-icons/fa";
import { Icon } from "@chakra-ui/icons";

type Props = {
  names: string[];
};

const ParkingStatusSharer = ({ names }: Props) => {
  return (
    <Stack spacing={2}>
      <HStack spacing={2} align="center" mx="auto" borderBottom="1px" borderColor="#FFDB6A">
        <Icon as={FaComment} w={5} h={5} color="#30918F" />
        <Text fontSize="md">駐車場の状況を共有していただいた方</Text>
      </HStack>
      <Stack fontSize="sm" p={2}>
        (names && <Text>{names.map((name) => `${name}さん`).join("・")}</Text>)
      </Stack>
    </Stack>
  );
};

export default ParkingStatusSharer;
