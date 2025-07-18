import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { supabase, Car } from "../lib/supabase";
import CarCard from "../components/CarCard";

const Cars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [conditionFilter, setConditionFilter] = useState<
    "all" | "new" | "used"
  >("all");
  const [carTypes, setCarTypes] = useState<{ id: number; name: string }[]>([]);
  const [carTypeFilter, setCarTypeFilter] = useState<number | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCars();
    fetchCarTypes();
  }, []);

  useEffect(() => {
    filterCars();
  }, [cars, searchTerm, priceRange, conditionFilter, carTypeFilter]);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error("Error fetching cars:", error);
      // If it's a configuration error, show helpful message
      if (
        error instanceof Error &&
        error.message?.includes("supabaseUrl is required")
      ) {
        setCars([]); // Set empty array to show no cars
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCarTypes = async () => {
    const { data, error } = await supabase.from("car_types").select("*");
    if (!error && data) setCarTypes(data);
  };

  const filterCars = () => {
    let filtered = cars.filter((car) => {
      const matchesSearch =
        car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice =
        car.price >= priceRange[0] && car.price <= priceRange[1];
      const matchesCondition =
        conditionFilter === "all" || car.condition === conditionFilter;
      const matchesCarType =
        carTypeFilter === "all" || car.car_type_id === carTypeFilter;
      return (
        matchesSearch && matchesPrice && matchesCondition && matchesCarType
      );
    });
    setFilteredCars(filtered);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-attar-black">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-attar-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-attar-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-attar-red mb-4">
            Browse Our Cars
          </h1>
          <p className="text-lg text-attar-lightgray">
            Discover quality used and new vehicles from our extensive collection
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-attar-gray rounded-lg shadow-sm p-6 mb-8 border-2 border-attar-gray"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-attar-lightgray h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by make or model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-attar-black rounded-lg focus:ring-2 focus:ring-attar-red focus:border-transparent bg-attar-black text-attar-white placeholder-attar-lightgray"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-attar-black text-attar-white rounded-lg hover:bg-attar-red hover:text-attar-white transition-colors border-2 border-attar-gray"
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t-2 border-attar-gray"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-attar-white mb-2">
                    Price Range: ${priceRange[0].toLocaleString()} - $
                    {priceRange[1].toLocaleString()}
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                      className="flex-1 accent-attar-red"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="flex-1 accent-attar-red"
                    />
                  </div>
                </div>

                {/* Condition Filter */}
                <div>
                  <label className="block text-sm font-medium text-attar-white mb-2">
                    Condition
                  </label>
                  <div className="flex gap-4 mb-4">
                    {(["all", "new", "used"] as const).map((condition) => (
                      <button
                        key={condition}
                        onClick={() => setConditionFilter(condition)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border-2 ${
                          conditionFilter === condition
                            ? "bg-attar-red text-attar-white border-attar-red"
                            : "bg-attar-black text-attar-white border-attar-gray hover:bg-attar-gray hover:text-attar-red"
                        }`}
                      >
                        {condition.charAt(0).toUpperCase() + condition.slice(1)}
                      </button>
                    ))}
                  </div>
                  <label className="block text-sm font-medium text-attar-white mb-2">
                    Car Type
                  </label>
                  <select
                    value={carTypeFilter}
                    onChange={(e) =>
                      setCarTypeFilter(
                        e.target.value === "all"
                          ? "all"
                          : Number(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-attar-gray rounded-lg focus:ring-2 focus:ring-attar-red focus:border-attar-red bg-attar-black text-attar-white"
                  >
                    <option value="all">All Types</option>
                    {carTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-attar-lightgray">
            Showing {filteredCars.length} of {cars.length} cars
          </p>
        </motion.div>

        {/* Cars Grid */}
        {filteredCars.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center py-12"
          >
            <div className="text-attar-gray">
              <Search className="h-16 w-16 mx-auto mb-4 text-attar-gray" />
              <h3 className="text-lg font-medium text-attar-white mb-2">
                No cars found
              </h3>
              <p className="text-attar-lightgray">
                Try adjusting your search criteria or filters
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            // initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredCars.map((car) => (
              <motion.div
                key={car.id}
                variants={itemVariants}
                className="hover:shadow-2xl hover:border-attar-red border-2 border-attar-gray transition-all duration-200 rounded-xl"
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Cars;
