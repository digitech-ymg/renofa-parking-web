import type { VFC } from "react";
import { Container, Box, HStack, Text, Link } from "@chakra-ui/react";

import Renofa from "public/renofa.svg";

const Header: VFC = () => {
  return (
    <Box bg="gray.100" color="black">
      <Container alignItems="center">
        <HStack color="black" h="4.5rem" my-auto="true">
          <Link href="/">
            <HStack gap="2">
              <Renofa widht={30} height={40} />
              <Text size="sm" fontWeight="bold">
                駐車場情報サイト
              </Text>
            </HStack>
          </Link>
        </HStack>
      </Container>
    </Box>
  );
};

export default Header;
