import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Star } from "lucide-react";
import homeImage from "../assets/home-image.avif";

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: "Trusted Quality",
      description: "All our vehicles undergo rigorous quality checks",
    },
    {
      icon: Clock,
      title: "Quick Service",
      description: "Fast and efficient car trading process",
    },
    {
      icon: Star,
      title: "Best Prices",
      description: "Competitive pricing for both new and used cars",
    },
  ];

  return (
    <div className="min-h-screen bg-attar-black">
      {/* Hero Section */}
      <section className="relative bg-attar-black text-attar-white overflow-hidden">
        <div className="absolute inset-0 bg-attar-black opacity-70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-attar-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-attar-red">DRIVE PRESTIGE.</span>
                <span className="block text-attar-white">DRIVE ATTAR.</span>
              </motion.h1>

              <motion.p
                className="mt-6 text-xl text-attar-lightgray max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                DISCOVER THE NEWEST MODELS. Experience luxury, reliability, and
                unmatched service with Attar Motors.
              </motion.p>

              <motion.div
                className="mt-8 flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link
                  to="/cars"
                  className="inline-flex items-center justify-center px-8 py-4 bg-attar-red text-attar-white font-semibold rounded-lg hover:bg-attar-black hover:text-attar-red border-2 border-attar-red transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Browse Cars
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-attar-red text-attar-red font-semibold rounded-lg hover:bg-attar-red hover:text-attar-white transition-colors duration-200"
                >
                  Learn More
                </Link>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative z-10">
                <img
                  src={homeImage}
                  alt="Luxury Car"
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl border-4 border-attar-gray hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute -bottom-4 -right-5 w-full h-full bg-attar-red rounded-2xl z-0 opacity-80"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-attar-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-attar-red mb-4">
              Why Choose Attar Motors?
            </h2>
            <p className="text-xl text-attar-lightgray max-w-3xl mx-auto">
              We're committed to providing the best car trading experience with
              quality vehicles and exceptional service.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-8 rounded-xl bg-attar-black hover:bg-attar-gray hover:shadow-lg transition-all duration-300 border-2 border-attar-gray hover:border-attar-red"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-attar-red text-attar-white rounded-full mb-6 border-2 border-attar-black">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-attar-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-attar-lightgray">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-attar-red text-attar-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-attar-black">
              Accelerate Your Lifestyle
            </h2>
            <p className="text-xl text-attar-white mb-8 max-w-2xl mx-auto">
              Browse our extensive collection of quality vehicles and find the
              perfect match for your needs.
            </p>
            <Link
              to="/cars"
              className="inline-flex items-center justify-center px-8 py-4 bg-attar-black text-attar-white font-semibold rounded-lg hover:bg-attar-gray hover:text-attar-red border-2 border-attar-black transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Start Browsing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
