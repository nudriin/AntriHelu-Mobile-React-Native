import React, { useEffect, useState } from "react"
import {
    Text,
    TextInput,
    View,
    ActivityIndicator,
    TouchableOpacity,
    Image,
} from "react-native"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../types"
import config from "../config"
import image from "../constants/image"

const formSchema = z.object({
    email: z.string().email({ message: "Email tidak valid" }).min(1),
    password: z.string().min(4, { message: "Password minimal 4 karakter" }),
})

type FormSchemaType = z.infer<typeof formSchema>

type LoginScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    "LoginScreen"
>

interface LoginScreenProps {
    navigation: LoginScreenNavigationProp
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const [loading, setLoading] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

    const checkLoginStatus = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken")
            setIsLoggedIn(!!token)

            if (token) {
                navigation.navigate("AddQueueScreen")
            }
        } catch (error) {
            console.error("Error checking login status:", error)
            setIsLoggedIn(false)
        }
    }

    useEffect(() => {
        checkLoginStatus()
    }, [])

    const handleLogin = async (data: FormSchemaType) => {
        setLoading(true)
        try {
            const response = await fetch(
                `${config.API_BASE_URL}/api/users/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                }
            )

            const responseBody = await response.json()

            if (responseBody.data) {
                await AsyncStorage.setItem("authToken", responseBody.data.token)
                navigation.navigate("AddQueueScreen") // This will now have proper type checking
            } else {
                alert("Login gagal, periksa email/password Anda!")
            }
        } catch (error) {
            console.error(error)
            alert("Something went wrong, please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <View className="items-center justify-center w-full h-full p-6">
            <Text className="mb-4 text-3xl font-bold text-center text-blck">
                Selamat Datang di Dinas Pendidikan Kota Palangka Raya
            </Text>
            <Image
                source={image.disdikLogo}
                className="w-[100px] h-[130px] mb-4"
            />
            <Text className="mb-4 text-center font-poppinsR text-lightGrey">
                Mohon inputkan data anda dengan benar
            </Text>
            <View className="w-full">
                <Text className="mb-1 text-lg font-bold">Email</Text>
                <Controller
                    name="email"
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            className="p-4 mb-4 border rounded-lg"
                            placeholder="Email"
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                />
            </View>

            <View className="w-full">
                <Text className="mb-1 text-lg font-bold">Password</Text>
                <Controller
                    name="password"
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            className="p-4 mb-4 border rounded-lg"
                            placeholder="Password"
                            secureTextEntry
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <View className="w-full">
                    <TouchableOpacity
                        className="p-3 rounded-lg bg-blues"
                        onPress={form.handleSubmit(handleLogin)}
                        disabled={form.formState.isSubmitting}
                    >
                        <Text className="text-xl text-center text-white font-poppinsR">
                            Login
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}
