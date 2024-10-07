import Carousel, { CarouselProps, Pagination } from 'react-native-snap-carousel'
import { View } from 'app/design/core'
import React, { useState, useEffect } from 'react'

export const PaginatedCarousel = <T,>({
  data,
  renderItem,
  ...props
}: Omit<CarouselProps<T>, 'onSnapToItem'>) => {
  const [activeItemIndex, setActiveItemIndex] = useState(0)

  useEffect(() => {
    if (activeItemIndex >= data.length) {
      setActiveItemIndex(data.length - 1)
    }
  }, [data.length])

  return (
    <View className="relative">
      <Carousel
        data={data}
        renderItem={renderItem}
        inactiveSlideScale={1}
        containerCustomStyle={{ backgroundColor: 'black' }}
        onSnapToItem={(index) => setActiveItemIndex(index)}
        {...props}
      />
      <View className="absolute bottom-0 flex w-full items-center justify-center">
        <Pagination
          dotsLength={data.length}
          activeDotIndex={activeItemIndex}
          animatedFriction={20}
          inactiveDotScale={0.8}
          dotContainerStyle={{
            marginHorizontal: 2,
          }}
          dotStyle={{
            width: 8,
            height: 8,
            borderRadius: 9999,
            backgroundColor: 'white',
          }}
        />
      </View>
    </View>
  )
}
