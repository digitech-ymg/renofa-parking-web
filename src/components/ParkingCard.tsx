import { VFC } from "react";
import { FaCarSide } from "react-icons/fa";
import { useRouter } from "next/router";
import { Heading, Flex, Text, HStack, Spacer, Center } from "@chakra-ui/react";
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
    default:
      return "white";
  }
};

const stateColor = (status: ParkingStatus): string => {
  switch (status.state) {
    case "disable":
    case "beforeOpen":
    case "afterClosed":
      return "gray.500";
    case "opened":
      if (status.percent < 50) {
        return "green.500";
      } else if (status.percent < 70) {
        return "yellow.500";
      } else if (status.percent < 90) {
        return "orange.500";
      } else {
        return "red.500";
      }
    case "filled":
      return "red.500";
    default:
      return "gray.500";
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
    case "opened":
      if (status.percent == 100) {
        texts.push("満車");
      } else {
        texts.push("満車まで", `およそ${status.fillMinutes.toString()}分`);
      }
      break;
    case "filled":
      texts.push("満車");
      break;
  }
  return (
    <Text fontSize="sm" align="right">
      {texts.map((text, index) => (
        <p key={index}>{text}</p>
      ))}
    </Text>
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
      p={4}
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
