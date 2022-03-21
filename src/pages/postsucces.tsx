import type { NextPage } from "next";
import { Container, Text, HStack, Box, Stack, Button, Link } from "@chakra-ui/react";
import Iframe from "react-iframe";
import { Icon } from "@chakra-ui/icons";
import { CheckCircleIcon } from "@chakra-ui/icons";

const Postsucces: NextPage = () => {
  return (
    <Container py={8} bgColor="white">
      <Box border="4px" borderColor="green.400" rounded={8} p={4}>
        <HStack color="green.400" spacing={4}>
          <Icon as={CheckCircleIcon} w="60px" h="60px" />
          <Box fontSize="xl">
            <Text mb={2}>投稿ありがとうございます。駐車場の情報共有に役立ちました！</Text>
            <Text>レノファが勝てるよう応援がんばりましょう！！</Text>
          </Box>
        </HStack>
      </Box>
      <Box mt={10}>
        <Text mb={2}>このサイトの今後の活用に向け、簡単なアンケートにもご協力ください。</Text>
        <Iframe
          url="https://docs.google.com/forms/d/e/1FAIpQLSd_lTRjm5R3KXLrBleC8VGnZ8-nTIk3lZ2VBR09RdJK1k0Qng/viewform?embedded=true"
          width="100%"
          height="1350"
          scrolling="no"
        >
          読み込んでいます…
        </Iframe>
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

export default Postsucces;
