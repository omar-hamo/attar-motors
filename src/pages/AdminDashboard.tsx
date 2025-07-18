import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, LogOut, Car, Search } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase, Car as CarType } from "../lib/supabase";

import homeImage from "../assets/home-image.avif";
const BUCKET_NAME = "car-images"; // اسم البكت في Supabase Storage

// نوع جديد لتمثيل نوع السيارة
interface CarTypeOption {
  id: number;
  name: string;
}

const AdminDashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [cars, setCars] = useState<CarType[]>([]);
  // Remove local loading state, use loading from useAuth
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<CarType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCondition, setFilterCondition] = useState<
    "all" | "new" | "used"
  >("all");

  const [carTypes, setCarTypes] = useState<CarTypeOption[]>([]);
  const [carTypesLoading, setCarTypesLoading] = useState(true);
  const [newCarType, setNewCarType] = useState("");

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    engine_type: "",
    transmission: "",
    fuel_type: "",
    condition: "used" as "new" | "used",
    car_type_id: undefined as number | undefined,
    description: "",
    images: [""] as string[],
  });
  const [selectedImages, setSelectedImages] = useState<
    { file: File; preview: string }[]
  >([]);

  // جلب الأنواع من Supabase
  const fetchCarTypes = async () => {
    setCarTypesLoading(true);
    const { data, error } = await supabase.from("car_types").select("*");
    if (!error && data) {
      console.log("Fetched car types:", data);
      setCarTypes(data); // id is number
    }
    setCarTypesLoading(false);
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }
    if (!loading && user) {
      fetchCars();
      fetchCarTypes();
    }
  }, [user, loading, navigate]);

  // Ensure car_type_id is set to the first available type when carTypes change
  useEffect(() => {
    if (
      carTypes.length > 0 &&
      (formData.car_type_id === undefined ||
        !carTypes.some((t) => t.id === formData.car_type_id))
    ) {
      setFormData((prev) => ({ ...prev, car_type_id: carTypes[0].id }));
    }
  }, [carTypes]);

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
    } // No setLoading here, useAuth handles loading
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  // دالة رفع الصورة إلى Supabase Storage
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setSelectedImages((prev) => [...prev, ...filesArray]);
    }
  };

  // دالة حذف صورة من المعاينة:
  const removeImage = (idx: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let uploadedUrls: string[] = [];
    // ارفع الصور الجديدة فقط
    for (const img of selectedImages) {
      const fileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}_${img.file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, img.file);
      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(fileName);
        if (publicUrlData?.publicUrl) {
          uploadedUrls.push(publicUrlData.publicUrl);
        }
      }
    }
    // أضف الصور القديمة (في حال التعديل)
    if (editingCar && formData.images) {
      uploadedUrls = [...formData.images, ...uploadedUrls];
    }
    const carData = { ...formData, images: uploadedUrls };
    try {
      if (editingCar) {
        const { error } = await supabase
          .from("cars")
          .update(carData)
          .eq("id", editingCar.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cars").insert([carData]);
        if (error) throw error;
      }
      setShowForm(false);
      setEditingCar(null);
      resetForm();
      setSelectedImages([]);
      fetchCars();
    } catch (error) {
      console.error("Error saving car:", error);
    }
  };

  // إضافة نوع جديد
  const handleAddCarType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCarType.trim()) return;
    const { error } = await supabase
      .from("car_types")
      .insert([{ name: newCarType.trim() }]);
    if (!error) {
      setNewCarType("");
      fetchCarTypes();
    }
  };
  // حذف نوع
  const handleDeleteCarType = async (id: number) => {
    const { error } = await supabase.from("car_types").delete().eq("id", id);
    if (!error) fetchCarTypes();
  };

  const handleEdit = (car: CarType) => {
    setEditingCar(car);
    setFormData({
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      engine_type: car.engine_type,
      transmission: car.transmission,
      fuel_type: car.fuel_type,
      condition: car.condition,
      car_type_id: car.car_type_id,
      description: car.description,
      images: car.images,
    });
    setShowForm(true);
  };

  const handleDelete = async (carId: string) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        const { error } = await supabase.from("cars").delete().eq("id", carId);

        if (error) throw error;
        fetchCars();
      } catch (error) {
        console.error("Error deleting car:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      make: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      engine_type: "",
      transmission: "",
      fuel_type: "",
      condition: "used",
      car_type_id: carTypes[0]?.id,
      description: "",
      images: [],
    });
    setSelectedImages([]);
  };

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCondition =
      filterCondition === "all" || car.condition === filterCondition;
    return matchesSearch && matchesCondition;
  });

  const openForm = () => {
    if (carTypes.length === 0) {
      alert("Please add at least one car type before adding a new car.");
      return;
    }
    setShowForm(true);
    setEditingCar(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-attar-black">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-attar-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-attar-black">
      {/* Header */}
      <div className=" shadow-sm border-b-2 border-attar-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Car className="h-8 w-8 text-attar-red" />
              <h1 className="text-2xl font-bold text-attar-white">
                Admin Dashboard
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-attar-lightgray hover:text-attar-red hover:bg-attar-black rounded-lg transition-colors border border-attar-gray"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-attar-lightgray h-5 w-5" />
              <input
                type="text"
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-attar-gray rounded-lg focus:ring-2 focus:ring-attar-red focus:border-attar-red bg-attar-black text-attar-white placeholder-attar-lightgray"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={filterCondition}
              onChange={(e) =>
                setFilterCondition(e.target.value as "all" | "new" | "used")
              }
              className="px-4 py-2 border border-attar-gray rounded-lg focus:ring-2 focus:ring-attar-red focus:border-attar-red bg-attar-black text-attar-white"
            >
              <option value="all">All Conditions</option>
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>

            <button
              onClick={openForm}
              className="flex items-center space-x-2 px-4 py-2 bg-attar-red text-attar-white rounded-lg hover:bg-attar-black hover:text-attar-red border-2 border-attar-red transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Car</span>
            </button>
          </div>
        </div>

        {/* Car Form Modal */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-attar-black bg-opacity-80 flex items-center justify-center p-4 z-50"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-attar-gray rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-attar-black"
            >
              <h2 className="text-2xl font-bold mb-6 text-attar-white">
                {editingCar ? "Edit Car" : "Add New Car"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-attar-lightgray mb-1">
                      Make
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.make}
                      onChange={(e) =>
                        setFormData({ ...formData, make: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-attar-gray rounded-lg focus:ring-2 focus:ring-attar-red focus:border-attar-red bg-attar-black text-attar-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-attar-lightgray mb-1">
                      Model
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.model}
                      onChange={(e) =>
                        setFormData({ ...formData, model: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-attar-gray rounded-lg focus:ring-2 focus:ring-attar-red focus:border-attar-red bg-attar-black text-attar-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-attar-lightgray mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          year: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-attar-gray rounded-lg focus:ring-2 focus:ring-attar-red focus:border-attar-red bg-attar-black text-attar-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-attar-lightgray mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-attar-gray rounded-lg focus:ring-2 focus:ring-attar-red focus:border-attar-red bg-attar-black text-attar-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-attar-lightgray mb-1">
                      Mileage
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.mileage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mileage: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-attar-gray rounded-lg focus:ring-2 focus:ring-attar-red focus:border-attar-red bg-attar-black text-attar-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-attar-lightgray mb-1">
                      Engine Type
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.engine_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          engine_type: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-attar-gray rounded-lg focus:ring-2 focus:ring-attar-red focus:border-attar-red bg-attar-black text-attar-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-attar-lightgray mb-1">
                      Transmission
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.transmission}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          transmission: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-attar-gray rounded-lg focus:ring-2 focus:ring-attar-red focus:border-attar-red bg-attar-black text-attar-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-attar-lightgray mb-1">
                      Fuel Type
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fuel_type}
                      onChange={(e) =>
                        setFormData({ ...formData, fuel_type: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-attar-gray rounded-lg focus:ring-2 focus:ring-attar-red focus:border-attar-red bg-attar-black text-attar-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-attar-lightgray mb-1">
                      Condition
                    </label>
                    <select
                      value={formData.condition}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          condition: e.target.value as "new" | "used",
                        })
                      }
                      className="w-full px-3 py-2 border border-attar-gray rounded-lg focus:ring-2 focus:ring-attar-red focus:border-attar-red bg-attar-black text-attar-white"
                    >
                      <option value="new">New</option>
                      <option value="used">Used</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-attar-lightgray mb-1">
                      Car Type
                    </label>
                    {carTypesLoading ? (
                      <div className="text-attar-lightgray">
                        Loading car types...
                      </div>
                    ) : carTypes.length === 0 ? (
                      <div className="text-attar-red">
                        No car types found, please add one first.
                      </div>
                    ) : (
                      <select
                        value={formData.car_type_id ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            car_type_id: Number(e.target.value),
                          })
                        }
                        required
                        className="w-full px-3 py-2 border border-attar-gray rounded-lg focus:ring-2 focus:ring-attar-red focus:border-attar-red bg-attar-black text-attar-white"
                      >
                        <option value="" disabled>
                          Select car type
                        </option>
                        {carTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-attar-lightgray mb-2">
                    Car Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border border-attar-gray rounded-lg bg-attar-black text-attar-white"
                  />
                  {/* معاينة الصور الجديدة */}
                  {selectedImages.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedImages.map(
                        (img: { file: File; preview: string }, idx: number) => (
                          <div key={idx} className="relative">
                            <img
                              src={img.preview}
                              alt={`preview-${idx}`}
                              className="w-20 h-20 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-0 right-0 bg-attar-red text-attar-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  )}
                  {/* عرض الصور القديمة (في حال التعديل) */}
                  {formData.images.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.images.map((image, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="h-20 w-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = [...formData.images];
                              newImages.splice(index, 1);
                              setFormData({ ...formData, images: newImages });
                            }}
                            className="text-attar-red hover:bg-attar-gray rounded-full p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-attar-lightgray mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-attar-gray rounded-lg focus:ring-2 focus:ring-attar-red focus:border-attar-red bg-attar-black text-attar-white"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-attar-lightgray bg-attar-black rounded-lg hover:bg-attar-gray transition-colors border border-attar-gray"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-attar-red text-attar-white rounded-lg hover:bg-attar-black hover:text-attar-red border-2 border-attar-red transition-colors"
                  >
                    {editingCar ? "Update Car" : "Add Car"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* قسم إدارة الأنواع في الأعلى أو في صفحة منفصلة */}
        <div className="mb-8 p-4 bg-attar-gray rounded-lg">
          <h3 className="font-bold mb-2 text-attar-white">
            Car Types Management
          </h3>
          <form
            onSubmit={handleAddCarType}
            className="flex flex-col sm:flex-row gap-2 mb-2 w-full"
          >
            <input
              type="text"
              value={newCarType}
              onChange={(e) => setNewCarType(e.target.value)}
              placeholder="Enter new car type..."
              className="px-3 py-2 rounded border border-attar-gray bg-attar-black text-attar-white w-full"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-attar-red text-attar-white rounded w-full sm:w-auto"
            >
              Add
            </button>
          </form>
          <ul className="flex flex-wrap gap-2">
            {carTypes.map((type) => (
              <li
                key={type.id}
                className="flex items-center gap-1 bg-attar-black text-attar-white px-2 py-1 rounded whitespace-nowrap"
              >
                {type.name}
                <button
                  onClick={() => handleDeleteCarType(type.id)}
                  className="text-attar-red ml-1"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Cars Table */}
        <div className="bg-attar-gray rounded-2xl shadow-sm overflow-x-auto border-2 border-attar-black">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-attar-black">
              <thead className="bg-attar-black">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-attar-lightgray uppercase tracking-wider">
                    Car
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-attar-lightgray uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-attar-lightgray uppercase tracking-wider">
                    Condition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-attar-lightgray uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-attar-lightgray uppercase tracking-wider">
                    Car Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-attar-lightgray uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-attar-gray divide-y divide-attar-black">
                {filteredCars.map((car) => (
                  <tr
                    key={car.id}
                    className="hover:bg-gray-900 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-16 flex-shrink-0">
                          <img
                            className="h-12 w-16 object-cover rounded"
                            src={car.images[0] || homeImage}
                            alt={`${car.make} ${car.model}`}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-attar-white">
                            {car.make} {car.model}
                          </div>
                          <div className="text-sm text-attar-lightgray">
                            {car.mileage.toLocaleString()} km
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-attar-white">
                      ${car.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          car.condition === "new"
                            ? "bg-green-600 text-white"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {car.condition.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-attar-white">
                      {car.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-attar-white">
                      {carTypes.find((t) => t.id === car.car_type_id)?.name ||
                        "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(car)}
                          className="text-blue-600 hover:text-attar-white"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(car.id)}
                          className="text-attar-red hover:text-attar-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCars.length === 0 && (
            <div className="text-center py-12">
              <Car className="h-12 w-12 text-attar-gray mx-auto mb-4" />
              <h3 className="text-lg font-medium text-attar-white mb-2">
                No cars found
              </h3>
              <p className="text-attar-lightgray">
                Get started by adding your first car.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
