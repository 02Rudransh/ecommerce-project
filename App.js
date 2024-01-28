import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import StackNavigatior from "./navigation/StackNavigator";
import { Provider } from "react-redux";
import store from "./store";
import { ModalPortal } from "react-native-modals";
import { UserContext } from "./UserContext";
export default function App() {
  return (
    <>
      <Provider store={store}>
        <UserContext>
          <StackNavigatior />
          <ModalPortal />
        </UserContext>
      </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
