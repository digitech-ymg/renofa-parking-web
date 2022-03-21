import type { NextPage } from "next";
import { Container, Heading, Text, HStack, Box, Link, Button } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { WarningIcon } from "@chakra-ui/icons";

const Posterror: NextPage = () => {
  return (
    <Container py={4} bgColor="white" px={0}>
      <Box border="4px" borderColor="red.500" rounded={8} mx={4} mb={4} p={4}>
        <HStack color="red.400" spacing={4}>
          <Icon as={WarningIcon} w="48px" h="48px" />
          <Box>
            <Heading as="h1" mb={2} fontSize="xl">
              投稿失敗
            </Heading>
            <Text>申し訳ございません。</Text>
          </Box>
        </HStack>
      </Box>

      <Box px={4} mb={4}>
        <Link href="/">
          <Button colorScheme="yellow" color="black" size="lg" width="100%">
            <Text>トップページに戻る</Text>
          </Button>
        </Link>
      </Box>
    </Container>
  );
};

export default Posterror;
