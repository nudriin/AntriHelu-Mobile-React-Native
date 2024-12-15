import Constants from "expo-constants"

const API_BASE_URL = Constants.expoConfig?.extra?.proxy?.["/api"]

if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined in app.json!")
}

export default {
    API_BASE_URL,
}
