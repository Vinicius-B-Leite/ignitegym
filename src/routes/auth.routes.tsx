import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import SingIn from '@screens/SingIn';
import SingUp from '@screens/SingUp';
import React from 'react';


type AuthRoutes = {
    SingIn: undefined,
    SingUp: undefined,
}

export type AuthNavitorRoutesProps = NativeStackNavigationProp<AuthRoutes>

const Stack = createNativeStackNavigator<AuthRoutes>()

const AuthRoutes: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='SingIn' component={SingIn} />
            <Stack.Screen name='SingUp' component={SingUp} />
        </Stack.Navigator>
    )
}

export default AuthRoutes;