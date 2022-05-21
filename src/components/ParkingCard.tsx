import { VFC } from "react";
import { FaCarSide } from "react-icons/fa";
import { useRouter } from "next/router";
import { Heading, Flex, Text, HStack, Spacer, Stack } from "@chakra-ui/react";
import { ChevronRightIcon, Icon } from "@chakra-ui/icons";
import { Parking, ParkingStatus } from "@/types/Parking";

type Props = {
  parking: Parking;
  status: ParkingStatus;
};

const stateBg = (status: ParkingStatus): string => {
  switch (status.state) {
    case "disable":
    case "afterClosed":
      return "gray.300";
    case "beforeOpen":
    case "opened":
    case "filled":
    case "soldOut":
    default:
      return "white";
  }
};

const stateColor = (status: ParkingStatus): string => {
  switch (status.state) {
    case "disable":
    case "beforeOpen":
    case "afterClosed":
      return "gray.400";
    case "opened":
      if (status.percent < 50) {
        return "green.400";
      } else if (status.percent < 70) {
        return "yellow.400";
      } else if (status.percent < 90) {
        return "orange.400";
      } else {
        return "red.400";
      }
    case "filled":
    case "soldOut":
      return "red.400";
    default:
      return "gray.400";
  }
};

const renderStateText = (status: ParkingStatus): JSX.Element => {
  const texts = [];

  switch (status.state) {
    case "disable":
      texts.push("未開場");
      break;
    case "beforeOpen":
      texts.push("開場前");
      break;
    case "afterClosed":
      texts.push("閉場");
      break;
    case "soldOut":
      texts.push("完売");
      break;
    case "opened":
      if (status.percent == 100) {
        texts.push("満車");
      } else {
        texts.push(`駐車率：約${status.percent}%`);
        if (status.fillMinutes > 0) {
          texts.push(`満車まで：約${status.fillMinutes.toString()}分`);
        }
      }
      break;
    case "filled":
      texts.push("満車");
      break;
  }
  return (
    <Stack>
      {texts.map((text, index) => (
        <Text key={index} fontSize="xs" align="right">
          {text}
        </Text>
      ))}
    </Stack>
  );
};

const ParkingCard: VFC<Props> = ({ parking, status }: Props) => {
  const router = useRouter();

  return (
    <Flex
      onClick={() => {
        router.push({
          pathname: "/parking",
          query: { parking: parking.id },
        });
      }}
      cursor="pointer"
      border={1}
      bg={stateBg(status)}
      minH={14}
      px={4}
      borderRadius={4}
      justify="center"
      align="center"
    >
      <HStack>
        <Icon as={FaCarSide} w={6} h={6} color={stateColor(status)} />
        <Heading as="h5" size="sm">
          {parking.name}
        </Heading>
      </HStack>
      <Spacer />
      <HStack>
        {renderStateText(status)}
        <ChevronRightIcon />
      </HStack>
    </Flex>
  );
};

export default ParkingCard;
