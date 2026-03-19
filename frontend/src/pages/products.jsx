import { useState } from "react";
import { Search, ShoppingCart, Star, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import UserNavBar from "../components/userNavBar";

const allProducts = [
  { id: 1, name: "Gardening Tool Kit", nursery: "Green Valley Nursery", rating: 4.1, price: 599, category: "Tools", categoryColor: "bg-green-100 text-green-700", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" },
  { id: 2, name: "Bougainvillea", nursery: "Herb Haven", rating: 4.5, price: 275, category: "Flowering", categoryColor: "bg-green-100 text-green-700", image: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=400&q=80" },
  { id: 3, name: "Aloe Vera", nursery: "Nature's Nest", rating: 4.7, price: 179, category: "Indoor", categoryColor: "bg-green-100 text-green-700", image: "https://images.unsplash.com/photo-1567748157439-651aca2ff064?w=400&q=80" },
  { id: 4, name: "Jasmine Plant", nursery: "Bloom Garden", rating: 4.6, price: 320, category: "Flowering", categoryColor: "bg-green-100 text-green-700", image: "https://images.unsplash.com/photo-1444021465936-c6ca81d39b84?w=400&q=80" },
  { id: 5, name: "Cactus Mix", nursery: "Desert Blooms", rating: 4.3, price: 149, category: "Indoor", categoryColor: "bg-green-100 text-green-700", image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400&q=80" },
  { id: 6, name: "Sunflower Seeds", nursery: "Seed World", rating: 4.8, price: 89, category: "Seeds", categoryColor: "bg-green-100 text-green-700", image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&q=80" },
  { id: 7, name: "Ceramic Pot", nursery: "Pot Studio", rating: 4.4, price: 450, category: "Pots & Planters", categoryColor: "bg-green-100 text-green-700", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80" },
  { id: 8, name: "Ficus Tree", nursery: "Green Valley Nursery", rating: 4.2, price: 899, category: "Outdoor", categoryColor: "bg-green-100 text-green-700", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
];

const categories = ["All Types", "Indoor", "Outdoor", "Flowering", "Seeds", "Pots & Planters", "Tools"];
const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low", "Top Rated"];

export default function Products() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Types");
  const [selectedSort, setSelectedSort] = useState("Newest");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = allProducts
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.nursery.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "All Types" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (selectedSort === "Price: Low to High") return a.price - b.price;
      if (selectedSort === "Price: High to Low") return b.price - a.price;
      if (selectedSort === "Top Rated") return b.rating - a.rating;
      return b.id - a.id;
    });

  return (
    <>
      <UserNavBar />
      <section className="w-full min-h-screen bg-[#f5f5f0] px-6 md:px-16 py-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">

          {/* Header */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Plants & Products</h1>
            <p className="text-gray-400 text-sm mt-1">Browse our curated collection of plants and gardening essentials</p>
          </div>

          {/* TOP DIV — Search + Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

            {/* Search Bar */}
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 flex-1 shadow-sm">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search plants, tools, seeds..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => { setCategoryOpen(!categoryOpen); setSortOpen(false); }}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 font-medium shadow-sm hover:border-gray-300 transition-colors w-full sm:w-44 justify-between"
              >
                {selectedCategory}
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`} />
              </button>
              {categoryOpen && (
                <div className="absolute top-full mt-2 left-0 bg-white border border-gray-100 rounded-xl shadow-lg z-20 w-44 py-1 overflow-hidden">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setCategoryOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between transition-colors"
                    >
                      {cat}
                      {selectedCategory === cat && (
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <button
                onClick={() => { setSortOpen(!sortOpen); setCategoryOpen(false); }}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 font-medium shadow-sm hover:border-gray-300 transition-colors w-full sm:w-48 justify-between"
              >
                {selectedSort}
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`} />
              </button>
              {sortOpen && (
                <div className="absolute top-full mt-2 left-0 bg-white border border-gray-100 rounded-xl shadow-lg z-20 w-48 py-1 overflow-hidden">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSelectedSort(opt); setSortOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between transition-colors"
                    >
                      {opt}
                      {selectedSort === opt && (
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM DIV — Cards */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {filtered.map((product) => (
                <Link
                  to={`/plants/${product.id}`}
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
                >
                  {/* Mobile: horizontal layout — Desktop: vertical layout */}
                  <div className="flex flex-row sm:flex-col">

                    {/* Image */}
                    <div className="relative w-36 h-36 shrink-0 sm:w-full sm:h-52 bg-green-50 overflow-hidden sm:rounded-none rounded-l-2xl">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className={`absolute top-2 left-2 ${product.categoryColor} text-xs font-semibold px-2 py-0.5 rounded-full`}>
                        {product.category}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-between flex-1 px-4 py-4 sm:pt-4 sm:pb-5">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-400">{product.nursery}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-medium text-gray-600">{product.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 sm:mt-3">
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                          ₹{product.price}
                        </span>
                        <button
                          onClick={(e) => e.preventDefault()}
                          className="flex items-center gap-1 sm:gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all duration-150 hover:scale-105 active:scale-95"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          Add
                        </button>
                      </div>
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <p className="text-gray-400 text-lg font-medium">No products found</p>
              <p className="text-gray-300 text-sm">Try adjusting your search or filters</p>
            </div>
          )}

        </div>
      </section>
    </>
  );
}