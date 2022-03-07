import { Stack, HStack, Flex, Text, Spacer } from "@chakra-ui/react";
import { FaComment } from "react-icons/fa";
import { Icon } from "@chakra-ui/icons";

type Props = {
  names: string[];
};

const ParkingStatusSharer = ({ names }: Props) => {
  return (
    <Stack spacing={2}>
      <HStack spacing={2} align="center" mx="auto">
        <Icon as={FaComment} w={5} h={5} color="#30918F" />
        <Text fontSize="md">駐車場状況を共有していただいた方</Text>
      </HStack>
      <Stack fontSize="sm">
        (names && <Text>{names.map((name) => `${name}さん`).join("・")}</Text>)
      </Stack>
    </Stack>
  );
};

export default ParkingStatusSharer;
