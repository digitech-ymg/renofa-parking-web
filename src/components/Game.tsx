import type { VFC } from "react";
import { Center, Heading } from "@chakra-ui/react";
import { Stack, Box, Text } from "@chakra-ui/react";
import data from "@/data/data.json";

const Game: VFC = () => {
  const game = data;
  const start = new Date(game.startAt);

  const dateString = (date: Date): string => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const dayString = (date: Date): string => {
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    return `（${days[date.getDay()]}）`;
  };

  const timeString = (date: Date): string => {
    const paddedMinutes = date.getMinutes().toString().padStart(2, "0");
    return `${date.getHours()}:${paddedMinutes}`;
  };

  return (
    <Center bg="black" p="8" color="white">
      <Stack textAlign="center">
        <Heading as="h3" size="xs">
          次の試合
        </Heading>
        <Box display="flex" alignItems="baseline">
          <Text fontSize="3xl" fontWeight="bold">
            {dateString(start)}
          </Text>
          <Text fontSize="lg" fontWeight="bold">
            {dayString(start)}
          </Text>
          <Text fontSize="xl" fontWeight="bold">
            {timeString(start)}〜
          </Text>
        </Box>
        <Text fontSize="xs" color="gray.300">
          {game.kind} {game.section}
        </Text>
        <Text fontSize="lg">{game.opponent}</Text>
      </Stack>
    </Center>
  );
};

export default Game;
