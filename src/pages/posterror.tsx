import type { NextPage } from "next";
import { Container, Heading, Text, VStack, Box, Link, Stack, Button } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { WarningIcon } from "@chakra-ui/icons";

const Posterror: NextPage = () => {
  return (
    <Container py={8} bgColor="white">
      <Box border="4px" borderColor="red.500" rounded={8} py={20}>
        <VStack color="red.500" spacing={10}>
          <Box align="center">
            <Heading as="h5" size="xl" mb={4}>
              エラー
            </Heading>
            <Box fontSize="xl">
              <Text>申し訳ございません。</Text>
              <Text>投稿できませんでした。</Text>
            </Box>
          </Box>
          <Icon as={WarningIcon} w="100px" h="100px" />
        </VStack>
      </Box>
      <Stack mt={8}>
        <Link href="/">
          <Button colorScheme="yellow" color="black" size="lg" width="100%">
            <Text>トップページに戻る</Text>
          </Button>
        </Link>
      </Stack>
    </Container>
  );
};

export default Posterror;
