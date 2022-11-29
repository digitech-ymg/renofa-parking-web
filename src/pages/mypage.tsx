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
import { Icon } from "@chakra-ui/icons";
import { StarIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { useAuthContext } from "@/context/AuthContext";
import { useState } from "react";

const Mypage: NextPage = () => {
  const user = {
    nickname: "aaa",
    title: "default title",
    titleDescription: "default titleDescription",
  }; //仮user
  // const user: any = useAuthContext();
  const nickname = user.nickname;

  const title = user.title;
  const titleDescription = user.titleDescription;
  const [postTimes, setPostTimes] = useState(0);

  fetch("../postTimesData.json")
    .then((response) => response.text())
    .then((data) => {
      // console.log(data);
      const postTimesData = JSON.parse(data);
      setPostTimes(
        postTimesData.find((data: any) => {
          return data.nickname == nickname;
        }).postTimes
      );
    });

  return (
    <Container py={4} bgColor="white" px={0}>
      <Box px={4} mb={4}>
        <Button bg="orange.400" color="black" size="lg" width="100%">
          <Text>マイページ</Text>
        </Button>
      </Box>

      <Box px={4} mb={4}>
        <HStack spacing={4}>
          <Image width="20%" objectFit="cover" src="/reno_01.png" alt="レノ丸" marginLeft={1} />
          <Box margin={0}>
            <Heading as="h1" mb={2} fontSize="3xl" textAlign="center">
              {title}
            </Heading>
            <Text mb={2} textAlign="center">
              {titleDescription}
            </Text>
            <Text fontSize="4xl">{nickname}さん</Text>
          </Box>
        </HStack>
      </Box>

      <Box mx={4} textAlign="right">
        <Link href="/about_title">
          <Text>
            <Icon as={ArrowRightIcon} margin="5px" color="gold"></Icon>称号とは
          </Text>
        </Link>
      </Box>

      <Box border="4px" borderColor="orange.400" rounded={8} mx={4} mb={4} p={4}>
        <Text>
          <Icon as={StarIcon} margin="5px" color="orange.400"></Icon>2022年投稿回数
        </Text>
        <Text textAlign="center" fontSize="6xl">
          {postTimes}回
        </Text>
      </Box>

      <Box mx={4} mb={4} p={4}>
        <Text textAlign="center" fontSize="2xl" color="orange.400">
          投稿ありがとうございます！
        </Text>
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

export default Mypage;
