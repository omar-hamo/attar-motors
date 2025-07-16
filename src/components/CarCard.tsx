import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Car } from "../lib/supabase";

import homeImage from "../assets/home-image.avif";

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-md hover:shadow-2xl hover:shadow-red-500/40 transition-all duration-300 overflow-hidden h-full"
    >
      <Link to={`/cars/${car.id}`}>
        {/* Car Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={
              car.images && car.images.length > 0 ? car.images[0] : homeImage
            }
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {/* Condition Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full shadow-md border-2 ${
                car.condition === "new"
                  ? "bg-red-500 text-white border-red-500 shadow-white/30"
                  : "bg-gray-700 text-gray-100 border-gray-500 shadow-white/20"
              }`}
            >
              {car.condition ? car.condition.toUpperCase() : "USED"}
            </span>
          </div>
        </div>

        {/* Car Details */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-white mb-2 drop-shadow">
            {car.make} {car.model}
          </h3>

          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-extrabold text-red-500 drop-shadow">
              ${car.price ? car.price.toLocaleString() : "0"}
            </span>
            <span className="text-sm text-gray-300 font-medium">
              {car.year}
            </span>
          </div>

          {/* Car Specs */}
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-2 text-sm text-gray-300">
            <div className="flex flex-col">
              <span className="font-semibold text-white">Mileage:</span>
              <span className="ml-1 break-words">
                {car.mileage ? car.mileage.toLocaleString() : "0"} km
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-white">Engine:</span>
              <span className="ml-1 break-words">
                {car.engine_type || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-white">Transmission:</span>
              <span className="ml-1 break-words">
                {car.transmission || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-white">Fuel:</span>
              <span className="ml-1 break-words">{car.fuel_type || "N/A"}</span>
            </div>
          </div>

          {/* View Details Button */}
          <div className="mt-4 pt-3 border-t border-gray-700">
            <span className="inline-block text-red-500 font-bold border border-red-500 px-4 py-1 rounded-full mt-2 hover:bg-red-500 hover:text-white transition-colors duration-200 cursor-pointer">
              View Details →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CarCard;
