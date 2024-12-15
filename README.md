# AntriHelu

AntriHelu is a mobile queue management application built with React Native and Expo. This app utilizes a backend system to manage queue data in real-time using Socket.IO and REST API.

---

## **Key Features**
1. **Login and Logout**
   - Supports user authentication using tokens.
2. **Add Queue**
   - Users can add a new queue for a specific counter.
3. **Real-Time Updates**
   - Queue data is updated in real-time through Socket.IO integration.
4. **Counter Management**
   - Displays counter information and the total number of queues.

---

## **Technologies Used**
- **Frontend**: React Native, Expo
- **Backend**: NestJS (using REST API and Socket.IO)
- **State Management**: React Hooks
- **Storage**: AsyncStorage

---

## **Installation and Running the Application**

### **Prerequisites**
Make sure you have installed:
- Node.js (latest version)
- Expo CLI
- Android/iOS Emulator or a physical device

### **Installation Steps**
1. Clone this repository:
   ```bash
   git clone https://github.com/nudriin/AntriHelu-Mobile-React-Native
   cd AntriHelu-Mobile-React-Native
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the application:
   ```bash
   expo start
   ```
4. Open the application using Expo Go on a physical device or emulator.

---

## **Project Structure**
```
AntriHelu/
|-- assets/               # Static files (icons, splash screens, etc.)
|-- screens/              # All screen files (LoginScreen, AddQueueScreen, etc.)
|-- helper/               # Utility functions like getLocketCodeFromName
|-- model/                # Models for queue and counter data
|-- socket/               # Socket.IO configuration
|-- App.tsx               # Application entry point
|-- global.css            # Global styles
|-- package.json          # Project configuration and dependencies
```

---

## **API Proxy Configuration**
To configure the API proxy, add the configuration in the `app.json` file as follows:

```json
{
  "expo": {
    "extra": {
      "proxy": {
        "/api": "https://your-api.com"
      }
    }
  }
}
```
Then, use this proxy in the application:
```javascript
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig?.extra?.proxy?.["/api"];
```

---

## **Key Functions in the Code**

### **LoginScreen**
- Handles user authentication.
- Stores authentication tokens in AsyncStorage.

### **AddQueueScreen**
- Displays counter and queue information.
- Adds a new queue for a specific counter.
- Utilizes Socket.IO for real-time data updates.

### **Managing Login Status**
- Login status is stored in AsyncStorage.
- The login status determines which screen is displayed ("LoginScreen" or "AddQueueScreen").

---

## **How Logout and Back Navigation Work**
1. **Prevent Returning to Login After Login**:
   - Use the `isLoggedIn` condition to determine whether the user is directed to the login screen or the main screen.
2. **Adding Logout Functionality**:
   - Remove the token from AsyncStorage.
   - Redirect back to the login screen.

### **Example Logout Implementation**:
```javascript
const handleLogout = async () => {
    await AsyncStorage.removeItem("authToken");
    setIsLoggedIn(false);
};
```

---

## **Notes**
- Ensure the backend is running properly for the app to function fully.
- Make sure you have configured the backend URL in the proxy file in `app.json`.


