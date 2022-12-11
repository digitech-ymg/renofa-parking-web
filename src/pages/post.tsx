import type { NextPage } from "next";
import {
  Container,
  Heading,
  Link,
  Text,
  Center,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  SimpleGrid,
  Button,
  VStack,
  Box,
  FormErrorMessage,
  CircularProgress,
  Image,
} from "@chakra-ui/react";
import { FaCarSide } from "react-icons/fa";
import { Icon } from "@chakra-ui/icons";
import { createPost, getMostRecentGame, getParkings, updateUser } from "@/lib/firestore";
import { Post } from "@/types/Post";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useAuthContext } from "@/context/AuthContext";
import { login } from "@/lib/authentication";

const nicknameMax = 20;

const parkingStatuses = [
  {
    color: "green.400",
    labels: ["たくさん", "停められる"],
    ratio: 0.1,
  },
  {
    color: "yellow.400",
    labels: ["半分くらい", "停めれそう"],
    ratio: 0.5,
  },
  {
    color: "orange.400",
    labels: ["あと20台くらい", "停めれそう"],
    ratio: 0.8,
  },
  {
    color: "red.400",
    labels: ["もうほとんど", "停めれない"],
    ratio: 1.0,
  },
];

const parkedAgoList = [
  {
    label: "ついさっき",
    value: 0,
  },
  {
    label: "10分ぐらい前",
    value: -10,
  },
  {
    label: "20分ぐらい前",
    value: -20,
  },
  {
    label: "30分ぐらい前",
    value: -30,
  },
  {
    label: "1時間ぐらい前",
    value: -60,
  },
  {
    label: "2時間ぐらい前",
    value: -120,
  },
];

