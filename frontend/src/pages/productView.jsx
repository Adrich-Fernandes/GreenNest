import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Star, ShoppingCart, Truck, ShieldCheck, BookOpen, Leaf } from "lucide-react";
import UserNavBar from "../components/userNavBar";
import Footer from "../components/footer";

const allProducts = [
  {
    id: 1,
    name: "Gardening Tool Kit",
    nursery: "Green Valley Nursery",
    rating: 4.1,
    price: 599,
    category: "Tools",
    inStock: true,
    description: "Complete 5-piece kit with trowel, pruner, rake, gloves, and spray bottle.",
    careInstructions: "Clean after use. Store in dry place.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
  },
  {
    id: 2,
    name: "Bougainvillea",
    nursery: "Herb Haven",
    rating: 4.5,
    price: 275,
    category: "Flowering",
    inStock: true,
    description: "Vibrant flowering plant known for its stunning papery bracts in shades of pink and purple.",
    careInstructions: "Water regularly. Place in full sunlight. Prune after flowering.",
    image: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=800&q=80",
  },
  {
    id: 3,
    name: "Aloe Vera",
    nursery: "Nature's Nest",
    rating: 4.7,
    price: 179,
    category: "Indoor",
    inStock: true,
    description: "Low-maintenance succulent known for its soothing gel and air-purifying properties.",
    careInstructions: "Water sparingly every 2-3 weeks. Keep in bright indirect light.",
    image: "https://images.unsplash.com/photo-1567748157439-651aca2ff064?w=800&q=80",
  },
  {
    id: 4,
    name: "Jasmine Plant",
    nursery: "Bloom Garden",
    rating: 4.6,
    price: 320,
    category: "Flowering",
    inStock: true,
    description: "Fragrant flowering vine that fills your space with a beautiful natural scent.",
    careInstructions: "Water moderately. Provide support for climbing. Loves morning sun.",
    image: "https://images.unsplash.com/photo-1444021465936-c6ca81d39b84?w=800&q=80",
  },
  {
    id: 5,
    name: "Cactus Mix",
    nursery: "Desert Blooms",
    rating: 4.3,
    price: 149,
    category: "Indoor",
    inStock: true,
    description: "A curated mix of small desert cacti, perfect for windowsills and office desks.",
    careInstructions: "Water once a month. Keep in bright direct sunlight. Well-draining soil.",
    image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80",
  },
  {
    id: 6,
    name: "Sunflower Seeds",
    nursery: "Seed World",
    rating: 4.8,
    price: 89,
    category: "Seeds",
    inStock: true,
    description: "Premium quality sunflower seeds, ready to sow for bright and cheerful blooms.",
    careInstructions: "Sow in sunny spot. Water daily. Germination in 7-10 days.",
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&q=80",
  },
  {
    id: 7,
    name: "Ceramic Pot",
    nursery: "Pot Studio",
    rating: 4.4,
    price: 450,
    category: "Pots & Planters",
    inStock: true,
    description: "Handcrafted ceramic pot with drainage hole, perfect for indoor and outdoor plants.",
    careInstructions: "Handle with care. Clean with damp cloth. Avoid harsh chemicals.",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80",
  },
  {
    id: 8,
    name: "Ficus Tree",
    nursery: "Green Valley Nursery",
    rating: 4.2,
    price: 899,
    category: "Outdoor",
    inStock: false,
    description: "A classic ornamental tree with dense foliage, ideal for gardens and large indoor spaces.",
    careInstructions: "Water twice a week. Avoid direct harsh sun. Prune annually.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
];

export default function ProductView() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  const product = allProducts.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <>
        <UserNavBar />
        <div className="min-h-screen bg-[#f7f9f6] flex flex-col items-center justify-center gap-4">
          <p className="text-gray-500 text-lg">Product not found.</p>
          <Link to="/products" className="text-[#3d6b45] font-semibold hover:underline">
            Back to Products
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <UserNavBar />
      <section className="w-full min-h-screen bg-[#f7f9f6] px-6 md:px-16 py-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">

          {/* Back Link */}
          <Link
            to="/products"
            className="flex items-center gap-2 text-gray-400 hover:text-[#3d6b45] text-sm font-medium transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row gap-10 items-start">

            {/* LEFT — Image */}
            <div className="w-full md:w-1/2 rounded-3xl overflow-hidden bg-[#f0f4ee] aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* RIGHT — Details */}
            <div className="w-full md:w-1/2 flex flex-col gap-6">

              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-[#3d6b45] bg-[#f0f4ee] border border-[#c8d9c0] px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                  product.inStock
                    ? "text-[#3d6b45] bg-[#f0f4ee] border-[#c8d9c0]"
                    : "text-red-500 bg-red-50 border-red-200"
                }`}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* Name + Nursery */}
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-400">by {product.nursery}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
              </div>

              {/* Price */}
              <p className="text-4xl font-black text-[#3d6b45]">₹{product.price}</p>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>

              {/* Quantity + Add to Cart */}
              <div className="flex items-center gap-3">
                {/* Quantity Selector */}
                <div className="flex items-center gap-3 border border-[#c8d9c0] rounded-xl px-4 py-2.5 bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="text-gray-500 hover:text-[#3d6b45] font-bold text-lg w-5 h-5 flex items-center justify-center transition-colors"
                  >
                    −
                  </button>
                  <span className="text-sm font-semibold text-gray-900 w-5 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="text-gray-500 hover:text-[#3d6b45] font-bold text-lg w-5 h-5 flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  disabled={!product.inStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-150 hover:scale-[1.02] active:scale-95 ${
                    product.inStock
                      ? "bg-[#3d6b45] hover:bg-[#345c3c] text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 flex-wrap pt-1">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <Truck className="w-4 h-4 text-[#3d6b45]" />
                  Free Delivery
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <ShieldCheck className="w-4 h-4 text-[#3d6b45]" />
                  Quality Assured
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <BookOpen className="w-4 h-4 text-[#3d6b45]" />
                  Care Guide
                </div>
              </div>

              {/* Care Instructions */}
              <div className="bg-[#f0f4ee] border border-[#c8d9c0] rounded-2xl px-5 py-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-[#3d6b45]" />
                  <h3 className="text-sm font-bold text-[#3d6b45]">Care Instructions</h3>
                </div>
                <p className="text-sm text-[#4a7c52] leading-relaxed">{product.careInstructions}</p>
              </div>

            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}