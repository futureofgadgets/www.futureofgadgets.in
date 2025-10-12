import React from "react";
import Link from "next/link";
import Image from "next/image";
// search?q=laptops
const brands = [
  { name: "Apple", image: "/brand/Apple.png",},
  { name: "Asus", image: "/brand/Asus.png" },
  { name: "Dell", image: "/brand/dell.png" },
  { name: "HP", image: "/brand/hp.webp" },
  { name: "Lenovo", image: "/brand/lenovo.png" },
  { name: "Samsung", image: "/brand/samsung.png" },
  { name: "Sony", image: "/brand/acer.png" },
];





const ShopByBrands = () => {
  return (
     <section className="bg-white py-12">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-10">
        <div className="border border-[#c1e5cf] dark:border-gray-600 rounded-lg p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white pb-3 border-b border-[#c1e5cf]">Shop By Brands</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6">
            {brands.map((brand) => (
            <a
              key={brand.name}
              href={`/search?q=${brand.name.toLowerCase()}`}
              className="bg-gray-50 w-full h-20 flex items-center justify-center rounded-lg overflow-hidden hover:shadow-md hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 border border-gray-100 dark:border-gray-600"
            >
              <Image
                src={brand.image}
                alt={brand.name}
                width={120}
                height={80}
                className="w-16 h-12 object-contain transition-all duration-300"
              />
            </a>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopByBrands;
