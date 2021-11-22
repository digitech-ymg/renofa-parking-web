import { Parking } from "@/types/Parking";
import { Box, Tag, Text } from "@chakra-ui/react";
import { VFC } from "react";
import { parkingState, State, parkingFillDate } from "../utils/parking";

type Props = {
  parking: Parking;
};

const ParkingMessage: VFC<Props> = ({ parking }) => {
  const [state, percent] = parkingState(new Date(), parking);
  let tagColor: string = "";
  let tagLabel: string = "";
  let messages: string[] = [];
  switch (state) {
    case State.Disable:
      tagColor = "black";
      tagLabel = "未開放";
      messages.push("開放していません。");
      break;
    case State.BeforeOpen:
      tagColor = "blue.300";
      tagLabel = "開場前";
      messages.push("開場前です。", `${new Date(parking.openAt).getHours()}時に開場します。`);
      break;
    case State.Opened:
      tagColor = "teal.500";
      tagLabel = "開場中";
      messages.push(`現在、${percent}%が埋まっています。`);
      const fillDate = parkingFillDate(parking);
      if (fillDate) {
        messages.push(`${fillDate?.getHours()}時${fillDate?.getMinutes()}分に満車になりそうです。`);
      }
      break;
    case State.Filled:
      tagColor = "red.500";
      tagLabel = "満車";
      messages.push("既に満車です。", "他の駐車場をご検討ください。");
      break;
    case State.AfterClosed:
      tagColor = "purple.700";
      tagLabel = "閉場";
      messages.push("閉場しました。");
      break;
    default:
      break;
  }

  return (
    <Box boxShadow="xs" py={3} px={5}>
      <Tag size="sm" bgColor={tagColor} fontWeight="bold" color="white" mb={1}>
        {tagLabel}
      </Tag>
      {messages.map((message, index) => (
        <Text key={index} color="black" fontSize="sm">
          {message}
        </Text>
      ))}
    </Box>
  );
};

export default ParkingMessage;
