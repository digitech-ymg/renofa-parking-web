import type { NextPage } from "next";
import { Center, Square, Circle } from "@chakra-ui/react";
import { Container, Box, Link } from "@chakra-ui/react";
import SiteDescription from "@/components/SiteDescription";
import ParkingList from "@/components/ParkingList";
import RenofaBanner from "@/components/RenofaBanner";

const Top: NextPage = () => {
  return (
    <Container bgColor="white">
      <Box pt={5} mb={5}>
        <Link href="/about">
          <SiteDescription />
        </Link>
      </Box>
      <Box mb={5}>
        <ParkingList />
      </Box>
      <Box pt={5} mb={5}>
        <Link href="https://www.renofa.com/" isExternal>
          <RenofaBanner />
        </Link>
      </Box>
    </Container>
  );
};

export default Top;
