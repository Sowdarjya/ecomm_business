"use client";

import { addToCart, getProductsByCategory } from "@/actions/product.action";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Star, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: Category;
  size: string | null;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
};

type Category = "CLOTHING" | "ACCESSORIES";

const ClothingCategory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const getProducts = async () => {
    try {
      const products = await getProductsByCategory("CLOTHING");
      setProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    getProducts();
    setLoading(false);
  }, []);

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId);
      toast.success("Product added to cart");
      getProducts();
    } catch (error) {
      console.log("Error adding to cart:", error);
      toast.error("Failed to add product to cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-6">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            New Arrivals - Clothing
          </h1>
          <p className="text-lg text-amber-700 max-w-2xl mx-auto">
            Our collection of trendy clothing for the fashion-forward
            individual.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-yellow-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Badge
            variant="secondary"
            className="bg-amber-200 text-amber-800 hover:bg-amber-300"
          >
            সব পোশাক ({products.length})
          </Badge>
          <Badge
            variant="outline"
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            শাড়ি
          </Badge>
          <Badge
            variant="outline"
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            লেহেঙ্গা
          </Badge>
          <Badge
            variant="outline"
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            কুর্তা
          </Badge>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-amber-200 bg-white/80 backdrop-blur-sm hover:scale-105"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={
                    product.images[0] || "/placeholder.svg?height=300&width=300"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                  >
                    <Heart className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

                {product.stock < 5 && (
                  <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                    মাত্র {product.stock}টি বাকি
                  </Badge>
                )}
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-amber-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600">4.5</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-amber-800">
                      <span
                        className="text-base text-gray-500 mr-2"
                        style={{ textDecoration: "line-through" }}
                      >
                        ₹{product.price + 100}
                      </span>{" "}
                      ₹{product.price}
                    </span>
                    {product.size && (
                      <span className="text-xs text-gray-500">
                        size: {product.size}
                      </span>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={`${
                      product.stock > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    } px-2 py-1 text-xs font-medium rounded-full`}
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddToCart(product.id)}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white font-medium transition-all duration-300 group-hover:shadow-lg cursor-pointer"
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to cart
                  </Button>
                  <Link href={`/product/${product.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-3 border-amber-300 text-amber-700 hover:bg-amber-100 bg-transparent cursor-pointer"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👗</div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">
              No Products Found
            </h3>
            <p className="text-amber-700">Please try again later</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClothingCategory;
