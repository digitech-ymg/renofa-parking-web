import type { NextPage } from "next";
import { Container, Box, Link } from "@chakra-ui/react";
import SiteDescription from "@/components/SiteDescription";
import ParkingList from "@/components/ParkingList";
import RenofaBanner from "@/components/RenofaBanner";
import Game from "@/components/Game";

const Top: NextPage = () => {
  return (
    <Container bgColor="white">
      <Box mt={5} mb={5}>
        <Link href="/about">
          <SiteDescription />
        </Link>
      </Box>
      <Box mb={5}>
        <Game />
      </Box>
      <Box mb={5}>
        <ParkingList />
      </Box>
      <Box mt={5} mb={5}>
        <Link href="https://www.renofa.com/" isExternal>
          <RenofaBanner />
        </Link>
      </Box>
    </Container>
  );
};

export default Top;
