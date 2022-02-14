import type { VFC } from "react";
import { Flex } from "@chakra-ui/react";
import { Stack, Box, Text } from "@chakra-ui/react";
import { Game } from "@/types/Game";

type Props = {
  game: Game;
};

const GameInfo = ({ game }: Props) => {
  const start = new Date(game.startAt);

  const dateString = (date: Date): string => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const dayString = (date: Date): string => {
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    return `(${days[date.getDay()]})`;
  };

  const timeString = (date: Date): string => {
    const paddedMinutes = date.getMinutes().toString().padStart(2, "0");
    return `${date.getHours()}:${paddedMinutes}`;
  };

  return (
    <Flex bg="black" p="4" color="white">
      <Box flex="1">
        <Stack textAlign="center">
          <Text fontSize="sm">
            {dateString(start)}
            {dayString(start)}
          </Text>
          <Text fontSize="lg">{timeString(start)}〜</Text>
        </Stack>
      </Box>
      <Box flex="3">
        <Stack textAlign="center">
          <Text fontSize="xs" color="gray.300">
            {game.kind} {game.section}
          </Text>
          <Text fontSize="lg">{game.opponent}</Text>
        </Stack>
      </Box>
    </Flex>
  );
};

export default GameInfo;
