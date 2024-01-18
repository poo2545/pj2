import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

import HomeScreen from "./screensChat/HomeScreen";
import FriendsScreen from "./screensChat/FriendsScreen";
import ChatsScreen from "./screensChat/ChatsScreen";
import ChatMessagesScreen from "./screensChat/ChatMessagesScreen";

import WelcomeScreen from "./screens/WelcomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import HomePage from './screens/HomePage';
import EditProfileScreen from './screens/EditProfile';
import Breakfast from './JounalFoodScreens/Breakfast';
import Breakfast2 from './components/Breakfast';

import DragTest from './screens/DragTest';
import RecommendFood from "./screens/RecommendFood";
import RecommendFood2 from "./screens/RecommenFood2";

import Journal from "./screens/Journal";


import Conversation from "./Chat/Conversation";
import Messages from "./Chat/Message";
import Users from "./Chat/User";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Welcome'
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="HomeScreen"
          component={HomeScreen}
        />
        <Stack.Screen name="Friends"
          component={FriendsScreen}
        />
        <Stack.Screen name="Chats"
          component={ChatsScreen}
        />
        <Stack.Screen name="EditProfileScreen"
          component={EditProfileScreen}
        />
        <Stack.Screen name="MessagesChat"
          component={ChatMessagesScreen}
        />

        <Stack.Screen name="DragTest"
          component={DragTest}
        />
        <Stack.Screen name="RecommendFood"
          component={RecommendFood}
        />

        <Stack.Screen name="RecommendFood2"
          component={RecommendFood2}
        />

        <Stack.Screen name="Conversation"
          component={Conversation}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Messages"
        component={Messages}
        />
        <Stack.Screen name="Users"
          component={Users}
        />

        <Stack.Screen name="Main"
          component={Main}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Tab = createBottomTabNavigator();
function Main() {
  return (
    <Tab.Navigator
      screenOptions={{
        activeTintColor: '#52B788',
        inactiveTintColor: '#00000',
        style: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#ddd',
        },
        labelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
      }}
    >

      <Tab.Screen
        name="HomePage"
        component={HomePage}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="home" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Jounal"
        component={Journal}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="book" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Chat"
        component={Conversation}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="comment-alt" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Drag"
        component={DragTest}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="book-medical" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
