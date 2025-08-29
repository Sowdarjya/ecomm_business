"use client";

import { getProducts, updateProduct } from "@/actions/product.action";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Package, Tag, DollarSign } from "lucide-react";
import toast from "react-hot-toast";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: "CLOTHING" | "ACCESSORIES";
  size: string[] | null;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
};

type UpdateProductData = {
  name: string;
  description: string;
  price: number;
  category: "CLOTHING" | "ACCESSORIES";
  stock: number;
  size: string[];
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState<UpdateProductData>({
    name: "",
    description: "",
    price: 0,
    category: "CLOTHING",
    stock: 0,
    size: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const openUpdateDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      size: product.size || [],
    });
    setDialogOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    setUpdating(true);
    try {
      const result = await updateProduct(selectedProduct.id, formData);
      if (result.success) {
        // Update local state
        setProducts((prev) =>
          prev.map((product) =>
            product.id === selectedProduct.id
              ? { ...product, ...formData }
              : product
          )
        );
        toast.success("Product updated successfully");
        setDialogOpen(false);
      } else {
        toast.error(result.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error updating product");
    } finally {
      setUpdating(false);
    }
  };

  const handleSizeChange = (sizeString: string) => {
    const sizes = sizeString
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    setFormData((prev) => ({ ...prev, size: sizes }));
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="w-8 h-8 text-amber-600" />
            <h1 className="text-4xl font-bold text-amber-900 font-bengali">
              Product Management
            </h1>
          </div>
          <p className="text-amber-700 text-lg mb-6">
            Manage your product catalog and inventory
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-yellow-500 mx-auto rounded-full"></div>
        </div>

        {/* Add New Product Button */}
        <div className="flex justify-center mb-8">
          <Link href="/admin/products/new">
            <Button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium px-8 py-3 text-lg">
              <Plus className="w-5 h-5 mr-2" />
              Add New Product
            </Button>
          </Link>
        </div>

        {/* Products Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-900">
                {products.length}
              </div>
              <div className="text-sm text-amber-700">Total Products</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {products.filter((p) => p.category === "CLOTHING").length}
              </div>
              <div className="text-sm text-amber-700">Clothing Items</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {products.filter((p) => p.category === "ACCESSORIES").length}
              </div>
              <div className="text-sm text-amber-700">Accessories</div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-amber-200 bg-white/80 backdrop-blur-sm hover:scale-105"
            >
              {product.images?.length > 0 && (
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Category Badge */}
                  <Badge
                    className={`absolute top-3 left-3 ${
                      product.category === "CLOTHING"
                        ? "bg-blue-500 text-white"
                        : "bg-purple-500 text-white"
                    }`}
                  >
                    {product.category}
                  </Badge>

                  {/* Stock Warning */}
                  {product.stock < 5 && (
                    <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                      {product.stock === 0
                        ? "Out of Stock"
                        : `Low Stock: ${product.stock}`}
                    </Badge>
                  )}
                </div>
              )}

              <CardContent className="p-4 space-y-3">
                <div>
                  <h2 className="text-xl font-bold text-amber-900 font-bengali line-clamp-2 mb-2">
                    {product.name}
                  </h2>
                  <p className="text-amber-700 text-sm line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-2xl font-bold text-emerald-700">
                      ₹{product.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-amber-600 font-bengali">
                      Stock: {product.stock}
                    </span>
                  </div>

                  {product.size && product.size.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-600">
                        Sizes: {product.size.join(", ")}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => openUpdateDialog(product)}
                  className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 font-bengali"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Update Product
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-2xl font-bold text-amber-900 mb-2 font-bengali">
              No products found
            </h3>
            <p className="text-amber-700">Start by adding your first product</p>
          </div>
        )}

        {/* Update Product Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-amber-900">
                Update Product
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Product Name
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter product name"
                  className="border-amber-300 focus:border-amber-500"
                />
              </div>

              {/* Description */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Description
                </Label>
                <Textarea
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter product description"
                  className="border-amber-300 focus:border-amber-500 min-h-[80px]"
                />
              </div>

              {/* Price and Stock Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Price (₹)
                  </Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="0"
                    className="border-amber-300 focus:border-amber-500"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Stock
                  </Label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        stock: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="0"
                    className="border-amber-300 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: "CLOTHING" | "ACCESSORIES") =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="border-amber-300 focus:border-amber-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLOTHING">Clothing</SelectItem>
                    <SelectItem value="ACCESSORIES">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sizes */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Sizes (comma-separated, e.g., "S, M, L, XL")
                </Label>
                <Input
                  value={formData.size.join(", ")}
                  onChange={(e) => handleSizeChange(e.target.value)}
                  placeholder="S, M, L, XL"
                  className="border-amber-300 focus:border-amber-500"
                />
                {formData.size.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {formData.size.map((size) => (
                      <Badge key={size} variant="outline" className="text-xs">
                        {size}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Preview of Current Images */}
              {selectedProduct?.images && selectedProduct.images.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Current Images
                  </Label>
                  <div className="flex gap-2 overflow-x-auto">
                    {selectedProduct.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border border-amber-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={updating}
                  className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-100"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateProduct}
                  disabled={updating || !formData.name.trim()}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white"
                >
                  {updating ? "Updating..." : "Update Product"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
