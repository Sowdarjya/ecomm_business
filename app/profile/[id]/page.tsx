"use client";

import { getUserOrders, cancelOrder } from "@/actions/order.action";
import {
  getUserById,
  setDefaultAddress,
  getDefaultPhone,
  setDefaultPhone,
} from "@/actions/user.action";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Package, Calendar } from "lucide-react";
import Link from "next/link";

type User = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  address: string;
  phone: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
};

type OrderItem = {
  id: string;
  quantity: number;
  size: string;
  orderId: string;
  productId: string;
  product: Product;
};

type Order = {
  id: string;
  status: string;
  totalPrice: number;
  location: string;
  contactNo: string;
  createdAt: Date;
  items: OrderItem[];
};

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);

  const fetchUserDetails = async (userId: string) => {
    try {
      const res = await getUserById(userId);
      if (res.success && res.user) {
        setUser(res.user);
        setNewAddress(res.user.address || "");
        setNewPhone(res.user.phone || "");
      } else {
        toast.error("Failed to fetch user details");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch user details");
    }
  };

  const fetchUserOrders = async () => {
    try {
      const res = await getUserOrders();
      if (res.success && res.orders) {
        setOrders(res.orders as Order[]);
      } else {
        console.log("No orders or failed to fetch:", res);
        setOrders([]);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
      toast.error("Failed to fetch user orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressUpdate = async () => {
    try {
      if (!newAddress.trim()) {
        toast.error("Address cannot be empty");
        return;
      }
      const res = await setDefaultAddress(newAddress);
      if (res.success) {
        setUser((prev) => (prev ? { ...prev, address: newAddress } : prev));
        toast.success("Address updated successfully");
        setEditingAddress(false);
      } else {
        toast.error(res.message || "Failed to update address");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating address");
    }
  };

  const handlePhoneUpdate = async () => {
    try {
      if (!newPhone.trim()) {
        toast.error("Phone number cannot be empty");
        return;
      }

      // Basic phone validation
      const phoneRegex = /^[+]?[1-9][\d\s\-\(\)]{7,14}$/;
      if (!phoneRegex.test(newPhone.trim())) {
        toast.error("Please enter a valid phone number");
        return;
      }

      const res = await setDefaultPhone(newPhone);
      if (res.success) {
        setUser((prev) => (prev ? { ...prev, phone: newPhone } : prev));
        toast.success("Phone number updated successfully");
        setEditingPhone(false);
      } else {
        toast.error(res.message || "Failed to update phone number");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating phone number");
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setCancellingOrder(orderId);
    try {
      const res = await cancelOrder(orderId);
      if (res.success) {
        toast.success("Order cancelled successfully");
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: "CANCELED" } : order
          )
        );
      } else {
        toast.error(res.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error cancelling order");
    } finally {
      setCancellingOrder(null);
    }
  };

  const canCancelOrder = (status: string) => {
    return status === "PENDING";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "COMPLETED":
        return "bg-green-500";
      case "CANCELED":
        return "bg-gray-500";
      default:
        return "bg-red-500";
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserDetails(id.toString());
      fetchUserOrders();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4" />
          <p className="text-amber-700 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-amber-700 text-lg">User not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* User Info */}
        <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-20 h-20 rounded-full border-4 border-amber-300 object-cover"
            />
            <div>
              <CardTitle className="text-2xl text-amber-900">
                {user.fullName}
              </CardTitle>
              <p className="text-amber-700">{user.email}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Address Section */}
            <div className="space-y-2">
              <Label className="text-amber-800 font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </Label>
              <div className="flex items-center justify-between gap-4">
                {editingAddress ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      placeholder="Enter your address"
                      className="flex-1 border-amber-200 focus:border-amber-400"
                    />
                    <Button
                      onClick={handleAddressUpdate}
                      className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white cursor-pointer"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      className="border-amber-400 text-amber-700 hover:bg-amber-100 cursor-pointer"
                      onClick={() => {
                        setEditingAddress(false);
                        setNewAddress(user.address);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-amber-700 flex-1">
                      {user.address || "No address set"}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setEditingAddress(true)}
                      className="border-amber-400 text-amber-700 hover:bg-amber-100 cursor-pointer"
                    >
                      Edit
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Phone Section */}
            <div className="space-y-2">
              <Label className="text-amber-800 font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <div className="flex items-center justify-between gap-4">
                {editingPhone ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      type="tel"
                      className="flex-1 border-amber-200 focus:border-amber-400"
                    />
                    <Button
                      onClick={handlePhoneUpdate}
                      className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white cursor-pointer"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      className="border-amber-400 text-amber-700 hover:bg-amber-100 cursor-pointer"
                      onClick={() => {
                        setEditingPhone(false);
                        setNewPhone(user.phone);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-amber-700 flex-1">
                      {user.phone || "No phone number set"}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setEditingPhone(true)}
                      className="border-amber-400 text-amber-700 hover:bg-amber-100 cursor-pointer"
                    >
                      Edit
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Section */}
        <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-amber-900 flex items-center gap-2">
              <Package className="h-5 w-5" />
              My Orders ({orders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-amber-300 mx-auto mb-4" />
                <p className="text-amber-700 text-lg">
                  You have no orders yet.
                </p>
                <p className="text-amber-600 text-sm mt-2">
                  Start shopping to see your orders here!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-amber-200 rounded-lg p-6 hover:shadow-md transition bg-white"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-amber-900 font-semibold text-lg flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Order #{order.id.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          Placed on:{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          className={`${getStatusColor(
                            order.status
                          )} text-white`}
                        >
                          {order.status}
                        </Badge>
                        {canCancelOrder(order.status) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={cancellingOrder === order.id}
                            className="border-red-300 text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            {cancellingOrder === order.id
                              ? "Cancelling..."
                              : "Cancel Order"}
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-3 bg-amber-50 rounded-lg"
                        >
                          <img
                            src={
                              item.product.images[1] ||
                              "/placeholder.svg?height=64&width=64"
                            }
                            alt={item.product.name}
                            className="w-16 h-16 rounded-md object-cover border border-amber-200"
                          />

                          <div className="flex-1">
                            <Link
                              href={`/product/${item.product.id}`}
                              className="font-semibold text-amber-900 hover:underline mb-1 line-clamp-1"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-gray-600 mb-1 line-clamp-1">
                              {item.product.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-amber-700">
                                Size: <strong>{item.size || "N/A"}</strong>
                              </span>
                              <span className="text-amber-700">
                                Qty: <strong>{item.quantity}</strong>
                              </span>
                              <span className="text-amber-700">
                                Price: <strong>₹{item.product.price}</strong>
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold text-amber-900">
                              ₹{item.product.price * item.quantity}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.quantity} × ₹{item.product.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-amber-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="text-sm text-gray-600">
                          <p className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="font-medium">Delivery:</span>{" "}
                            {order.location}
                          </p>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span className="font-medium">Contact:</span>{" "}
                            {order.contactNo || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {order.items.length} item
                          {order.items.length > 1 ? "s" : ""}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-amber-900">
                            Total: ₹{order.totalPrice}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
