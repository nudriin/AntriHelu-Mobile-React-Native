// types.ts (you can create this file)
import { StackNavigationProp } from "@react-navigation/stack"
import AddQueueScreen from "./screens/AddQueueScreen"
import LoginScreen from "./screens/LoginScreen"

// Define your stack navigator's screen names and types
export type RootStackParamList = {
    LoginScreen: undefined // Assuming LoginScreen doesn't have params
    AddQueueScreen: undefined // Assuming HomeScreen doesn't have params
}
