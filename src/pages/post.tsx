import type { NextPage } from "next";
import {
  Container,
  Heading,
  Text,
  Center,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Button,
  VStack,
  Box,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FaCarSide } from "react-icons/fa";
import { Icon } from "@chakra-ui/icons";
import { createPost, getMostRecentGame, getParkings } from "@/lib/firestore";
import { Post } from "@/types/Post";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
import { useAuthContext } from "@/context/AuthContext";

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

const parkingMinutesList = [
  {
    label: "ついさっき",
    value: 0,
  },
  {
    label: "10分ぐらい前",
    value: 10,
  },
  {
    label: "20分ぐらい前",
    value: 20,
  },
  {
    label: "30分ぐらい前",
    value: 30,
  },
  {
    label: "1時間ぐらい前",
    value: 60,
  },
  {
    label: "2時間ぐらい前",
    value: 120,
  },
];

const Post: NextPage = () => {
  const router = useRouter();
  const { user } = useAuthContext();

  const { data: game, error: errorGame } = useSWR(
    user ? "mostRecentGame" : null,
    getMostRecentGame,
    {
      refreshInterval: 50000,
    }
  );
  const { data: parkings, error: errorParkings } = useSWR(
    user && game ? "parkings" : null,
    getParkings,
    {
      refreshInterval: 50000,
    }
  );

  const [nickname, setNickname] = useState("");
  const nicknameIsError = nickname == "" || nickname.length > 10;

  const [parkingId, setParkingId] = useState("");
  const parkingIdIsError = parkingId == "";

  const [parkingRatio, setParkingRatio] = useState(0);
  const parkingRatioIsError = parkingRatio === 0;

  const [parkingMinutes, setParkingMinutes] = useState(-1);
  const parkingMinutesIsError = parkingMinutes === -1;

  return (
    <Container py={8} bgColor="white">
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
          {nicknameIsError && <FormErrorMessage>10文字以内で入力してください。</FormErrorMessage>}
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
            {errorParkings && <p>駐車場情報の取得に失敗しました。</p>}
          </SimpleGrid>
          {parkingIdIsError && <FormErrorMessage>どれか1つを選択してください。</FormErrorMessage>}
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
          </SimpleGrid>
          {parkingRatioIsError && (
            <FormErrorMessage>どれか1つを選択してください。</FormErrorMessage>
          )}
        </FormControl>
      </Box>

      <Box mb={10}>
        <FormControl isInvalid={parkingMinutesIsError} isRequired>
          <FormLabel fontWeight="bold">いつ駐車場に停めましたか？</FormLabel>
          <SimpleGrid templateColumns="repeat(3, 1fr)" gap={4}>
            {parkingMinutesList.map((minutes, index) => (
              <Button
                key={index}
                h="100"
                fontSize="sm"
                bg="white"
                border={minutes.value === parkingMinutes ? "4px" : "1px"}
                borderColor={minutes.value === parkingMinutes ? "red.500" : "gray.200"}
                rounded={8}
                shadow="md"
                _hover={{ bg: "white" }}
                _active={{
                  bg: "white",
                }}
                onClick={() => setParkingMinutes(minutes.value)}
              >
                {minutes.label}
              </Button>
            ))}
          </SimpleGrid>
          {parkingMinutesIsError && (
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
              nicknameIsError || parkingIdIsError || parkingRatioIsError || parkingMinutesIsError
            }
            onClick={() => {
              //　試合開始時間に対する現在時間（分）を求めて、投稿の時間を加味する
              //　試合開始前はマイナス値でよい
              const minutes =
                Math.floor((new Date().getTime() - game.startAt.getTime()) / 60000) -
                parkingMinutes;
              createPost({
                nickname: nickname,
                gameId: game.id,
                parkingId: parkingId,
                parkingRatio: parkingRatio,
                parkingMinutes: minutes,
              })
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
    </Container>
  );
};

export default Post;
