import { useRef, useState } from 'react'
import { Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, View } from 'react-native'

import { CUSTOMER_STORIES } from '@/constants/staticContent'

const STORY_CARD_WIDTH = 280
const STORY_CARD_GAP = 16
const STORY_SNAP_INTERVAL = STORY_CARD_WIDTH + STORY_CARD_GAP

export function CustomerStorySection() {
  const scrollRef = useRef<ScrollView>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  function handleMomentumEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const lastIndex = CUSTOMER_STORIES.length - 1
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / STORY_SNAP_INTERVAL)

    if (activeIndex === lastIndex && nextIndex >= lastIndex) {
      scrollRef.current?.scrollTo({ x: 0, animated: true })
      setActiveIndex(0)
      return
    }

    setActiveIndex(Math.min(nextIndex, lastIndex))
  }

  return (
    <View className='gap-6 py-8'>
      <View>
        <Text className='mb-2 font-sans-bold text-[9px] uppercase tracking-[0.2em] text-ring-accent'>
          {CUSTOMER_STORIES[0].eyebrow}
        </Text>
        <Text className='font-serif text-3xl text-ring-primary'>Voices of Connection</Text>
        <View className='mt-4 h-[1px] w-12 bg-ring-accent/40' />
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate='fast'
        snapToInterval={STORY_SNAP_INTERVAL}
        snapToAlignment='start'
        onMomentumScrollEnd={handleMomentumEnd}
        scrollEventThrottle={16}
        className='-mr-5 overflow-visible'
        contentContainerClassName='gap-4 pr-10'
      >
        {CUSTOMER_STORIES.map((story) => (
          <View
            key={story.customerName}
            className='w-[280px] overflow-hidden rounded-[24px] border-[0.5px] border-ring-primary/5 bg-ring-surface shadow-sm shadow-black/5 elevation-2'
          >
            <View className='aspect-[16/9] w-full'>
              <Image source={{ uri: story.imageUrl }} className='h-full w-full' resizeMode='cover' />
            </View>

            <View className='h-[220px] gap-5 p-7'>
              <Text className='flex-1 font-serif text-[17px] italic leading-7 text-ring-primary opacity-90'>
                {`"${story.quote}"`}
              </Text>

              <View className='h-[0.5px] w-10 bg-ring-accent/30' />

              <View className='flex-row items-center justify-between'>
                <View className='flex-1'>
                  <Text className='font-sans-bold text-[11px] uppercase tracking-widest text-ring-primary'>
                    {story.customerName}
                  </Text>
                  <Text className='mt-0.5 font-sans text-[9px] uppercase tracking-wider text-txt-muted'>
                    {story.customerMeta}
                  </Text>
                </View>

                <View className='items-end rounded-full bg-ring-background px-3 py-1.5'>
                  <Text className='font-serif text-[14px] text-ring-accent'>{story.statValue}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View className='mt-1 flex-row justify-center gap-2'>
        {CUSTOMER_STORIES.map((story, index) => (
          <View
            key={`${story.customerName}-dot`}
            className={`h-1.5 rounded-full ${index === activeIndex ? 'w-6 bg-ring-accent' : 'w-1.5 bg-ring-accent/30'}`}
          />
        ))}
      </View>
    </View>
  )
}
