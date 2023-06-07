import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Exercise from '@screens/Exercise';
import History from '@screens/History';
import Home from '@screens/Home';
import Profile from '@screens/Profile';
import React from 'react';
import HomeSVG from '@assets/home.svg'
import HistorySVG from '@assets/history.svg'
import ProfileSVG from '@assets/profile.svg'
import { useTheme } from 'native-base';
import { Platform } from 'react-native';

type AppRoutes = {
    Home: undefined
    History: undefined
    Exercise: { exerciseID: string }
    Profile: undefined
}
export type AppNavitorRoutesProp = BottomTabNavigationProp<AppRoutes>

const Tab = createBottomTabNavigator<AppRoutes>()
const AppRoutes: React.FC = () => {


    const { sizes, colors } = useTheme()
    const iconsSize = sizes[6]

    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarInactiveTintColor: colors.gray['200'],
            tabBarActiveTintColor: colors.green['500'],
            tabBarStyle: {
                backgroundColor: colors.gray['600'],
                borderTopWidth: 0,
                height: Platform.OS === 'android' ? 'auto' : 96,
                paddingBottom: sizes[10],
                paddingTop: sizes[6]
            }
        }}>
            <Tab.Screen
                name='Home'
                component={Home}
                options={{
                    tabBarIcon: ({ color }) => <HomeSVG fill={color} width={iconsSize} height={iconsSize} />
                }}
            />
            <Tab.Screen
                name='History'
                component={History}
                options={{
                    tabBarIcon: ({ color }) => <HistorySVG fill={color} width={iconsSize} height={iconsSize} />
                }}
            />
            <Tab.Screen
                name='Exercise'
                component={Exercise}
                options={{
                    tabBarButton: () => null
                }}
            />
            <Tab.Screen
                name='Profile'
                component={Profile}
                options={{
                    tabBarIcon: ({ color }) => <ProfileSVG fill={color} width={iconsSize} height={iconsSize} />
                }}
            />
        </Tab.Navigator>
    )
}

export default AppRoutes;