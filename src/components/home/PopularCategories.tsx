import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react"; // ✅ Add this icon

const categories = [
  {
    name: "Laptops",
    image: "/category/laptop.jpeg",
    count: `(45)`,
    href: "/category/laptops",
  },
  {
    name: "Keyboards",
    image: "/category/keyboard.jpeg",
    count: `(32)`,
    href: "/category/keyboards",
  },
  {
    name: "Mouse",
    image: "/category/mouse.jpeg",
    count: `(28)`,
    href: "/category/mouse",
  },
  {
    name: "Headphones",
    image: "/category/headphones.jpeg",
    count: `(24)`,
    href: "/category/headphones",
  },
  {
    name: "Accessories",
    image: "/category/accessories.png",
    count: `(56)`,
    href: "/category/accessories",
  },
  {
    name: "See All",
    image: "",
    href: "/category/",
    count: "All",
  },
];

export default function PopularCategories() {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="border border-[#c1e5cf] dark:border-gray-600 rounded-lg p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-3 border-b border-[#c1e5cf]">
              Popular Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="bg-[#f6f6f6] p-6 rounded-lg hover:bg-[#e7e7e7] transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  {/* ✅ If it's "See All", show icon instead of image */}
                  <div className="w-20 h-20 bg-white border-2 flex items-center justify-center flex-shrink-0 rounded-lg">
                    {category.name === "See All" ? (
                      <div className="flex flex-col items-center justify-center text-[#4a5f52]">
                        <ArrowRight size={35} className="group-hover:translate-x-1 transition-transform" />
                        <span className="text-sm font-semibold mt-1">See All</span>
                      </div>
                    ) : (
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={60}
                        height={60}
                        className="object-cover h-fit w-full hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {category.count} items Available
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
