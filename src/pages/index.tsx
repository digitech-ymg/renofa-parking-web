import type { NextPage } from "next";
import { Center, Square, Circle } from "@chakra-ui/react";
import { Container, Box, Link } from "@chakra-ui/react";
import SiteDescription from "@/components/SiteDescription";
import ParkingList from "@/components/ParkingList";

const Top: NextPage = () => {
  return (
    <Container h="100vh" bgColor="white">
      <Box pt={5} mb={5}>
        <Link href="/about">
          <SiteDescription />
        </Link>
      </Box>
      <ParkingList />
    </Container>
  );
};

export default Top;
