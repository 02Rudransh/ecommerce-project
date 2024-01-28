import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";
import axios from "axios";
import { Entypo } from "@expo/vector-icons";

const AddAddressScreen = () => {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  console.log("userId", userId);

  useEffect(() => {
    fetchAddresses();
  }, []);
  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.106:8000/addresses/${userId}`
      );
      const { addresses } = response.data;

      setAddresses(addresses);
    } catch (error) {
      console.log("error", error);
    }
  };

  //refresh the addresses when the components comes to the focus i.e, basically when we navigate back
  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [])
  );
  console.log("addresses", addresses);
  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === "android" ? 40 : 0,
        flex: 1,
        backgroundColor: "#00CED1",
      }}
    >
      <ScrollView
        style={{ backgroundColor: "white" }}
        showsHorizontalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: "#00CED1",
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 7,
              gap: 10,
              backgroundColor: "white",
              borderRadius: 7,
              height: 45,
              flex: 1,
            }}
          >
            <AntDesign
              style={{ paddingLeft: 10 }}
              name="search1"
              size={24}
              color="black"
            />
            <TextInput placeholder="Search Amazon.in" />
          </Pressable>
          <Feather name="mic" size={24} color="black" />
        </View>

        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "900" }}> Your Address</Text>

          <Pressable
            onPress={() => navigation.navigate("Add")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              borderLeftWidth: 0,
              borderRightWidth: 0,
              paddingVertical: 7,
              paddingHorizontal: 5,
            }}
          >
            <Text>Add a new Address</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </Pressable>

          <Pressable>
            {/*all the addresses */}
            {addresses?.map((item, index) => (
              <Pressable
                key={index}
                style={{
                  borderWidth: 1,
                  borderColor: "#D0D0D0",
                  padding: 10,
                  flexDirection: "column",
                  gap: 5,
                  marginVertical: 10,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    {item?.name}
                  </Text>
                  <Entypo name="location-pin" size={24} color="red" />
                </View>

                <Text style={{ fontSize: 15, color: "#181818" }}>
                  {item?.houseNo}, {item?.landmark}
                </Text>

                <Text style={{ fontSize: 15, color: "#181818" }}>
                  {item?.street}
                </Text>

                <Text style={{ fontSize: 15, color: "#181818" }}>
                  India, Indore
                </Text>

                <Text style={{ fontSize: 15, color: "#181818" }}>
                  {item?.mobileNo}
                </Text>

                <Text style={{ fontSize: 15, color: "#181818" }}>
                  {item?.postalCode}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    flexDirection: "row",
                    marginTop: 7,
                  }}
                >
                  <Pressable
                    style={{
                      backgroundColor: "#F5F5F5",
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 5,
                      borderWidth: 0.9,
                      borderColor: "#D0D0D0",
                    }}
                  >
                    <Text>Edit</Text>
                  </Pressable>

                  <Pressable
                    style={{
                      backgroundColor: "#F5F5F5",
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 5,
                      borderWidth: 0.9,
                      borderColor: "#D0D0D0",
                    }}
                  >
                    <Text>Remove</Text>
                  </Pressable>

                  <Pressable
                    style={{
                      backgroundColor: "#F5F5F5",
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 5,
                      borderWidth: 0.9,
                      borderColor: "#D0D0D0",
                    }}
                  >
                    <Text>Set as default</Text>
                  </Pressable>
                </View>
              </Pressable>
            ))}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({});
