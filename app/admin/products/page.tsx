import { getProducts } from "@/actions/product.action";
import Image from "next/image";

export default async function Products() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2 font-bengali">
            Our Product Collection
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <div
              key={product.id}
              className="bg-white/80 backdrop-blur-sm border-2 border-amber-200 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-amber-300"
            >
              {product.images?.length > 0 && (
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <Image
                    src={product.images[1] || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent"></div>
                </div>
              )}

              <div className="space-y-3">
                <h2 className="text-xl font-bold text-amber-900 font-bengali line-clamp-2">
                  {product.name}
                </h2>
                <p className="text-amber-700 text-sm line-clamp-3 leading-relaxed">
                  {product.description}
                </p>

                <div className="flex justify-between items-center pt-2 border-t border-amber-200">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-700">
                      ₹{product.price}
                    </p>
                    <p className="text-sm text-amber-600 font-bengali">
                      stock: {product.stock}
                    </p>
                    <p className="text-sm text-amber-600 font-bengali">
                      stock: {product.stock}
                    </p>
                    {product.size?.length > 0 && (
                      <p className="text-sm text-gray-600">
                        sizes: {product.size.join(", ")}
                      </p>
                    )}
                  </div>

                  <button className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-4 py-2 rounded-lg hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 font-bengali text-sm">
                    Update Product
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-2xl font-bold text-amber-900 mb-2 font-bengali">
              No products found
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
