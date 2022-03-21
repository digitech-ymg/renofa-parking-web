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
  Stack,
  VStack,
  Box,
} from "@chakra-ui/react";
import { FaCarSide } from "react-icons/fa";
import { Icon } from "@chakra-ui/icons";

const parkingStatuses = [
  {
    color: "green.400",
    labels: ["たくさん", "停められる"],
  },
  {
    color: "yellow.400",
    labels: ["半分くらい", "停めれそう"],
  },
  {
    color: "orange.400",
    labels: ["あと20台くらい", "停めれそう"],
  },
  {
    color: "red.400",
    labels: ["もうほとんど", "停めれない"],
  },
];

const Post: NextPage = () => {
  return (
    <Container py={8} bgColor="white">
      <Center bg="#FFDB6A" h="40px" rounded={8}>
        <Heading as="h1" size="sm">
          駐車場状況の投稿
        </Heading>
      </Center>
      <Text color="orange.400" mt={4}>
        サポーターの方が駐車場の状況を投稿していただくことで、混雑情報が共有されます。ご協力をよろしくお願いします。
      </Text>
      <Box mt={10}>
        <FormControl>
          <FormLabel>ニックネームを入力してください。</FormLabel>
          <Input placeholder="ニックネーム（10文字以内）" />
        </FormControl>
      </Box>
      <Box mt={10}>
        <Text mb={2}>停めた駐車場を教えてください。</Text>
        <SimpleGrid templateColumns="repeat(3, 1fr)" gap={4}>
          <Button h="100" bg="white" border="1px" borderColor="gray.200" rounded={8} shadow="md">
            有料駐車場
          </Button>
          <Button h="100" bg="white" border="1px" borderColor="gray.200" rounded={8} shadow="md">
            JA山口
          </Button>
          <Button h="100" bg="white" border="1px" borderColor="gray.200" rounded={8} shadow="md">
            河川敷
          </Button>
          <Button h="100" bg="white" border="1px" borderColor="gray.200" rounded={8} shadow="md">
            トラック協会
          </Button>
          <Button h="100" bg="white" border="1px" borderColor="gray.200" rounded={8} shadow="md">
            パナソニック
          </Button>
        </SimpleGrid>
      </Box>
      <Box my={10}>
        <Text mb={2}>見えている範囲で、どのくらい埋まっていますか？</Text>
        <SimpleGrid templateColumns="repeat(2, 1fr)" gap={4}>
          {parkingStatuses.map((status, index) => (
            <Button
              key={index}
              h="150"
              bg="white"
              border="1px"
              borderColor="gray.200"
              rounded={8}
              shadow="md"
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
      </Box>
      <Stack>
        <Button colorScheme="teal" size="lg">
          送信する
        </Button>
      </Stack>
    </Container>
  );
};

export default Post;
