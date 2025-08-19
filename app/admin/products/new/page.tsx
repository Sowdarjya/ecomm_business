"use client";

import { useState } from "react";
import { createProduct } from "@/actions/product.action"; // adjust import

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);

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
    const images = formData.getAll("images") as File[];

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
      alert("✅ Product created successfully!");
      e.currentTarget.reset();
    } else {
      alert("❌ Error creating product.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          required
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          step="0.01"
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          required
          className="w-full border p-2 rounded"
        />

        <select name="category" required className="w-full border p-2 rounded">
          <option value="">Select Category</option>
          <option value="CLOTHING">Clothing</option>
          <option value="ACCESSORIES">Accessories</option>
        </select>

        <input
          type="text"
          name="size"
          placeholder="Size (optional)"
          className="w-full border p-2 rounded"
        />

        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          required
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white p-2 rounded hover:bg-primary/90"
        >
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
