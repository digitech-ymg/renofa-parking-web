import type { NextPage } from "next";
import { Container, Heading, Text, VStack, Box, Link, Button, Image } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { WarningIcon } from "@chakra-ui/icons";

const Posterror: NextPage = () => {
  return (
    <Container py={4} bgColor="white" px={0}>
      <Box border="4px" borderColor="red.500" rounded={8} mx={4} mb={4} p={4}>
        <VStack color="red.400" spacing={4} justify="center">
          <Icon as={WarningIcon} w="144px" h="144px" margin="10px" />
          <Box>
            <Heading as="h1" mb={2} fontSize="xl" textAlign="center">
              エラー
            </Heading>
            <Text textAlign="center">申し訳ございません。</Text>
            <Text textAlign="center">投稿できませんでした。</Text>
          </Box>
          <Image
            width="50%"
            margin="25px"
            objectFit="cover"
            src="/img/reno_06.png"
            alt="レノ丸君"
          />
        </VStack>
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
