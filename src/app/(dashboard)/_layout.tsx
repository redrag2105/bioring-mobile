import { CustomBottomTabBar } from '@/navigation/CustomBottomTabBar'
import { Tabs } from 'expo-router'

export default function DashboardLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomBottomTabBar {...props} />}
      detachInactiveScreens={false}
      screenOptions={{
        headerShown: false,
        animation: 'shift',
        lazy: true
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home'
        }}
      />
      <Tabs.Screen
        name='memory'
        options={{
          title: 'Memory'
        }}
      />
      <Tabs.Screen
        name='studio'
        options={{
          title: 'Studio'
        }}
      />
      <Tabs.Screen
        name='orders'
        options={{
          title: 'Orders'
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile'
        }}
      />
    </Tabs>
  )
}
