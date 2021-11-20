import { Parking } from "@/types/Parking";
import { Box, Tag, Text } from "@chakra-ui/react";
import { VFC } from "react";

type Props = {
  parking: Parking;
};

const ParkingMessage: VFC<Props> = ({ parking }) => {
  const suggestMessage = (now: Date, parking: Parking) => {
    const parkingOpenTime = new Date(parking.openAt);
    const parkingCloseTime = new Date(parking.closeAt);

    if (now.getTime() < parkingOpenTime.getTime()) {
      // 開場前
      return `開場前です。\n${parkingOpenTime.getHours()}時に開場します。`;
    } else if (now.getTime() > parkingCloseTime.getTime()) {
      // 閉場後
      return "閉場しました。";
    } else {
      return "開場中";
    }
  };

  return (
    <Box boxShadow="xs" py={3} px={5}>
      <Tag size="sm" bgColor="blue.300" fontWeight="bold" color="white" mb={1}>
        開場前
      </Tag>
      <Text color="black" fontSize="sm">
        {suggestMessage(new Date(), parking)}
      </Text>
    </Box>
  );
};

export default ParkingMessage;
