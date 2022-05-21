import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomePageScreen from './screens/HomePageScreen';
import IdeaListScreen from './screens/IdeaListScreen';
import IdeaScreen from './screens/IdeaScreen';
import MemberScreen from './screens/MemberScreen';
import MemberLoginScreen from './screens/MemberLoginScreen';
import MemberRegisterScreen from './screens/MemberRegisterScreen';
import MemberManagementScreen from "./screens/MemberManagementScreen";
import IdeaCreateScreen from './screens/IdeaCreateScreen';
import SearchingScreen from './screens/SearchingScreen';
import RecommendationScreen from './screens/RecommendationScreen';
import IdeaManagementScreen from './screens/IdeaManageementScreen';
import IdeaUpdateScreen from './screens/IdeaUpdateScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomePageScreen} />
          <Stack.Screen name="IdeaList" component={IdeaListScreen} />
          <Stack.Screen name="Member" component={MemberScreen} />
          <Stack.Screen name="Login" component={MemberLoginScreen} />
          <Stack.Screen name="Register" component={MemberRegisterScreen} />
          <Stack.Screen name="Update Password" component={MemberManagementScreen} />
          <Stack.Screen name="Manage Ideas" component={IdeaManagementScreen} />
          <Stack.Screen name="Update Idea" component={IdeaUpdateScreen} />
          <Stack.Screen name="CreateIdea" component={IdeaCreateScreen} />
          <Stack.Screen name="Searching" component={SearchingScreen} />
          <Stack.Screen name="Recommendation" component={RecommendationScreen} />
          <Stack.Screen name="Idea" component={IdeaScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}