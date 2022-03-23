import { Stack, HStack, Flex, Text, Spacer } from "@chakra-ui/react";
import { FaCarSide } from "react-icons/fa";
import { Icon } from "@chakra-ui/icons";

const disableColor: string = "gray.400";
const enableColors: string[] = ["green.400", "yellow.400", "orange.400", "red.400"];

const ParkingColorSample = () => {
  const now = new Date();

  return (
    <Stack spacing={2}>
      <Flex spacing={4} width="100%">
        <Spacer />
        <HStack spacing={2}>
          <Text fontSize="sm">未開場</Text>
          <Icon as={FaCarSide} w={5} h={5} color={disableColor} />
        </HStack>
        <Spacer />
        <HStack spacing={2}>
          <Text fontSize="sm">空車</Text>
          {enableColors.map((color, idx) => (
            <Icon key={idx} as={FaCarSide} w={5} h={5} color={color} />
          ))}
          <Text fontSize="sm">満車</Text>
        </HStack>
        <Spacer />
      </Flex>
    </Stack>
  );
};

export default ParkingColorSample;
