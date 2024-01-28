import {
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { cleanCart } from "../redux/CartReducer";
import { useNavigation } from "@react-navigation/native";
import RazorpayCheckout from "react-native-razorpay";

const ConfirmationScreen = () => {
  const steps = [
    { title: "Address", content: "Address Form" },
    { title: "Delivery", content: "Delivery Options" },
    { title: "Payment", content: "Payment Details" },
    { title: "Place Order", content: "Order Summary" },
  ];
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const cart = useSelector((state) => state.cart.cart);
  const total = cart
    ?.map((item) => item.price * item.quantity)
    .reduce((curr, prev) => curr + prev, 0);

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
  const dispatch = useDispatch();
  const [selectedAddress, setSelectedAddress] = useState("");
  const [options, setOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        userId: userId,
        cartItems: cart,
        totalPrice: total,
        shippingAddress: selectedAddress,
        paymentMethod: selectedOption,
      };

      const response = await axios.post(
        "http://192.168.0.106:8000/orders",
        orderData
      );
      if (response.status === 200) {
        navigation.navigate("Order");
        dispatch(cleanCart());
        console.log("order created successfully", response.data.order);
      } else {
        console.log("error creating order", response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const pay = async () => {
    try {
      const options = {
        description: "Adding To Wallet",
        currency: "INR",
        name: "Amazon",
        key: "rzp_test_hSqpmPSFP6RPAi",
        amount: total * 100,
        prefill: {
          email: "void@razorpay.com",
          contact: "9191919191",
          name: "RazorPay Software",
        },
        theme: { color: "#F37254" },
      };

      const data = await RazorpayCheckout.open(options);

      console.log(data);

      const orderData = {
        userId: userId,
        cartItems: cart,
        totalPrice: total,
        shippingAddress: selectedAddress,
        // paymentMethod: selectedOption,
        paymentMethod: "card",
      };

      const response = await axios.post(
        "http://192.168.0.106:8000/orders",
        orderData
      );
      if (response.status === 200) {
        navigation.navigate("Order");
        dispatch(cleanCart());
        console.log("order created successfully", response.data.order);
      } else {
        console.log("error creating order", response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
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
            padding: 10,
          }}
        />
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 40,
            flex: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
              justifyContent: "space-between",
            }}
          >
            {steps?.map((step, index) => (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                {index > 0 && (
                  <View
                    style={[
                      { flex: 1, height: 2, backgroundColor: "grey" },
                      index <= currentStep && { backgroundColor: "green" },
                    ]}
                  />
                )}
                <View
                  style={[
                    {
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#ccc",
                    },
                    index < currentStep && { backgroundColor: "green" },
                  ]}
                >
                  {index < currentStep ? (
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      {" "}
                      &#10003;
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text style={{ textAlign: "center", marginTop: 8 }}>
                  {step.title}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {currentStep == 0 && (
          <View style={{ marginHorizontal: 20 }}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              Select a Delivery Address
            </Text>

            <Pressable>
              {addresses?.map((item, index) => (
                <Pressable
                  key={index}
                  style={{
                    borderWidth: 1,
                    borderColor: "#D0D0D0",
                    padding: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    paddingBottom: 17,
                    marginVertical: 7,
                    borderRadius: 6,
                  }}
                >
                  {selectedAddress && selectedAddress._id === item?._id ? (
                    <FontAwesome5 name="dot-circle" size={20} color="#008397" />
                  ) : (
                    <Entypo
                      onPress={() => setSelectedAddress(item)}
                      name="circle"
                      size={20}
                      color="grey"
                    />
                  )}

                  <View style={{ marginLeft: 6 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                        {item?.name}
                      </Text>
                      <Entypo name="location-pin" size={20} color="red" />
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

                    <View>
                      {selectedAddress && selectedAddress._id === item?._id && (
                        <Pressable
                          onPress={() => setCurrentStep(1)}
                          style={{
                            backgroundColor: "#008397",
                            padding: 10,
                            borderRadius: 20,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 10,
                          }}
                        >
                          <Text style={{ textAlign: "center", color: "white" }}>
                            Deliver to this Address
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  </View>
                </Pressable>
              ))}
            </Pressable>
          </View>
        )}

        {currentStep == 1 && (
          <View style={{ marginHorizontal: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Choose your delivery options
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "white",
                padding: 8,
                gap: 7,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
              }}
            >
              {options ? (
                <FontAwesome5 name="dot-circle" size={20} color="#008397" />
              ) : (
                <Entypo
                  onPress={() => setOptions(!options)}
                  name="circle"
                  size={20}
                  color="grey"
                />
              )}

              <Text style={{ flex: 1 }}>
                <Text style={{ color: "green", fontWeight: "500" }}>
                  Tomorrow by 10pm
                </Text>{" "}
                - FREE delivery with your Prime membership
              </Text>
            </View>

            <Pressable
              onPress={() => setCurrentStep(2)}
              style={{
                backgroundColor: "#FFC72C",
                padding: 10,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 15,
              }}
            >
              <Text>Continue</Text>
            </Pressable>
          </View>
        )}

        {currentStep == 2 && (
          <View style={{ marginHorizontal: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Select your payment method
            </Text>

            <View
              style={{
                backgroundColor: "white",
                padding: 8,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                flexDirection: "row",
                alignItems: "center",
                gap: 7,
                marginTop: 12,
              }}
            >
              {selectedOption === "cash" ? (
                <FontAwesome5 name="dot-circle" size={20} color="#008397" />
              ) : (
                <Entypo
                  onPress={() => setSelectedOption("cash")}
                  name="circle"
                  size={20}
                  color="gray"
                />
              )}
              <Text>Cash on Delivery</Text>
            </View>

            <View
              style={{
                backgroundColor: "white",
                padding: 8,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                flexDirection: "row",
                alignItems: "center",
                gap: 7,
                marginTop: 12,
              }}
            >
              {selectedOption === "card" ? (
                <FontAwesome5 name="dot-circle" size={20} color="#008397" />
              ) : (
                <Entypo
                  onPress={() => {
                    setSelectedOption("card");
                    Alert.alert("UPI/Debit card", "Pay Online", [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel is processed"),
                      },
                      {
                        text: "OK",
                        onPress: () => pay(),
                      },
                    ]);
                  }}
                  name="circle"
                  size={20}
                  color="grey"
                />
              )}
              <Text>UPI / Credit or Debit card</Text>
            </View>
            <Pressable
              onPress={() => setCurrentStep(3)}
              style={{
                backgroundColor: "#FFC72C",
                padding: 10,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 15,
              }}
            >
              <Text>Continue</Text>
            </Pressable>
          </View>
        )}

        {currentStep === 3 && selectedOption === "cash" && (
          <View style={{ marginHorizontal: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Order Now</Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                backgroundColor: "white",
                padding: 8,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
              }}
            >
              <View>
                <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                  Save 5% and never run out
                </Text>
                <Text style={{ fontSize: 15, color: "gray", marginTop: 5 }}>
                  Turn on auto deliveries
                </Text>
              </View>

              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="black"
              />
            </View>

            <View
              style={{
                backgroundColor: "white",
                padding: 8,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
              }}
            >
              <Text>Shipping to {selectedAddress?.name} </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "500", color: "grey" }}
                >
                  Items
                </Text>

                <Text style={{ color: "grey", fontSize: 16 }}>₹{total} </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "500", color: "grey" }}
                >
                  Delivery
                </Text>

                <Text style={{ color: "grey", fontSize: 16 }}>₹0 </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  Order Total
                </Text>

                <Text
                  style={{ fontWeight: "900", color: "#C60C30", fontSize: 17 }}
                >
                  ₹{total}
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: "white",
                padding: 8,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
              }}
            >
              <Text style={{ fontSize: 16, color: "grey" }}>Pay With</Text>

              <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 7 }}>
                Pay on delivery (Cash)
              </Text>
            </View>

            <Pressable
              onPress={handlePlaceOrder}
              style={{
                backgroundColor: "#FFC72C",
                padding: 10,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Text>Place your order</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConfirmationScreen;

const styles = StyleSheet.create({});