const Post: NextPage = () => {
  const router = useRouter();
  const user = useAuthContext();

  const { data: game, error: errorGame } = useSWR("mostRecentGame", getMostRecentGame);
  const { data: parkings, error: errorParkings } = useSWR(game ? "parkings" : null, getParkings);

  const [nickname, setNickname] = useState("");
  const nicknameIsError = nickname === "" || nickname.length > nicknameMax;

  const [parkingId, setParkingId] = useState("");
  const parkingIdIsError = parkingId == "";

  const [parkingRatio, setParkingRatio] = useState(0);
  const parkingRatioIsError = parkingRatio === 0;

  const [parkedAgo, setParkedAgo] = useState(-1);
  const parkedAgoIsError = parkedAgo === -1;

  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    // 認証済みならニックネームを入れてあげる
    if (user) {
      setNickname(user.nickname);
    }
  }, [user]);

  return (
    <Container py={8} bgColor="white">
      {/* 認証済みは投稿画面 */}
      {user && (
        <>
          <Box mb={10}>
            <Center bg="#FFDB6A" h="40px" rounded={8}>
              <Heading as="h1" size="sm">
                駐車場状況の投稿
              </Heading>
            </Center>
            <Text color="orange.400" mt={4}>
              サポーターの方が駐車場の状況を投稿していただくことで、混雑情報が共有されます。ご協力をよろしくお願いします。
            </Text>
          </Box>

          <Box mb={10}>
            <FormControl isInvalid={nicknameIsError} isRequired>
              <FormLabel fontWeight="bold">ニックネームを入力してください。</FormLabel>
              <Input
                placeholder="ニックネーム"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <FormHelperText>このサイトのトップページに表示されます。</FormHelperText>
              {nicknameIsError && (
                <FormErrorMessage>{`${nicknameMax}文字以内で入力してください。`}</FormErrorMessage>
              )}
            </FormControl>
          </Box>

          <Box mb={10}>
            <FormControl isInvalid={parkingIdIsError} isRequired>
              <FormLabel fontWeight="bold">停めた駐車場を選択してください。</FormLabel>
              <SimpleGrid templateColumns="repeat(3, 1fr)" gap={4}>
                {!parkings && !errorParkings && <p>loading...</p>}
                {game &&
                  parkings &&
                  parkings.map((parking, index) => (
                    <Button
                      key={index}
                      h="100"
                      bg="white"
                      isDisabled={!game.availableParkings.includes(parking.id)}
                      border={parking.id === parkingId ? "4px" : "1px"}
                      borderColor={parking.id === parkingId ? "red.500" : "gray.200"}
                      rounded={8}
                      shadow="md"
                      _hover={{ bg: "white" }}
                      _active={{
                        bg: "white",
                      }}
                      onClick={() => setParkingId(parking.id)}
                    >
                      {parking.name}
                    </Button>
                  ))}
                <div>
                  <Image src="/reno_01.png" alt="レノ丸君" height="100" margin="auto" />
                </div>
                {errorParkings && <p>駐車場情報の取得に失敗しました。</p>}
              </SimpleGrid>
              {parkingIdIsError && (
                <FormErrorMessage>どれか1つを選択してください。</FormErrorMessage>
              )}
            </FormControl>
          </Box>

          <Box mb={10}>
            <FormControl isInvalid={parkingRatioIsError} isRequired>
              <FormLabel fontWeight="bold">
                見えている範囲で、あとどれくらい車を止めることができそうですか？（最も近いと思うのものを選んでください）
              </FormLabel>
              <SimpleGrid templateColumns="repeat(2, 1fr)" gap={4}>
                {parkingStatuses.map((status, index) => (
                  <Button
                    key={index}
                    h="150"
                    bg="white"
                    border={status.ratio === parkingRatio ? "4px" : "1px"}
                    borderColor={status.ratio === parkingRatio ? "red.500" : "gray.200"}
                    rounded={8}
                    shadow="md"
                    _hover={{ bg: "white" }}
                    _active={{
                      bg: "white",
                    }}
                    onClick={() => setParkingRatio(status.ratio)}
                  >
                    <VStack>
                      {status.labels.map((label, index2) => (
                        <Text key={index2} color={status.color}>
                          {label}
                        </Text>
                      ))}
                      <Icon as={FaCarSide} w={16} h={16} color={status.color} />
                    </VStack>
                  </Button>
                ))}
                {errorParkings && <p>駐車場情報の取得に失敗しました。</p>}
              </SimpleGrid>
              {parkingRatioIsError && (
                <FormErrorMessage>どれか1つを選択してください。</FormErrorMessage>
              )}
            </FormControl>
          </Box>

          <Box mb={10}>
            <FormControl isInvalid={parkedAgoIsError} isRequired>
              <FormLabel fontWeight="bold">いつ駐車場に停めましたか？</FormLabel>
              <SimpleGrid templateColumns="repeat(3, 1fr)" gap={4}>
                {parkedAgoList.map((ago, index) => (
                  <Button
                    key={index}
                    h="100"
                    fontSize="sm"
                    bg="white"
                    border={ago.value === parkedAgo ? "4px" : "1px"}
                    borderColor={ago.value === parkedAgo ? "red.500" : "gray.200"}
                    rounded={8}
                    shadow="md"
                    _hover={{ bg: "white" }}
                    _active={{
                      bg: "white",
                    }}
                    onClick={() => setParkedAgo(ago.value)}
                  >
                    {ago.label}
                  </Button>
                ))}
              </SimpleGrid>
              {parkedAgoIsError && (
                <FormErrorMessage>どれか1つを選択してください。</FormErrorMessage>
              )}
            </FormControl>
          </Box>

          <Box mb={10}>
            {game && (
              <Button
                colorScheme="teal"
                size="lg"
                width="100%"
                isDisabled={
                  nicknameIsError || parkingIdIsError || parkingRatioIsError || parkedAgoIsError
                }
                onClick={() => {
                  const postedAt = new Date();
                  const parkedAt = new Date(postedAt.getTime() + 60000 * parkedAgo);
                  //　試合開始時間に対して何分前か（現在時間と「いつ停めた」設問から導く
                  const minutes =
                    Math.floor((postedAt.getTime() - game.startAt.getTime()) / 60000) + parkedAgo;

                  const promises: Promise<void>[] = [
                    createPost({
                      nickname: nickname,
                      gameId: game.id,
                      parkingId: parkingId,
                      parkingRatio: parkingRatio,
                      parkingMinutes: minutes,
                      parkedAgo: parkedAgo,
                      parkedAt: parkedAt,
                      postedAt: postedAt,
                      userId: user.id,
                    }),
                  ];

                  Promise.all(promises)
                    .then(() => {
                      router.push("/postsuccess");
                    })
                    .catch((e) => {
                      router.push("/posterror");
                    });
                }}
              >
                送信する
              </Button>
            )}
          </Box>
        </>
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
          <Box mb={10}>
            <Text color="gray.700" mt={4}>
              投稿による当サイトへの貢献を含め、今後のより良いWebサイトを開発するためにTwitter認証での連携をお願いします。ご協力をよろしくお願いします。
            </Text>
          </Box>
          <Box mb={10}>
            <Button
              colorScheme="twitter"
              // bg="#81ccFF"
              color="black"
              size="lg"
              width="100%"
              onClick={() => {
                login()
                  .then(() => {
                    router.push("/post");
                  })
                  .catch((error) => {
                    setLoginError(error.message);
                  });
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

export default Post;
