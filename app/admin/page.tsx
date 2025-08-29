"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  DollarSign,
  Eye,
  Plus,
  Settings,
  BarChart3,
  Heart,
  Star,
  Clock,
} from "lucide-react";

const Admin = () => {
  // Mock data - replace with real data from your API
  const stats = {
    totalOrders: 156,
    pendingOrders: 23,
    totalProducts: 89,
    totalUsers: 234,
    revenue: 45780,
    lowStockItems: 12,
  };

  const quickActions = [
    {
      title: "Add New Product",
      description: "Create a new product listing",
      icon: Plus,
      href: "/admin/products/new",
      color: "from-green-600 to-green-500",
    },
    {
      title: "Manage Products",
      description: "View and edit existing products",
      icon: Package,
      href: "/admin/products",
      color: "from-blue-600 to-blue-500",
    },
    {
      title: "View Orders",
      description: "Manage customer orders",
      icon: ShoppingCart,
      href: "/admin/orders",
      color: "from-purple-600 to-purple-500",
    },
    {
      title: "User Management",
      description: "Manage user accounts",
      icon: Users,
      href: "/admin/users",
      color: "from-indigo-600 to-indigo-500",
    },
  ];

  const recentActivity = [
    {
      type: "order",
      message: "New order #001234 placed by John Doe",
      time: "2 minutes ago",
      status: "pending",
    },
    {
      type: "product",
      message: "Product 'Summer T-Shirt' updated",
      time: "15 minutes ago",
      status: "completed",
    },
    {
      type: "user",
      message: "New user registration: Jane Smith",
      time: "1 hour ago",
      status: "completed",
    },
    {
      type: "order",
      message: "Order #001233 marked as delivered",
      time: "2 hours ago",
      status: "completed",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Settings className="w-8 h-8 text-amber-600" />
            <h1 className="text-4xl font-bold text-amber-900">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-amber-700 text-lg">
            Welcome back! Here's what's happening with your store today.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-yellow-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <ShoppingCart className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-amber-900 mb-1">
                {stats.totalOrders}
              </div>
              <div className="text-sm text-amber-700">Total Orders</div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-amber-900 mb-1">
                {stats.pendingOrders}
              </div>
              <div className="text-sm text-amber-700">Pending Orders</div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-amber-900 mb-1">
                {stats.totalProducts}
              </div>
              <div className="text-sm text-amber-700">Products</div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-amber-900 mb-1">
                {stats.totalUsers}
              </div>
              <div className="text-sm text-amber-700">Registered Users</div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-amber-900 mb-1">
                ₹{stats.revenue.toLocaleString()}
              </div>
              <div className="text-sm text-amber-700">Total Revenue</div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-amber-900 mb-1">
                {stats.lowStockItems}
              </div>
              <div className="text-sm text-amber-700">Low Stock Items</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-amber-900 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Link key={index} href={action.href}>
                    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-amber-100">
                      <CardContent className="p-6 text-center">
                        <div
                          className={`w-12 h-12 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-amber-900 mb-2">
                          {action.title}
                        </h3>
                        <p className="text-sm text-amber-700">
                          {action.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 bg-white/90 backdrop-blur-md border-amber-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-amber-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors duration-200"
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        activity.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-amber-900 font-medium">
                        {activity.message}
                      </p>
                      <p className="text-sm text-amber-600">{activity.time}</p>
                    </div>
                    <Badge
                      className={
                        activity.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Overview */}
          <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-amber-900 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Quick Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <span className="text-amber-900 font-medium">
                    Orders Today
                  </span>
                  <Badge className="bg-blue-100 text-blue-800">12</Badge>
                </div>

                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <span className="text-amber-900 font-medium">
                    Revenue Today
                  </span>
                  <Badge className="bg-green-100 text-green-800">₹3,450</Badge>
                </div>

                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <span className="text-amber-900 font-medium">New Users</span>
                  <Badge className="bg-purple-100 text-purple-800">8</Badge>
                </div>

                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <span className="text-amber-900 font-medium">
                    Wishlist Items
                  </span>
                  <Badge className="bg-pink-100 text-pink-800">45</Badge>
                </div>
              </div>

              <div className="pt-4 border-t border-amber-200">
                <Link href="/admin/analytics">
                  <Button className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Detailed Analytics
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Management */}
          <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-amber-900 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Product Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-900">
                    {stats.totalProducts}
                  </div>
                  <div className="text-sm text-amber-700">Total Products</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {stats.lowStockItems}
                  </div>
                  <div className="text-sm text-red-700">Low Stock</div>
                </div>
              </div>
              <div className="space-y-2">
                <Link href="/admin/products">
                  <Button
                    variant="outline"
                    className="w-full border-amber-300 text-amber-700 hover:bg-amber-100"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View All Products
                  </Button>
                </Link>
                <Link href="/admin/products/new">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Product
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Order Management */}
          <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-amber-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Order Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-900">
                    {stats.totalOrders}
                  </div>
                  <div className="text-sm text-amber-700">Total Orders</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.pendingOrders}
                  </div>
                  <div className="text-sm text-yellow-700">Pending</div>
                </div>
              </div>
              <div className="space-y-2">
                <Link href="/admin/orders">
                  <Button
                    variant="outline"
                    className="w-full border-amber-300 text-amber-700 hover:bg-amber-100"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View All Orders
                  </Button>
                </Link>
                <Link href="/admin/orders?status=pending">
                  <Button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white">
                    <Clock className="w-4 h-4 mr-2" />
                    View Pending Orders
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-amber-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recent Orders
                </div>
                <Link href="/admin/orders">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-amber-700 hover:text-amber-900"
                  >
                    View All
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity
                  .filter((a) => a.type === "order")
                  .map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-amber-50 rounded-lg"
                    >
                      <div>
                        <p className="text-amber-900 font-medium text-sm">
                          {activity.message}
                        </p>
                        <p className="text-xs text-amber-600">
                          {activity.time}
                        </p>
                      </div>
                      <Badge
                        className={
                          activity.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-amber-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-amber-700">Monthly Revenue</span>
                  <span className="font-bold text-green-600">
                    ₹{stats.revenue.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-amber-700">Avg. Order Value</span>
                  <span className="font-bold text-blue-600">
                    ₹{Math.round(stats.revenue / stats.totalOrders)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-amber-700">Conversion Rate</span>
                  <span className="font-bold text-purple-600">12.3%</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-amber-700">Customer Satisfaction</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-bold text-yellow-600">4.8/5</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-amber-200">
                  <Link href="/admin/analytics">
                    <Button
                      variant="outline"
                      className="w-full border-amber-300 text-amber-700 hover:bg-amber-100"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Detailed Analytics
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-amber-900 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                <p className="text-sm font-medium text-amber-900">Database</p>
                <p className="text-xs text-green-600">Operational</p>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                <p className="text-sm font-medium text-amber-900">
                  Payment Gateway
                </p>
                <p className="text-xs text-green-600">Connected</p>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                <p className="text-sm font-medium text-amber-900">
                  Email Service
                </p>
                <p className="text-xs text-green-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
