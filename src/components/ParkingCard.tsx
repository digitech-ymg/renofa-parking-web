import { VFC } from "react";
import { FaCarSide } from "react-icons/fa";
import { useRouter } from "next/router";
import { Heading, Flex, Text, HStack, Spacer } from "@chakra-ui/react";
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

const stateText = (status: ParkingStatus): string => {
  switch (status.state) {
    case "disable":
      return "未開場";
    case "beforeOpen":
      return "開場前";
    case "afterClosed":
      return "閉場";
    case "opened":
      if (status.percent == 100) {
        return "満車";
      } else {
        return `およそ ${status.percent.toString()}%`;
      }
    case "filled":
      return "満車";
    default:
      return "";
  }
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
        <Text fontSize="sm">{stateText(status)}</Text>
        <ChevronRightIcon />
      </HStack>
    </Flex>
  );
};

export default ParkingCard;
