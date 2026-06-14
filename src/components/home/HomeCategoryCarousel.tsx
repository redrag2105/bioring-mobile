import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { CategoryType } from '@/types/home.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CARD_THEMES = [
  { bg: 'bg-ring-surface', border: 'border-ui-border/30', title: 'text-ring-primary', accent: 'text-ring-accent', subtext: 'text-txt-muted' },
  { bg: 'bg-ring-background', border: 'border-ring-accent/15', title: 'text-ring-primary', accent: 'text-ring-accent', subtext: 'text-txt-muted' },
];

function CategoryCard({ category, index }: { category: CategoryType; index: number }) {
  const theme = CARD_THEMES[index % CARD_THEMES.length];
  const pressed = useSharedValue(0);
  const borderRadius = 20;

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1 - pressed.value * 0.025, { damping: 20, stiffness: 200 }) }],
  }));

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: withTiming(pressed.value ? -4 : 0, { duration: 400, easing: Easing.out(Easing.exp) }) },
      { scale: withTiming(pressed.value ? 1.05 : 1, { duration: 400, easing: Easing.out(Easing.exp) }) },
      { rotate: `${interpolate(pressed.value, [0, 1], [0, -3])}deg` },
    ],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => (pressed.value = 1)}
      onPressOut={() => (pressed.value = 0)}
      style={[cardAnimatedStyle]}
    >
      <View style={{ borderRadius, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, backgroundColor: 'transparent' }}>
        <View className={`w-[156px] h-[220px] p-5 justify-between border-[0.5px] ${theme.bg} ${theme.border}`} style={{ borderRadius, overflow: 'hidden' }}>
          <View className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-ring-accent/5" />
          
          <View className="z-10">
            <View className="self-start border-b-[0.5px] border-ring-accent/30 pb-1 mb-2">
              <Text className={`text-[9px] tracking-[0.2em] uppercase font-sans-medium ${theme.accent}`}>Collection</Text>
            </View>
            <Text className={`text-xl leading-7 font-serif ${theme.title}`} numberOfLines={2}>{category.name}</Text>
          </View>

          <Animated.View style={[imageAnimatedStyle, { position: 'absolute', bottom: 55, right: 0, width: 100, height: 70 }]}>
            <Image source={{ uri: category.thumbnail_url }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
          </Animated.View>

          <View className="flex-row items-center justify-between z-10 mt-auto">
            <Text className={`text-[10px] tracking-wider uppercase font-sans-medium ${theme.subtext}`}>{category.productCount} Designs</Text>
            <Text className={`text-lg font-sans-light ${theme.accent}`}>→</Text>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

export function HomeCategoryCarousel({ categories }: { categories: CategoryType[] }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        // paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 16,
      }}
      decelerationRate='fast'
      snapToInterval={172}
      snapToAlignment='start'
    >
      {categories.map((category, index) => (
        <CategoryCard key={category.id} category={category} index={index} />
      ))}
    </ScrollView>
  )
}