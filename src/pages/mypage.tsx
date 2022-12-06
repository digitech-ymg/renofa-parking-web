/* eslint-disable react-hooks/exhaustive-deps */
import {
  Container,
  Heading,
  Text,
  Box,
  Link,
  Button,
  Image,
  Flex,
  Center,
  CircularProgress,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { StarIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { MypageInfo } from "@/types/User";
import { login } from "@/lib/authentication";
import { useRouter } from "next/router";
import { mypageInfos2022 } from "@/data/mypage";

type Props = {
  mypageInfos: MypageInfo[];
};

const Mypage = ({ mypageInfos }: Props) => {
  const router = useRouter();
  const user: any = useAuthContext();

  const [mypageInfo, setMypageInfo] = useState<MypageInfo | undefined>(undefined);

  useEffect(() => {
    if (user) {
      const existing = mypageInfos.find((m) => m.nickname === user.nickname);
      if (existing) {
        setMypageInfo(existing);
      } else {
        setMypageInfo({
          nickname: user.nickname,
          title: "期待の新人サポーター",
          titleDescription: "投稿数が0件の方に贈られる称号です",
          postTimes: 0,
        });
      }
    }
  }, [user]);

  return (
    <Container py={8} bgColor="white">
      <Box mb={4}>
        <Button bg="orange.400" color="black" size="lg" width="100%">
          <Text>マイページ</Text>
        </Button>
      </Box>

      {/* 認証済み */}
      {user && mypageInfo && (
        <Box mb={4}>
          <Flex>
            <Image width="25%" fit="contain" src="/reno_01.png" alt="レノ丸" marginLeft={1} />
            <Center flex="1">
              <Box margin={0} w="100%" textAlign="center">
                <Heading as="h1" mb={2} fontSize="20px" textAlign="center">
                  {mypageInfo.title}
                </Heading>
                <Text mb={2} fontSize="10px">
                  {mypageInfo.titleDescription}
                </Text>
                <Text fontSize="32px">{mypageInfo.nickname}さん</Text>
              </Box>
            </Center>
          </Flex>

          <Box mx={4} mb={4} textAlign="right">
            <Popover>
              <PopoverTrigger>
                <Text w="100%" textAlign="right">
                  <Icon as={ArrowRightIcon} margin="5px" color="gold"></Icon>称号とは
                </Text>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody borderColor="black" textAlign="left">
                  マイページの名前の上に表示されている「称号」は、投稿回数や情報を投稿した駐車場などの条件により変化します。
                  より多くの情報を投稿した人だけがもらえる称号もあるかも？
                  ぜひ皆さんで探してみてください！
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>

          <Box border="4px" borderColor="orange.400" rounded={8} mb={4} p={4}>
            <Text>
              <Icon as={StarIcon} margin="5px" color="orange.400"></Icon>2022年投稿回数
            </Text>
            <Text textAlign="right" fontSize="64px" mr={8} letterSpacing={2}>
              {mypageInfo.postTimes}回
            </Text>
          </Box>

          <Box mx={4} mb={4} p={4}>
            <Text textAlign="center" fontSize="18px" color="orange.400">
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
        </Box>
      )}
      {/* 認証確認中 */}
      {user === undefined && (
        <>
          <Box mb={10}>
            <Center h="40px">
              <Text>Twitter認証確認中・・・</Text>
              <CircularProgress value={30} color="orange.400" thickness="12px" />
            </Center>
          </Box>
        </>
      )}
      {/* 未認証済ならログイン画面 */}
      {user === null && (
        <>
          <Box mt={16} mb={4}>
            <Text mt={4}>
              マイページは投稿回数と称号を確認することができます。ぜひご利用ください！
            </Text>
          </Box>
          <Box mb={4}>
            <Button
              colorScheme="twitter"
              color="black"
              size="lg"
              width="100%"
              onClick={() => {
                login()
                  .then(() => {
                    router.push("/post");
                  })
                  .catch((error) => {});
              }}
            >
              <Text>Twitterで認証する</Text>
            </Button>
          </Box>
          <Box mb={10}>
            <Link href="/">
              <Button colorScheme="gray" color="black" size="lg" width="100%">
                <Text>トップページに戻る</Text>
              </Button>
            </Link>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Mypage;

export const getStaticProps = async () => {
  const mypageInfos = mypageInfos2022;

  return {
    props: {
      mypageInfos,
    },
  };
};