import { Box, Button, ButtonProps, HStack, VStack } from '@chakra-ui/react'
import Head from 'next/head'
import React, { FC, useState } from 'react'

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
  return <Button w={"8vmin"}
    h={"8vmin"}
    fontSize="8vmin"
    p={10}
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

const Words: FC<{ word: string }> = ({ word }) => {
  const [activeIndex, setActiveIndex] = useState(-1)
  return <HStack>
    <LargeButton size="lg" onClick={async () => {
      const splitWord = word.split("")
      // .map(c => `<p><mark name="${c}"/>${c}</p>　`)
      //   .join("、　")
      // console.log(splitWord)
      for (let char of splitWord) {
        setActiveIndex((value) => value + 1)
        await speech(char)
      }
      setActiveIndex(-1)
      // speech(splitWord, {
      //   boundary: (ev: SpeechSynthesisEvent) => {
      //     // setActiveIndex(ev)
      //     console.log("boundary", ev)
      //   },
      //   end: () => {
      //   }
      // })
    }}>📣</LargeButton>
    {
      word.split("").map((char, i) => {
        return <Tite char={char} key={i} isActive={i === activeIndex} />
      })
    }
  </HStack >
}

export default function Home() {
  return (
    <Box>
      <Head>
        <title></title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <VStack p={10}>
        <Words word="はやぶさ" />
        <Words word="こまち" />
        <Words word="つばさ" />
      </VStack>
    </Box>
  )
}
