import type { VFC } from "react";
import { Center, Heading, Link } from "@chakra-ui/react";

import Renofa from "public/renofa.svg";

const Header: VFC = () => {
  return (
    <Link href="/">
      <Center bg="gray.100" h="4.5rem" color="black">
        <Renofa widht={30} height={40} />
        <Heading as="h5" size="sm" pl="3">
          駐車場情報サイト
        </Heading>
      </Center>
    </Link>
  );
};

export default Header;
