import { Center, Heading, Text, Box } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import type { VFC } from "react";

const GoMyPage: VFC = () => {
  return (
    <Center
      bg="white"
      h="72px"
      color="black"
      border="1px"
      borderColor="orange.200"
      bgColor="orange.50"
      rounded="md"
    >
      <InfoIcon w={8} h={8} color="orange.500" />
      <Box pl="3">
        <Heading as="h5" size="sm">
          マイページができました
        </Heading>
        <Text fontSize="12">2022シーズンの投稿回数と称号が確認できます</Text>
      </Box>
    </Center>
  );
};

export default GoMyPage;
