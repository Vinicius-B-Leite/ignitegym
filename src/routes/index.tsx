import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import AuthRoutes from './auth.routes';
import { Box, useTheme } from 'native-base';
import AppRoutes from './app.routes';
import { StatusBar } from 'react-native';
import { AuthContextProvider } from '@contexts/AuthContext';
import { useAuth } from '@hooks/useAuth';
import Loading from '@components/Loading';

const Routes: React.FC = () => {
    const { colors } = useTheme()
    const theme = DefaultTheme
    theme.colors.background = colors.gray['700']

    const { user, loadingUser } = useAuth()


    return (
        <Box flex={1} bg='gray.700'>
            <StatusBar backgroundColor={colors.gray['600']} barStyle='light-content' />
            {
                loadingUser ?
                    <Loading />
                    :
                    <NavigationContainer theme={theme}>
                        {
                            user.id ? <AppRoutes /> : <AuthRoutes />

                        }
                    </NavigationContainer>
            }


        </Box>
    )
}

export default Routes;