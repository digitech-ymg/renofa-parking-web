import type { VFC } from "react";
import {
  Stack,
  StackDivider,
  useColorModeValue,
  Heading,
  Flex,
  Spacer,
  Box,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import data from "@/data/data.json";
import { useRouter } from "next/router";

const parkings = data.parkings;
console.info(parkings);

const ParkingList: VFC = () => {
  const router = useRouter();
  return (
    <Stack
      spacing={5}
      divider={<StackDivider borderColor={useColorModeValue("gray.100", "gray.700")} />}
    >
      {parkings.map((parking) => (
        <Box
          key={parking.key}
          onClick={() => {
            router.push({
              pathname: "/parking",
              query: { parking: parking.key },
            });
          }}
        >
          <Flex>
            <Heading as="h5" size="sm" ml="3">
              {parking.name}
            </Heading>
            <Spacer />
            <ChevronRightIcon mr="3" />
          </Flex>
        </Box>
      ))}
    </Stack>
  );
};

export default ParkingList;
