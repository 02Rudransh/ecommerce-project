import {
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import jwt_decode from "jwt-decode";
import { UserType } from "../UserContext";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { encode, decode } from "base-64";

const AddressScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const { userId, setUserId } = useContext(UserType);

  useEffect(() => {
    // const fetchUser = async () => {
    //   const token = await AsyncStorage.getItem("authToken");
    //   const decodeToken = jwt_decode(token);
    //   const userId = decodeToken.userId;
    //   setUserId(userId);
    // };

    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const tokenParts = token.split(".");

        if (tokenParts.length === 3) {
          const decodedToken = JSON.parse(decode(tokenParts[1]));
          const userId = decodedToken.userId;
          setUserId(userId);
        } else {
          console.error("Invalid JWT token format");
        }
      } catch (error) {
        console.error("Error decoding JWT token:", error);
      }
    };

    fetchUser();
  }, []);

  console.log(userId);

  const handleAddAddress = () => {
    const address = {
      name,
      mobileNo,
      houseNo,
      street,
      landmark,
      postalCode,
    };

    axios
      .post("http://192.168.0.106:8000/addresses", { userId, address })
      .then((response) => {
        Alert.alert("Success", "Address added successfully");
        setName("");
        setMobileNo("");
        setHouseNo("");
        setStreet("");
        setLandmark("");
        setPostalCode("");
        setTimeout(() => {
          navigation.goBack();
        }, 500);
      })
      .catch((error) => {
        Alert.alert("Error to fetch address");
        console.log("error", error);
      });
  };
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
            padding: 15,
            flexDirection: "row",
            alignItems: "center",
          }}
        />
        <View style={{ padding: 10, marginHorizontal: 5 }}>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>
            Add a new Address
          </Text>

          <TextInput
            placeholderTextColor={"black"}
            placeholder="India"
            style={{
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
          />

          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              Full Name (First and last Name)
            </Text>

            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              placeholderTextColor={"black"}
              style={{
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
              }}
              placeholder="Enter your name"
            />
          </View>

          <View>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              Mobile number
            </Text>

            <TextInput
              value={mobileNo}
              onChangeText={(text) => setMobileNo(text)}
              placeholderTextColor={"black"}
              style={{
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
              }}
              placeholder="Mobile No"
            />
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              Flat,House No,Building,Company
            </Text>

            <TextInput
              value={houseNo}
              onChangeText={(text) => setHouseNo(text)}
              placeholderTextColor={"black"}
              style={{
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
              }}
              placeholder=""
            />
          </View>

          <View>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              Area,Street,Sector,Village
            </Text>

            <TextInput
              value={street}
              onChangeText={(text) => setStreet(text)}
              placeholderTextColor={"black"}
              style={{
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
              }}
              placeholder=""
            />
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>Landmark</Text>

            <TextInput
              value={landmark}
              onChangeText={(text) => setLandmark(text)}
              placeholderTextColor={"black"}
              style={{
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
              }}
              placeholder="Eg. Near Bombay Hospital"
            />
          </View>

          <View>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>Pincode</Text>

            <TextInput
              value={postalCode}
              onChangeText={(text) => setPostalCode(text)}
              placeholderTextColor={"black"}
              style={{
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
              }}
              placeholder="Enter Pincode"
            />
          </View>

          <Pressable
            onPress={handleAddAddress}
            style={{
              backgroundColor: "#FFC72C",
              padding: 19,
              borderRadius: 6,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 25,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Add Address</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({});
