import { Check, ChevronDown, ChevronUp, Flame, X } from 'lucide-react-native'
import { useCallback, useEffect, useState } from 'react'
import { Keyboard, LayoutChangeEvent, Pressable, Text, TextInput, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

import { THEME } from '@/constants/theme'
import type { CollectionSortOption } from '@/types/collection.types'

type CollectionFilterBarProps = {
  isHotFiltered: boolean
  sortOption: CollectionSortOption
  priceRange: [number, number]
  onToggleHot: () => void
  onSortOptionChange: (value: CollectionSortOption) => void
  onPriceRangeChange: (range: [number, number]) => void
  isPriceDrawerOpen: boolean
  togglePriceDrawer: () => void
  isSortMenuOpen: boolean
  toggleSortMenu: () => void
}

const MIN_PRICE = 0
const MAX_PRICE = 50000000
const PRICE_STEP = 500000
const THUMB_SIZE = 16

const SORT_LABELS: Record<CollectionSortOption | 'all', string> = {
  all: 'All (Default)', // Mục All để reset sắp xếp
  featured: 'Latest Release',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low'
}

// Hàm tiện ích
function clamp(value: number, min: number, max: number) {
  'worklet'
  return Math.min(Math.max(value, min), max)
}

function formatCurrency(value: number) {
  return value.toLocaleString('vi-VN')
}

// --- COMPONENT THUMB HÌNH CHIẾC NHẪN ---
const RingThumb = () => (
  <View className='h-4 w-4 items-center rounded-full border-[1.5px] border-ring-accent bg-ring-background shadow-[0_0_4px_rgba(182,155,122,0.4)]'>
    {/* Viên đá (gem) nhỏ trên đỉnh nhẫn */}
    <View className='-mt-[2.5px] h-[4px] w-[4px] rounded-full bg-ring-accent' />
  </View>
)

export function CollectionFilterBar({
  isHotFiltered,
  sortOption,
  priceRange,
  onToggleHot,
  onSortOptionChange,
  onPriceRangeChange,
  isPriceDrawerOpen,
  togglePriceDrawer,
  isSortMenuOpen,
  toggleSortMenu
}: CollectionFilterBarProps) {
  const [trackWidth, setTrackWidth] = useState(0)

  // React State cho Input (Để user gõ số)
  const [minInputText, setMinInputText] = useState(formatCurrency(priceRange[0]))
  const [maxInputText, setMaxInputText] = useState(formatCurrency(priceRange[1]))

  // Reanimated Shared Values
  const minX = useSharedValue(0)
  const maxX = useSharedValue(0)
  const minStartX = useSharedValue(0)
  const maxStartX = useSharedValue(0)

  // Xác định xem có bộ lọc nào đang bật không
  const isFiltered =
    isHotFiltered || sortOption !== 'featured' || priceRange[0] > MIN_PRICE || priceRange[1] < MAX_PRICE

  // Hàm chuyển đổi Giá <-> Tọa độ X
  const priceToX = useCallback(
    (price: number) => {
      if (!trackWidth) return 0
      return ((price - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * trackWidth
    },
    [trackWidth]
  )

  const xToPrice = (x: number) => {
    'worklet'
    if (!trackWidth) return MIN_PRICE
    const ratio = x / trackWidth
    const rawPrice = MIN_PRICE + ratio * (MAX_PRICE - MIN_PRICE)
    return Math.round(rawPrice / PRICE_STEP) * PRICE_STEP
  }

  // Khởi tạo vị trí X
  useEffect(() => {
    if (trackWidth > 0) {
      minX.value = withTiming(priceToX(priceRange[0]), { duration: 200 })
      maxX.value = withTiming(priceToX(priceRange[1]), { duration: 200 })
      setMinInputText(formatCurrency(priceRange[0]))
      setMaxInputText(formatCurrency(priceRange[1]))
    }
  }, [priceRange, trackWidth, minX, maxX, priceToX])

  // --- Handlers Reset ---
  const handleResetPrice = () => {
    onPriceRangeChange([MIN_PRICE, MAX_PRICE])
  }

  const handleClearAll = () => {
    if (isHotFiltered) onToggleHot()
    onSortOptionChange('featured')
    onPriceRangeChange([MIN_PRICE, MAX_PRICE])
    if (isPriceDrawerOpen) togglePriceDrawer()
    if (isSortMenuOpen) toggleSortMenu()
  }

  // --- Handlers cho TextInput ---
  const handleInputSubmit = () => {
    Keyboard.dismiss()
    let newMin = parseInt(minInputText.replace(/\./g, ''), 10)
    let newMax = parseInt(maxInputText.replace(/\./g, ''), 10)

    if (isNaN(newMin)) newMin = MIN_PRICE
    if (isNaN(newMax)) newMax = MAX_PRICE

    newMin = clamp(newMin, MIN_PRICE, MAX_PRICE)
    newMax = clamp(newMax, MIN_PRICE, MAX_PRICE)
    if (newMin > newMax) newMin = newMax

    setMinInputText(formatCurrency(newMin))
    setMaxInputText(formatCurrency(newMax))
    onPriceRangeChange([newMin, newMax])
  }

  // --- Handlers cho Slider (Gesture) ---
  const handleSliderUpdateReactState = (isMin: boolean, newX: number) => {
    const newPrice = xToPrice(newX)
    if (isMin) setMinInputText(formatCurrency(newPrice))
    else setMaxInputText(formatCurrency(newPrice))
  }

  const handleSliderFinalize = () => {
    const finalMinPrice = xToPrice(minX.value)
    const finalMaxPrice = xToPrice(maxX.value)
    onPriceRangeChange([finalMinPrice, finalMaxPrice])
  }

  const minPan = Gesture.Pan()
    .onBegin(() => {
      minStartX.value = minX.value
    })
    .onUpdate((e) => {
      const nextX = clamp(minStartX.value + e.translationX, 0, maxX.value - THUMB_SIZE)
      minX.value = nextX
      runOnJS(handleSliderUpdateReactState)(true, nextX)
    })
    .onFinalize(() => {
      runOnJS(handleSliderFinalize)()
    })

  const maxPan = Gesture.Pan()
    .onBegin(() => {
      maxStartX.value = maxX.value
    })
    .onUpdate((e) => {
      const nextX = clamp(maxStartX.value + e.translationX, minX.value + THUMB_SIZE, trackWidth)
      maxX.value = nextX
      runOnJS(handleSliderUpdateReactState)(false, nextX)
    })
    .onFinalize(() => {
      runOnJS(handleSliderFinalize)()
    })

  // --- Animations Styles ---
  const drawerAnimatedStyle = useAnimatedStyle(() => ({
    height: withTiming(isPriceDrawerOpen ? 150 : 0, { duration: 300 }),
    opacity: withTiming(isPriceDrawerOpen ? 1 : 0, { duration: 250 })
  }))

  const activeTrackStyle = useAnimatedStyle(() => ({
    left: minX.value,
    width: Math.max(maxX.value - minX.value, 0)
  }))

  const minThumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: minX.value - THUMB_SIZE / 2 }] }))
  const maxThumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: maxX.value - THUMB_SIZE / 2 }] }))

  return (
    <View className='relative z-40 bg-transparent'>
      {/* --- STICKY UTILITY BAR --- */}
      <View className='flex-row items-center justify-between px-8 py-4'>
        <View className='flex-row items-center gap-6'>
          {/* Nút Sort */}
          <Pressable onPress={toggleSortMenu} className='flex-row items-center gap-1.5 py-2'>
            <Text
              allowFontScaling={false}
              className={`font-sans text-[13px] ${isSortMenuOpen ? 'font-sans-bold text-ring-accent' : 'text-ring-primary'}`}
            >
              Sort
            </Text>
            {isSortMenuOpen ? (
              <ChevronUp size={14} color={THEME.ringAccent} />
            ) : (
              <ChevronDown size={14} color={THEME.ringPrimary} />
            )}
          </Pressable>

          {/* Nút Price */}
          <Pressable onPress={togglePriceDrawer} className='flex-row items-center gap-1.5 py-2'>
            <Text
              allowFontScaling={false}
              className={`font-sans text-[13px] ${isPriceDrawerOpen || priceRange[0] > MIN_PRICE || priceRange[1] < MAX_PRICE ? 'font-sans-bold text-ring-accent' : 'text-ring-primary'}`}
            >
              Price
            </Text>
            {isPriceDrawerOpen ? (
              <ChevronUp size={14} color={THEME.ringAccent} />
            ) : (
              <ChevronDown size={14} color={THEME.ringPrimary} />
            )}
          </Pressable>

          {/* Nút Trending */}
          <Pressable
            onPress={onToggleHot}
            className='flex-row items-center gap-1.5 py-2'
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Flame
              color={isHotFiltered ? THEME.ringAccent : THEME.textMuted}
              size={15}
              strokeWidth={isHotFiltered ? 2 : 1.5}
            />
            <Text
              allowFontScaling={false}
              className={`font-sans text-[12px] tracking-wide ${isHotFiltered ? 'font-sans-bold text-ring-accent' : 'text-textMuted'}`}
            >
              Trending
            </Text>
          </Pressable>
        </View>

        {/* Nút Xóa tất cả bộ lọc (Clear All) */}
        {isFiltered && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Pressable
              onPress={handleClearAll}
              className='h-6 w-6 items-center justify-center rounded-full bg-ring-accent/10'
            >
              <X size={12} color={THEME.ringAccent} />
            </Pressable>
          </Animated.View>
        )}
      </View>

      {/* --- FLOATING SORT MENU --- */}
      {isSortMenuOpen && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          className='absolute left-6 top-[60px] z-50 w-[220px] rounded-2xl border border-ring-accent/10 bg-white py-2 shadow-[0_12px_40px_rgba(0,0,0,0.12)]'
        >
          {(['featured', 'price-asc', 'price-desc'] as CollectionSortOption[]).map((option, index) => {
            const isActive = sortOption === option
            return (
              <Pressable
                key={option}
                onPress={() => {
                  onSortOptionChange(option)
                  toggleSortMenu()
                }}
                className={`flex-row items-center justify-between px-5 py-3.5 ${index !== 2 ? 'border-b border-ring-accent/5' : ''}`}
              >
                <Text
                  allowFontScaling={false}
                  className={`font-sans text-[14px] ${isActive ? 'font-sans-bold text-ring-accent' : 'text-ring-primary/80'}`}
                >
                  {SORT_LABELS[option]}
                </Text>
                {isActive && <Check size={14} color={THEME.ringAccent} />}
              </Pressable>
            )
          })}
        </Animated.View>
      )}

      {/* --- PRICE DRAWER (Ngăn kéo Giá) --- */}
      <Animated.View style={drawerAnimatedStyle} className='overflow-hidden bg-transparent px-8'>
        <View className='h-full justify-between pb-6 pt-5'>
          {/* Header Ngăn kéo: Tựa đề & Nút Reset */}
          <View className='mb-2 flex-row items-center justify-between'>
            <Text
              allowFontScaling={false}
              className='font-sans-bold text-[10px] uppercase tracking-widest text-ring-accent'
            >
              Price Range
            </Text>
            <Pressable onPress={handleResetPrice}>
              <Text allowFontScaling={false} className='font-sans text-[11px] text-txt-muted underline'>
                All Prices
              </Text>
            </Pressable>
          </View>

          {/* Ô Nhập số (Input Fields) */}
          <View className='flex-row items-center justify-between'>
            <View className='flex-1 border-b border-ring-accent/20 pb-1'>
              <View className='flex-row items-center'>
                <TextInput
                  value={minInputText}
                  onChangeText={setMinInputText}
                  onBlur={handleInputSubmit}
                  keyboardType='numeric'
                  returnKeyType='done'
                  allowFontScaling={false}
                  className='font-serif m-0 w-24 p-0 text-[15px] tracking-wider text-ring-primary'
                />
                <Text allowFontScaling={false} className='ml-1 font-sans text-[15px] text-ring-primary/50'>
                  đ
                </Text>
              </View>
            </View>

            <View className='mx-4 mt-2 h-[1px] w-4 bg-ring-primary/20' />

            <View className='flex-1 items-end border-b border-ring-accent/20 pb-1'>
              <View className='flex-row items-center'>
                <TextInput
                  value={maxInputText}
                  onChangeText={setMaxInputText}
                  onBlur={handleInputSubmit}
                  keyboardType='numeric'
                  returnKeyType='done'
                  allowFontScaling={false}
                  textAlign='right'
                  className='font-serif m-0 w-24 p-0 text-[15px] tracking-wider text-ring-primary'
                />
                <Text allowFontScaling={false} className='ml-1 font-sans text-[15px] text-ring-primary/50'>
                  đ
                </Text>
              </View>
            </View>
          </View>

          {/* Giao diện Slider */}
          <View
            className='relative h-[40px] justify-end pb-[6px]'
            onLayout={(e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width)}
          >
            {/* Track Background */}
            <View className='absolute bottom-[10px] h-[1px] w-full bg-ring-accent/20' />

            {/* Track Active */}
            <Animated.View
              style={activeTrackStyle}
              className='absolute bottom-[10px] h-[1px] bg-ring-accent shadow-[0_0_6px_rgba(182,155,122,0.8)]'
            />

            {/* Min Thumb (Ring Shape) */}
            <GestureDetector gesture={minPan}>
              <Animated.View
                style={minThumbStyle}
                className='absolute bottom-[2px] h-8 w-8 items-center justify-center bg-transparent'
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              >
                <RingThumb />
              </Animated.View>
            </GestureDetector>

            {/* Max Thumb (Ring Shape) */}
            <GestureDetector gesture={maxPan}>
              <Animated.View
                style={maxThumbStyle}
                className='absolute bottom-[2px] h-8 w-8 items-center justify-center bg-transparent'
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              >
                <RingThumb />
              </Animated.View>
            </GestureDetector>
          </View>
        </View>
      </Animated.View>
    </View>
  )
}
