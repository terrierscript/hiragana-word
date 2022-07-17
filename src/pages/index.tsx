import { Box, Button, Center, Heading, Textarea, VStack } from "@chakra-ui/react"
import { useState } from "react"

export default function Home() {
  const [value, setValue] = useState("")
  return <Center p={4}>
    <VStack>
      <Heading size="md">ひらがなよみあげ</Heading>
      <Textarea value={value} onChange={(e) => {
        setValue(e.target.value)
      }} placeholder="1行ずつ入力" />
      <Button as="a" href={`/words/${value.split("\n").join(",")}`}
        colorScheme="orange">つくる</Button>
    </VStack>
  </Center>
}