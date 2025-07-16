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
      <div className="min-h-screen flex items-center justify-center bg-attar-black">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-attar-red"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-attar-black">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-attar-white mb-4">
            Car not found
          </h2>
          <Link
            to="/cars"
            className="inline-flex items-center text-attar-lightgray hover:text-attar-red hover:underline px-4 py-2 rounded transition-colors"
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
    <div className="min-h-screen bg-attar-black py-8">
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
            className="inline-flex items-center text-attar-lightgray hover:text-attar-red hover:underline px-4 py-2 rounded transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cars
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
            <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden mb-4 border-4 border-attar-gray">
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
                  className={`px-3 py-1 text-sm font-semibold rounded-full shadow-lg border-2 ${
                    car.condition === "new"
                      ? "bg-attar-red text-attar-white border-attar-red shadow-attar-red/30"
                      : "bg-attar-gray text-attar-white border-attar-gray shadow-attar-gray/30"
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
                        ? "border-attar-red"
                        : "border-attar-gray hover:border-attar-red"
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
              <h1 className="text-3xl md:text-4xl font-bold text-attar-white mb-2">
                {car.make} {car.model}
              </h1>
              <p className="text-xl text-attar-lightgray mb-4">
                {car.year} •{" "}
                {car.condition.charAt(0).toUpperCase() + car.condition.slice(1)}
              </p>
              <div className="text-3xl font-bold text-attar-red">
                ${car.price.toLocaleString()}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-attar-white mb-3">
                Description
              </h3>
              <p className="text-attar-lightgray leading-relaxed">
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
              <h3 className="text-lg font-semibold text-attar-white mb-4">
                Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specs.map((spec, index) => (
                  <motion.div
                    key={spec.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="flex items-center p-4 bg-attar-gray rounded-lg shadow-sm border-2 border-attar-black hover:border-attar-red hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-attar-black text-attar-red rounded-lg mr-4 border-2 border-attar-gray">
                      <spec.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-attar-lightgray">
                        {spec.label}
                      </div>
                      <div className="font-semibold text-attar-white">
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
              className="bg-attar-red rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-attar-white mb-3">
                Interested in this vehicle?
              </h3>
              <p className="text-attar-white mb-4">
                Contact us for more information or to schedule a test drive.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-6 py-3 bg-attar-black text-attar-white font-semibold rounded-lg hover:bg-attar-gray hover:text-attar-red border-2 border-attar-black transition-colors duration-200"
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
