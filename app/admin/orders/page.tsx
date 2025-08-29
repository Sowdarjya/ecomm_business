"use client";

import React, { useEffect, useState } from "react";
import { getAllOrders, markOrderAsDelivered } from "@/actions/order.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, User, MapPin, Clock, CheckCircle, X } from "lucide-react";
import toast from "react-hot-toast";

type OrderItem = {
  id: string;
  quantity: number;
  size: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
};

type Order = {
  id: string;
  status: string;
  totalPrice: number;
  location: string;
  createdAt: Date;
  items: OrderItem[];
  user: {
    fullName: string;
    avatarUrl?: string;
  };
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const result = await getAllOrders();
      if (result.success) {
        console.log(result);
        setOrders((result?.orders as Order[]) ?? []);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleMarkAsDelivered = async (orderId: string) => {
    setUpdatingOrder(orderId);
    try {
      const result = await markOrderAsDelivered(orderId);
      if (result.success) {
        // Update local state to reflect the change
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: "COMPLETED" } : order
          )
        );
        toast.success(result.message || "Order marked as completed");
      } else {
        toast.error(result.message || "Failed to update order status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating order status");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500 text-white";
      case "COMPLETED":
        return "bg-green-500 text-white";
      case "CANCELLED":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const canMarkAsDelivered = (status: string) => {
    return status === "PENDING";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-amber-600 animate-pulse" />
          <p className="text-amber-700 text-lg">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-amber-900 mb-4">
              Admin Orders
            </h1>
          </div>
          <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg max-w-md mx-auto">
            <CardContent className="text-center py-16">
              <Package className="w-16 h-16 text-amber-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-amber-900 mb-2">
                No orders found
              </h3>
              <p className="text-amber-700">
                Orders will appear here once customers start placing them
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="w-8 h-8 text-amber-600" />
            <h1 className="text-4xl font-bold text-amber-900">Admin Orders</h1>
          </div>
          <p className="text-amber-700 text-lg">
            Manage and track all customer orders
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-yellow-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Orders Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-900">
                {orders.length}
              </div>
              <div className="text-sm text-amber-700">Total Orders</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter((o) => o.status === "PENDING").length}
              </div>
              <div className="text-sm text-amber-700">Pending</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter((o) => o.status === "COMPLETED").length}
              </div>
              <div className="text-sm text-amber-700">Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {orders.filter((o) => o.status === "CANCELLED").length}
              </div>
              <div className="text-sm text-amber-700">Cancelled</div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-start">
                  <div>
                    <span className="text-amber-900">
                      Order #{order.id.slice(-6)}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(order.status)}`}>
                    {order.status}
                  </Badge>
                </CardTitle>

                {/* User Info */}
                <div className="flex items-center gap-3 mt-3 p-3 bg-amber-50 rounded-lg">
                  <div className="relative">
                    {order.user.avatarUrl ? (
                      <img
                        src={order.user.avatarUrl}
                        alt={order.user.fullName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-amber-300"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-300 flex items-center justify-center">
                        <User className="w-5 h-5 text-amber-700" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="font-medium text-amber-900">
                      {order.user.fullName}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Order Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      <span className="font-medium text-amber-900">
                        Location:
                      </span>{" "}
                      <span className="text-gray-700">{order.location}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      <span className="font-medium text-amber-900">Total:</span>{" "}
                      <span className="text-lg font-bold text-green-600">
                        ₹{order.totalPrice}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium text-amber-900 mb-2">
                    Items ({order.items.length})
                  </h4>
                  <ScrollArea className="h-32">
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded-md border border-gray-200"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900 line-clamp-1">
                              {item.product.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              Qty: {item.quantity} | Size: {item.size}
                            </div>
                            <div className="text-xs font-medium text-green-600">
                              ₹{item.product.price} each
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Action Button */}
                {canMarkAsDelivered(order.status) && (
                  <Button
                    onClick={() => handleMarkAsDelivered(order.id)}
                    disabled={updatingOrder === order.id}
                    className="w-full bg-gradient-to-r cursor-pointer from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium transition-all duration-300"
                  >
                    {updatingOrder === order.id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Updating...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Mark as Delivered
                      </div>
                    )}
                  </Button>
                )}

                {order.status === "COMPLETED" && (
                  <div className="flex items-center justify-center gap-2 py-2 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-medium">
                      Order Completed
                    </span>
                  </div>
                )}

                {order.status === "CANCELLED" && (
                  <div className="flex items-center justify-center gap-2 py-2 bg-red-50 rounded-lg">
                    <X className="w-5 h-5 text-red-600" />
                    <span className="text-red-700 font-medium">
                      Order Cancelled
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
