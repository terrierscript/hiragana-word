import { Box, Button, ButtonProps, Flex, Grid, HStack, Spinner, Stack, VStack } from '@chakra-ui/react'
import Head from 'next/head'
import React, { FC, useState } from 'react'
// @ts-ignore
import hepburn from "hepburn"
import { useRouter } from 'next/router'
import { z } from 'zod'

const speech = (word: string,
  events?: {
    [key in keyof SpeechSynthesisUtteranceEventMap]?: (event: SpeechSynthesisEvent) => void
  }
  // onBoundary?: (event: SpeechSynthesisEvent) => void
): Promise<void> => {
  return new Promise((res, rej) => {

    const synth = window.speechSynthesis
    // const voice = synth.getVoices()
    const utterThis = new SpeechSynthesisUtterance(`${word}`)
    utterThis.pitch = 2
    utterThis.rate = 1
    Object.entries(events ?? {}).map(([key, value]) => {
      console.log(key)
      // @ts-ignore
      utterThis.addEventListener(key, value)
    })
    utterThis.addEventListener("end", () => {
      res()
    })
    synth.speak(utterThis)
  })

}

const LargeButton: FC<ButtonProps> = (props) => {
  return <Button
    // w={"10px"}
    maxH={"8vmin"}
    fontSize="8vmin"
    p={8}
    {...props} />
}
const Tite: FC<{ char: string, isActive: boolean }> = ({ char, isActive }) => {
  const [click, setClick] = useState(false)
  const press = () => {
    setClick(true)
    speech(char).then(r => {
      setClick(false)
    })
  }
  return <LargeButton
    colorScheme={(isActive || click) ? "red" : "blue"}
    onClick={() => press()}
  >
    {char}
  </LargeButton>
}



const Words: FC<{
  word: string
}> = ({ word }) => {
  const [activeIndex, setActiveIndex] = useState(-1)
  const splitted: string[] = hepburn.splitKana(word)
  return <Grid
    maxW="100%"
    border="1px solid"
    borderRadius={"lg"}
    borderColor="gray.200"
    p={2}
    gap={2}
    gridAutoFlow="column"
  >
    <LargeButton size="lg" onClick={async () => {
      // const splitWord = word.split("")
      for (let char of splitted) {
        setActiveIndex((value) => value + 1)
        await speech(char)
      }
      setActiveIndex(-1)
    }}>📣</LargeButton>
    <Grid
      gridTemplateColumns={`repeat(4, 1fr)`}
      gap={1}
    >
      {splitted.map((char, i) => {
        return <Tite char={char} key={i} isActive={i === activeIndex} />
      })}
    </Grid>
  </Grid>
}

const param = z.object({
  words: z.string()
})
export default function Home() {
  const router = useRouter()
  if (!router.isReady) {
    return <Spinner />
  }
  const { words } = param.parse(router.query)
  return (
    <Box>
      <Head>
        <title></title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack p={2} userSelect="none">
        {words.split(",").map((word, i) => {
          return <Words word={word} key={i} />
        })}
      </Stack>
    </Box>
  )
}
