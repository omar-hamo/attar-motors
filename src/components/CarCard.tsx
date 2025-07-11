import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Car } from "../lib/supabase";

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      <Link to={`/cars/${car.id}`}>
        {/* Car Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={
              car.images && car.images.length > 0
                ? car.images[0]
                : "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
            }
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {/* Condition Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                car.condition === "new"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {car.condition ? car.condition.toUpperCase() : "USED"}
            </span>
          </div>
        </div>

        {/* Car Details */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {car.make} {car.model}
          </h3>

          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-primary-600">
              ${car.price ? car.price.toLocaleString() : "0"}
            </span>
            <span className="text-sm text-gray-500">{car.year}</span>
          </div>

          {/* Car Specs */}
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-2 text-sm text-gray-600">
            <div className="flex flex-col">
              <span className="font-medium">Mileage:</span>
              <span className="ml-1 break-words">
                {car.mileage ? car.mileage.toLocaleString() : "0"} km
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium">Engine:</span>
              <span className="ml-1 break-words">
                {car.engine_type || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium">Transmission:</span>
              <span className="ml-1 break-words">
                {car.transmission || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium">Fuel:</span>
              <span className="ml-1 break-words">{car.fuel_type || "N/A"}</span>
            </div>
          </div>

          {/* View Details Button */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <span className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
              View Details →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CarCard;
