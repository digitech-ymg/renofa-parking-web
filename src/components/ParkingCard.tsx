import { VFC } from "react";
import { Heading, Flex, Spacer, Box } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { Parking } from "@/types/Parking";

type Props = {
  parking: Parking;
};

const ParkingCard: VFC<Props> = ({ parking }: Props) => {
  const router = useRouter();

  return (
    <Box
      onClick={() => {
        router.push({
          pathname: "/parking",
          query: { parking: parking.key },
        });
      }}
      cursor="pointer"
      border={1}
      bg="white"
      p={4}
      borderRadius={4}
    >
      <Flex>
        <Heading as="h5" size="sm">
          {parking.name}
        </Heading>
        <Spacer />
        <ChevronRightIcon />
      </Flex>
    </Box>
  );
};

export default ParkingCard;
