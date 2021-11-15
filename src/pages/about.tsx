import type { NextPage } from "next";
import {
  Container,
  Box,
  Heading,
  Text,
  Image,
  Center,
  Link,
  Flex,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const About: NextPage = () => {
  return (
    <Container my={8}>
      <Heading as="h1" fontSize="xl" my={4}>
        このサイトについて
      </Heading>
      <Box my={4}>
        <Text fontSize="sm">
          当サイトは、デジタル技術を活用して地域課題の解決等に取り組む会員制組織「デジテックfor
          YAMAGUCHI」の共創プロジェクトの1つです。個人会員による活動として初の試みとなっています。
        </Text>
      </Box>
      <Box my={4}>
        <Flex flexDirection="column">
          <Center>
            <Image
              width="50%"
              objectFit="cover"
              src="/img/about-digitech-card.png"
              alt="デジテックのカード画像"
            />
            <Link mt={1} fontSize="xs" href="https://digitech-ymg.org/project" isExternal>
              デジテックのプロジェクトページ <ExternalLinkIcon mx="2px" />
            </Link>
          </Center>
        </Flex>
      </Box>
      <Box my={4}>
        <Text fontSize="sm">
          レノファ山口FCのホームスタジアムにご来場されるサポーターの皆さまに、試合当日の駐車場情報をわかりやすく伝えることで、スムーズなご来場や渋滞緩和、主催側の効率的な運営に資することを目的としています。
          当サイトのプログラムをはじめ、開発の情報を全て公開しています。
        </Text>
        <Link
          mt={1}
          fontSize="xs"
          href="https://github.com/digitech-ymg/renofa-parking-web"
          isExternal
        >
          https://github.com/digitech-ymg/renofa-parking-web <ExternalLinkIcon mx="2px" />
        </Link>
      </Box>
      <Box my={4}>
        <Heading as="h2" fontSize="lg">
          ＜免責事項＞
        </Heading>
        <UnorderedList fontSize="sm">
          <ListItem>
            予告なしに内容やアドレスを変更または削除する場合がありますので、あらかじめご了承ください。
          </ListItem>
          <ListItem>
            当サイトの利用は、利用者ご自身の責任において行われるものとします。当サイト上の掲載情報については、慎重に作成、管理しますが、すべての情報の正確性および完全性を保証するものではありません。あらかじめご了承ください。
          </ListItem>
          <ListItem>
            当サイトから入手された情報により発生した問題・損害に対して、当サイトの開発・運営者はいかなる責任も負いません。
          </ListItem>
        </UnorderedList>
      </Box>
    </Container>
  );
};

export default About;
