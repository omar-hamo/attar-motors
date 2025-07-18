import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

const About = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus("success");
      setIsSubmitting(false);
      setFormData({ name: "", email: "", message: "" });
    }, 1000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
      link: "tel:+15551234567",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@attarmotors.com", "sales@attarmotors.com"],
      link: "mailto:info@attarmotors.com",
    },
    {
      icon: MapPin,
      title: "Address",
      details: ["123 Car Street", "Automotive District", "City, State 12345"],
      link: "https://maps.google.com",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: [
        "Mon-Fri: 9:00 AM - 6:00 PM",
        "Sat: 10:00 AM - 4:00 PM",
        "Sun: Closed",
      ],
      link: null,
    },
  ];

  return (
    <div className="min-h-screen bg-attar-black">
      {/* Hero Section */}
      <section className="bg-attar-black text-attar-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Attar Motors
            </h1>
            <p className="text-xl text-attar-lightgray max-w-3xl mx-auto">
              Your trusted partner in quality used and new car trading. We're
              committed to providing exceptional service and the best vehicles
              for our customers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Description */}
      <section className="py-20 bg-attar-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-attar-white mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-lg text-attar-lightgray">
                <p>
                  Founded with a passion for quality vehicles and exceptional
                  customer service, Attar Motors has been serving the community
                  for over a decade. We understand that buying a car is one of
                  the most important decisions you'll make, and we're here to
                  make that process as smooth and enjoyable as possible.
                </p>
                <p>
                  Our team of experienced professionals is dedicated to helping
                  you find the perfect vehicle that fits your needs and budget.
                  Whether you're looking for a reliable used car or a brand new
                  vehicle, we have a wide selection to choose from.
                </p>
                <p>
                  We pride ourselves on our transparent pricing, thorough
                  vehicle inspections, and commitment to customer satisfaction.
                  Every vehicle in our inventory undergoes rigorous quality
                  checks to ensure you get the best value for your investment.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Attar Motors Showroom"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl border-4 border-attar-red"
              />
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-attar-red rounded-2xl -z-10 opacity-80"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-attar-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-attar-white mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-attar-lightgray max-w-3xl mx-auto">
              We'd love to hear from you. Contact us for any questions about our
              vehicles or services.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 rounded-xl bg-attar-gray hover:bg-attar-gray hover:shadow-lg transition-all duration-300 border-2 border-attar-gray hover:border-attar-red"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-attar-red text-attar-white rounded-full mb-6">
                  <info.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-attar-white mb-4">
                  {info.title}
                </h3>
                <div className="space-y-2">
                  {info.details.map((detail, detailIndex) => (
                    <div key={detailIndex}>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-attar-lightgray hover:text-attar-red transition-colors"
                        >
                          {detail}
                        </a>
                      ) : (
                        <p className="text-attar-lightgray">{detail}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
