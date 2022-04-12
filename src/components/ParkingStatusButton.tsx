import { Flex, Heading, Center, Text, Box, Spacer } from "@chakra-ui/react";
import { FaComment } from "react-icons/fa";
import { Icon, ChevronRightIcon } from "@chakra-ui/icons";
import type { VFC } from "react";

const ParkingStatusButton: VFC = () => {
  return (
    <>
      <Flex
        px={4}
        justify="center"
        align="center"
        bg="#FFDB6A"
        rounded={8}
        shadow="md"
        h="72px"
        color="black"
        border="1px"
        borderColor="gray.200"
      >
        <Center flexGrow={1}>
          <Icon as={FaComment} w={8} h={8} color="white" />
          <Box pl="3">
            <Heading as="h5" size="sm">
              駐車場に車を停めた後
              <br />
              駐車場の状況を教えてください
            </Heading>
            <Text fontSize="12">このサイトの駐車率と予測に反映されます</Text>
          </Box>
        </Center>
        <ChevronRightIcon flexGrow={0} />
      </Flex>
    </>
  );
};

export default ParkingStatusButton;
