import type { VFC } from "react";
import { Center, Heading } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const RenofaBanner: VFC = () => {
  return (
    <Center bg="orange.400" h="61px" color="white">
      <Heading as="h5" size="sm">
        レノファ公式サイト
        <ExternalLinkIcon mx="1" />
      </Heading>
    </Center>
  );
};

export default RenofaBanner;
