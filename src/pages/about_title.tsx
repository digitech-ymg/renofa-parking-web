import type { NextPage } from "next";
import {
  Container,
  Heading,
  Text,
  VStack,
  Box,
  Link,
  Button,
  Image,
  HStack,
} from "@chakra-ui/react";

const Mypage: NextPage = () => {
  return (
    <Container py={4} bgColor="white" px={0}>
      <Box border="2px" color="black">
        <Text>
          マイページの名前の上に表示されている「称号」は、投稿回数や情報を投稿した駐車場などの条件により変化します。より多くの情報を投稿した人だけがもらえる称号もあるかも？
          <br></br>
          ぜひ皆さんで探してみてください！
        </Text>
      </Box>

      <Box px={4} mb={4} p={4}>
        <Link href="/">
          <Button colorScheme="yellow" color="black" size="lg" width="100%">
            <Text>トップページに戻る</Text>
          </Button>
        </Link>
      </Box>
    </Container>
  );
};

export default Mypage;
