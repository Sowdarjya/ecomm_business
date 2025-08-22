"use client";

import type React from "react";

import { useState } from "react";
import { createProduct } from "@/actions/product.action"; // adjust import
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File[] | null>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setSelectedFile([...(selectedFile || []), ...newFiles]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const category = formData.get("category") as string;
    const size = formData.get("size") as string | undefined;
    const images = selectedFile ?? [];

    const res = await createProduct(
      name,
      description,
      price,
      images,
      category,
      stock,
      size
    );

    setLoading(false);

    if (res.success) {
      toast.success("✅ Product created successfully!");
      redirect("/admin/products");
    } else {
      toast.error("❌ Failed to create product. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-2 border-amber-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-900 mb-2 font-bengali">
              Add New Product
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-amber-900 font-bengali">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                required
                className="w-full border-2 border-amber-200 p-3 rounded-lg focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all bg-white/50"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-amber-900 font-bengali">
                Description *
              </label>
              <textarea
                name="description"
                placeholder="Product Description"
                required
                rows={4}
                className="w-full border-2 border-amber-200 p-3 rounded-lg focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all bg-white/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-amber-900 font-bengali">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  placeholder="₹ Price"
                  step="0.01"
                  required
                  className="w-full border-2 border-amber-200 p-3 rounded-lg focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all bg-white/50"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-amber-900 font-bengali">
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock Quantity"
                  required
                  className="w-full border-2 border-amber-200 p-3 rounded-lg focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all bg-white/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-amber-900 font-bengali">
                Category *
              </label>
              <select
                name="category"
                required
                className="w-full border-2 border-amber-200 p-3 rounded-lg focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all bg-white/50"
              >
                <option value="">Select a category</option>
                <option value="CLOTHING">Clothing</option>
                <option value="ACCESSORIES">Accessories</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-amber-900 font-bengali">
                Size
              </label>
              <input
                type="text"
                name="size"
                placeholder="S, M, L, XL"
                className="w-full border-2 border-amber-200 p-3 rounded-lg focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all bg-white/50"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-amber-900 font-bengali">
                Product Images *
              </label>
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                required
                onChange={handleFileChange}
                className="w-full border-2 border-amber-200 p-3 rounded-lg focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all bg-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white p-4 rounded-lg hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 font-bold text-lg font-bengali disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? "Uploading..." : "Create Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
