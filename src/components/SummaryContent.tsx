import { Heading, Text, Box, Container, Stack, HStack, Flex } from "@chakra-ui/react";
import { VFC } from "react";
import { userPostTimes2022 } from "@/data/ranking";

const SummaryContent: VFC = () => {
  const UserPostTimes = userPostTimes2022;
  return (
    <Container py={2} bgColor="white" color="black">
      <Stack my={2} margin={2}>
        <Text fontSize="l">
          レノファ山口の選手、サポーター、関係者の皆様、お疲れ様でした！
          2022シーズンが終了しましたが、当サイトの運営にあたり、たくさんの方々にご協力いただいております。
          特に、駐車場の混雑問題を解消するに向け、多くの投稿をしてくださった方々を以下にご記載いたします。
          皆様、ご協力ありがとうございました。今後とも、引き続きよろしくお願いいたします。
        </Text>
      </Stack>
      <Stack spacing={2} bgColor="orange.200" padding={3}>
        {UserPostTimes.filter((UserPostTimes) => UserPostTimes.postTime >= 6).map(
          (userPostTime, index) => (
            <Flex
              key={index}
              minH={14}
              px={4}
              borderRadius={4}
              justify="center"
              bgColor="orange.50"
            >
              <HStack>
                {index == 0 && (
                  <Heading as="h5" size="sm" marginRight={5} color="red" fontWeight="extrabold">
                    {userPostTime.nickname} さん&emsp;
                    {userPostTime.postTime} 回
                  </Heading>
                )}
                {index == 1 && (
                  <Heading as="h5" size="sm" marginRight={5} fontWeight="extrabold">
                    {userPostTime.nickname} さん&emsp;
                    {userPostTime.postTime} 回
                  </Heading>
                )}
                {index > 1 && (
                  <Heading as="h5" size="sm" marginRight={5} fontWeight="medium">
                    {userPostTime.nickname} さん&emsp;
                    {userPostTime.postTime} 回
                  </Heading>
                )}
              </HStack>
            </Flex>
          )
        )}
      </Stack>
      <Stack margin={2}>
        <Text>
          {UserPostTimes.filter(
            (UserPostTimes) => UserPostTimes.postTime < 6 && UserPostTimes.postTime > 1
          )
            .map((UserPostTime) => `${UserPostTime.nickname}さん`)
            .join("・")}
        </Text>
      </Stack>
      <Stack margin={2}>
        <Text fontSize="l" fontWeight="bold">
          その他、多くの投稿者の方々、ありがとうございました。
        </Text>
      </Stack>
    </Container>
  );
};

export default SummaryContent;
