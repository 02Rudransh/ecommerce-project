import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from "../redux/CartReducer";
import { useNavigation } from "@react-navigation/native";

const CartScreen = () => {
  const cart = useSelector((state) => state.cart.cart);
  console.log(cart);
  const total = cart
    ?.map((item) => item.price * item.quantity)
    .reduce((curr, prev) => curr + prev, 0);

  const dispatch = useDispatch();
  const increaseQuantity = (item) => {
    dispatch(incrementQuantity(item));
  };

  const decreaseQuantity = (item) => {
    dispatch(decrementQuantity(item));
  };

  const deleteItem = (item) => {
    dispatch(removeFromCart(item));
  };
  const navigation = useNavigation();
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

        <View
          style={{ padding: 10, flexDirection: "row", alignItems: "center" }}
        >
          <Text style={{ fontSize: 18, fontWeight: "400" }}>Subtotal : </Text>
          <Text style={{ fontSize: 18, fontWeight: "900" }}>₹{total}</Text>
        </View>

        <Text style={{ marginHorizontal: 10 }}>EMI details Available</Text>

        <Pressable
          onPress={() => navigation.navigate("Confirm")}
          style={{
            backgroundColor: "#FFC72C",
            padding: 10,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginTop: 10,
          }}
        >
          <Text>Proceed to Buy({cart.length}) items</Text>
        </Pressable>

        <Text
          style={{
            height: 1,
            borderColor: "#D0D0D0",
            borderWidth: 1,
            marginTop: 16,
          }}
        />

        <View
          style={{
            marginHorizontal: 10,
          }}
        >
          {cart?.map((item, index) => (
            <View
              style={{
                backgroundColor: "white",
                marginVertical: 10,
                borderBlockColor: "#F0F0F0",
                borderWidth: 2,
                borderLeftWidth: 0,
                borderTopWidth: 0,
                borderRightWidth: 0,
              }}
              key={index}
            >
              <Pressable
                style={{
                  marginVertical: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Image
                    style={{ width: 140, height: 140, resizeMode: "center" }}
                    source={{ uri: item?.image }}
                  />
                </View>

                <View>
                  <Text numberOfLines={3} style={{ width: 150, marginTop: 10 }}>
                    {item?.title}
                  </Text>
                  <Text
                    style={{ fontSize: 20, fontWeight: "bold", marginTop: 6 }}
                  >
                    {item?.price}
                  </Text>

                  <Image
                    style={{ width: 30, height: 30, resizeMode: "contain" }}
                    source={{
                      uri: "https://assets.stickpng.com/thumbs/5f4924cc68ecc70004ae7065.png",
                    }}
                  />
                  <Text style={{ color: "green" }}>In Stock</Text>
                  {/* <Text style={{ fontWeight: "500", marginTop: 6 }}>
                    {item?.rating?.rate} ratings
                  </Text> */}
                </View>
              </Pressable>

              <Pressable
                style={{
                  marginTop: 15,
                  marginBottom: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 7,
                  }}
                >
                  {item?.quantity > 1 ? (
                    <Pressable
                      onPress={() => decreaseQuantity(item)}
                      style={{
                        backgroundColor: "#D8D8D8",
                        padding: 7,
                        borderTopLeftRadius: 6,
                        borderBottomLeftRadius: 6,
                      }}
                    >
                      <AntDesign name="minus" size={20} color="black" />
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => deleteItem(item)}
                      style={{
                        backgroundColor: "#D8D8D8",
                        padding: 7,
                        borderTopLeftRadius: 6,
                        borderBottomLeftRadius: 6,
                      }}
                    >
                      <AntDesign name="delete" size={20} color="black" />
                    </Pressable>
                  )}

                  <Pressable>
                    <Text
                      style={{
                        backgroundColor: "white",
                        paddingHorizontal: 18,
                        paddingVertical: 6,
                      }}
                    >
                      {item?.quantity}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => increaseQuantity(item)}
                    style={{
                      backgroundColor: "#D8D8D8",
                      padding: 7,
                      borderTopRightRadius: 6,
                      borderBottomRightRadius: 6,
                    }}
                  >
                    <Feather name="plus" size={20} color="black" />
                  </Pressable>
                </View>

                <Pressable
                  onPress={() => deleteItem(item)}
                  style={{
                    backgroundColor: "white",
                    paddingHorizontal: 8,
                    paddingVertical: 9,
                    borderRadius: 5,
                    borderColor: "#C0C0C0",
                    borderWidth: 0.6,
                  }}
                >
                  <Text>Delete</Text>
                </Pressable>
              </Pressable>

              <Pressable
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Pressable
                  style={{
                    backgroundColor: "white",
                    paddingHorizontal: 8,
                    paddingVertical: 10,
                    borderRadius: 5,
                    borderColor: "#C0C0C0",
                    borderWidth: 0.6,
                  }}
                >
                  <Text>Save For Latter</Text>
                </Pressable>

                <Pressable
                  style={{
                    backgroundColor: "white",
                    paddingHorizontal: 8,
                    paddingVertical: 10,
                    borderRadius: 5,
                    borderColor: "#C0C0C0",
                    borderWidth: 0.6,
                  }}
                >
                  <Text>See More Like This</Text>
                </Pressable>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({});
