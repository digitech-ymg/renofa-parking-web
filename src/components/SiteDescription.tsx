import { Center, Square, Circle, Heading, Text, Box } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import type { VFC } from "react";

const SiteDescription: VFC = () => {
  return (
    <Center bg="white" h="72px" color="black" border="1px" borderColor="gray.200">
      <InfoIcon w={8} h={8} color="gray.500" />
      <Box ml="3">
        <Heading as="h5" size="sm">
          このサイトについて
        </Heading>
        <Text fontSize="12">はじめての方は必ずお読みください</Text>
      </Box>
    </Center>
  );
};

export default SiteDescription;
