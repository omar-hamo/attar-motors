import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Gauge,
  Settings,
  Fuel,
  Car as CarIcon,
} from "lucide-react";
import { supabase, Car } from "../lib/supabase";

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchCar(id);
    }
  }, [id]);

  const fetchCar = async (carId: string) => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", carId)
        .single();

      if (error) throw error;
      setCar(data);
    } catch (error) {
      console.error("Error fetching car:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Car not found
          </h2>
          <Link
            to="/cars"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cars
          </Link>
        </div>
      </div>
    );
  }

  const specs = [
    { icon: Calendar, label: "Year", value: car.year },
    {
      icon: Gauge,
      label: "Mileage",
      value: `${car.mileage.toLocaleString()} km`,
    },
    { icon: Settings, label: "Engine", value: car.engine_type },
    { icon: CarIcon, label: "Transmission", value: car.transmission },
    { icon: Fuel, label: "Fuel Type", value: car.fuel_type },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link
            to="/cars"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden mb-4">
              <img
                src={
                  car.images[selectedImage] ||
                  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                }
                alt={`${car.make} ${car.model}`}
                className="w-full h-full object-cover"
              />
              {/* Condition Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    car.condition === "new"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {car.condition.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {car.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {car.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-primary-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${car.make} ${car.model} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Car Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {car.make} {car.model}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {car.year} •{" "}
                {car.condition.charAt(0).toUpperCase() + car.condition.slice(1)}
              </p>
              <div className="text-3xl font-bold text-primary-600">
                ${car.price.toLocaleString()}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {car.description ||
                  `This ${car.year} ${car.make} ${car.model} is a ${
                    car.condition
                  } vehicle with ${car.mileage.toLocaleString()} kilometers on the odometer. It features a ${
                    car.engine_type
                  } engine with ${car.transmission} transmission and runs on ${
                    car.fuel_type
                  }.`}
              </p>
            </div>

            {/* Specifications */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specs.map((spec, index) => (
                  <motion.div
                    key={spec.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="flex items-center p-4 bg-white rounded-lg shadow-sm"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-primary-100 text-primary-600 rounded-lg mr-4">
                      <spec.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{spec.label}</div>
                      <div className="font-semibold text-gray-900">
                        {spec.value}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-primary-50 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Interested in this vehicle?
              </h3>
              <p className="text-gray-600 mb-4">
                Contact us for more information or to schedule a test drive.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
