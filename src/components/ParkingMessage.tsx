import { Parking } from "@/types/Parking";
import { Box, Tag, Text } from "@chakra-ui/react";
import { VFC } from "react";
import { suggestMessage } from "../utils/suggestMessage";
import { suggestTag } from "../utils/suggestTag";

type Props = {
  parking: Parking;
};

const ParkingMessage: VFC<Props> = ({ parking }) => {
  const tag = suggestTag(new Date(), parking);
  const message = suggestMessage(new Date(), parking);

  return (
    <Box boxShadow="xs" py={3} px={5}>
      <Tag size="sm" bgColor={tag.color} fontWeight="bold" color="white" mb={1}>
        {tag.label}
      </Tag>
      <Text color="black" fontSize="sm">
        {message}
      </Text>
    </Box>
  );
};

export default ParkingMessage;
