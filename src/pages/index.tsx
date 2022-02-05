import type { NextPage } from "next";
import { Container, Box, Link } from "@chakra-ui/react";
import SiteDescription from "@/components/SiteDescription";
import ParkingList from "@/components/ParkingList";
import RenofaBanner from "@/components/RenofaBanner";
import Game from "@/components/Game";

const Top: NextPage = () => {
  return (
    <Container bgColor="white">
      <Box mt={4} mb={4}>
        <Link href="/about">
          <SiteDescription />
        </Link>
      </Box>
      <Box bg="gray.100" p={4}>
        <Box experimental_spaceY={4}>
          <Game />
          <ParkingList />
        </Box>
      </Box>
      <Box mt={4} mb={4}>
        <Link href="https://www.renofa.com/" isExternal>
          <RenofaBanner />
        </Link>
      </Box>
    </Container>
  );
};

export default Top;
