import type { VFC } from "react";
import {
  Container,
  Box,
  HStack,
  Text,
  Link,
  Spacer,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

import Renofa from "public/renofa.svg";
import { useAuthContext } from "@/context/AuthContext";
import { logout } from "@/lib/authentication";

const Header: VFC = () => {
  const user = useAuthContext();

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
          <Spacer />
          {user && (
            <Menu>
              <MenuButton>
                <Avatar src={user.photoURL} name={user.nickname} size="md" />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={logout}>ログアウト</MenuItem>
              </MenuList>
            </Menu>
          )}
        </HStack>
      </Container>
    </Box>
  );
};

export default Header;
