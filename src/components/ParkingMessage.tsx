import { Parking } from "@/types/Parking";
import { Predict } from "@/types/Predict";
import { Box, Tag, Text } from "@chakra-ui/react";
import { VFC } from "react";

type Props = {
  parking: Parking;
};

const ParkingMessage: VFC<Props> = ({ parking }) => {
  const suggestMessage = (now: Date, parking: Parking): string => {
    const parkingOpenTime = new Date(parking.openAt);
    const parkingCloseTime = new Date(parking.closeAt);

    if (now.getTime() < parkingOpenTime.getTime()) {
      // 開場前
      return `開場前です。\n${parkingOpenTime.getHours()}時に開場します。`;
    } else if (now.getTime() > parkingCloseTime.getTime()) {
      // 閉場後
      return "閉場しました。";
    } else {
      if (parking.status === "full") {
        // 満車時
        return "既に満車です。\n他の駐車場をご検討ください。";
      } else {
        // 現状の埋まり具合と予測
        const fullTime = new Date(parking.predicts.slice(-1)[0].at);
        const fullHour = fullTime.getHours();
        const fullMinute = fullTime.getMinutes();
        const percent = predictPercentage(now, parking.predicts);
        return `現在、${percent}%が埋まっています。\n${fullHour}時${fullMinute}分に満車になりそうです。`;
      }
    }
  };

  const predictPercentage = (now: Date, predicts: Predict[]): number => {
    let predictPercent: number = 0;

    for (let i = 0; i < predicts.length; i++) {
      const predictDate = new Date(predicts[i].at);
      if (now.getTime() < predictDate.getTime()) {
        predictPercent = predicts[i].ratio * 100;
        break;
      }
    }

    return predictPercent;
  };

  const suggestTagLabel = (now: Date, parking: Parking): string => {
    const parkingOpenTime = new Date(parking.openAt);
    const parkingCloseTime = new Date(parking.closeAt);

    if (now.getTime() < parkingOpenTime.getTime()) {
      return "開場前";
    } else if (now.getTime() > parkingCloseTime.getTime()) {
      return "閉場";
    } else {
      if (parking.status === "full") {
        return "満車";
      } else {
        return "空きあり";
      }
    }
  };

  const suggestTagColor = (now: Date, parking: Parking) => {
    const parkingOpenTime = new Date(parking.openAt);
    const parkingCloseTime = new Date(parking.closeAt);

    if (now.getTime() < parkingOpenTime.getTime()) {
      return "blue.300";
    } else if (now.getTime() > parkingCloseTime.getTime()) {
      return "red.500";
    } else {
      if (parking.status === "full") {
        return "red.500";
      } else {
        return "teal.500";
      }
    }
  };

  return (
    <Box boxShadow="xs" py={3} px={5}>
      <Tag
        size="sm"
        bgColor={suggestTagColor(new Date(), parking)}
        fontWeight="bold"
        color="white"
        mb={1}
      >
        {suggestTagLabel(new Date(), parking)}
      </Tag>
      <Text color="black" fontSize="sm">
        {suggestMessage(new Date(), parking)}
      </Text>
    </Box>
  );
};

export default ParkingMessage;
