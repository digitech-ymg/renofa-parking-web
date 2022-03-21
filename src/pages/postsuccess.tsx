import type { NextPage } from "next";
import { Container, Heading, Text, HStack, Box, Stack, Button, Link } from "@chakra-ui/react";
import Iframe from "react-iframe";
import { Icon } from "@chakra-ui/icons";
import { CheckCircleIcon } from "@chakra-ui/icons";

const Postsuccess: NextPage = () => {
  return (
    <Container py={4} bgColor="white" px={0}>
      <Box border="4px" borderColor="green.400" rounded={8} mx={4} mb={4} p={4}>
        <HStack color="green.400" spacing={4}>
          <Icon as={CheckCircleIcon} w="48px" h="48px" />
          <Box>
            <Heading as="h1" mb={2} fontSize="xl">
              投稿成功
            </Heading>
            <Text mb={2}>投稿ありがとうございます。駐車場の情報共有に役立ちました！</Text>
            <Text>レノファが勝てるよう応援がんばりましょう！！</Text>
          </Box>
        </HStack>
      </Box>
      <Box mx={4}>
        <Text mb={2} fontWeight="bold">
          このサイトの利用に関するアンケートです。皆さんの声がこのサイトの改善に役立ちます。試合の度に、その都度ご回答をお願いします！
        </Text>
      </Box>
      <Box mb={8}>
        <Iframe
          url="https://docs.google.com/forms/d/e/1FAIpQLSd_lTRjm5R3KXLrBleC8VGnZ8-nTIk3lZ2VBR09RdJK1k0Qng/viewform?embedded=true"
          width="100%"
          height="1350"
          scrolling="no"
        >
          読み込んでいます…
        </Iframe>
      </Box>
      <Box px={4}>
        <Link href="/">
          <Button colorScheme="yellow" color="black" size="lg" width="100%">
            <Text>トップページに戻る</Text>
          </Button>
        </Link>
      </Box>
    </Container>
  );
};

export default Postsuccess;
