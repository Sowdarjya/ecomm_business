import { getProducts } from "@/actions/product.action"; // adjust path
import Image from "next/image";

export default async function Products() {
  // server action directly called at build/request time
  const products = await getProducts();

  console.log("products", products);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <div
            key={product.id}
            className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
          >
            {product.images?.length > 0 && (
              <Image
                src={product.images[0]}
                alt={product.name}
                width={300}
                height={200}
                className="rounded-md object-cover"
              />
            )}
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="font-bold mt-2">${product.price}</p>
            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
