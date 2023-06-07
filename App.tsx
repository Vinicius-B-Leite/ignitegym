import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { NativeBaseProvider, Box } from 'native-base';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { theme } from '@theme';
import SingIn from '@screens/SingIn';
import SingUp from '@screens/SingUp';
import Routes from '@routes/index';
import { AuthContextProvider } from '@contexts/AuthContext';

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  if (!fontsLoaded) return


  return (
    <NativeBaseProvider theme={theme}>

      <AuthContextProvider>
        <Routes />
      </AuthContextProvider>

    </NativeBaseProvider>
  );
}
