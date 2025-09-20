//import React from "react"; 
import { Row, Col, Image } from "react-bootstrap";
import { motion } from "framer-motion";
import sideSweet from "../assets/side sweet.png";
import allProductsImg from "../assets/allsweets.jpg";
import sweetsImg from "../assets/Burfi.png";
import biscottiImg from "../assets/AlmondBiscotti02.jpg";
import sugarFreeImg from "../assets/sugarfree.png";
import teaTimeImg from "../assets/TeaTime.jpg";
import cakeImg from "../assets/cake.jpg";

// Import fonts in index.html or _app.js
// <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=DM+Serif+Text:ital,wght@0,400;1,400&display=swap" rel="stylesheet" />

const HeroSection = () => {
  const featureIconStyle = {
    fontSize: "40px",
    color: "#f7c442",
  };

  const featureTextStyle = {
    fontSize: "15px",
    marginTop: "0.5rem",
    fontFamily: "DM Serif Text, serif",
    fontWeight: 600,
  };

  const categoryTitleStyle = {
    fontSize: "1.1rem",
    fontWeight: "bold",
    fontFamily: "DM Serif Text, serif",
  };

  const categoryCountStyle = {
    fontSize: "0.9rem",
    color: "#8a8a8a",
    fontFamily: "DM Serif Text, serif",
    fontStyle: "italic",
  };

  // Animation Variants
  const containerVariant = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const popInVariant = {
    hidden: { opacity: 0, scale: 0.6 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFBF5",
        paddingTop: "3rem",
        paddingBottom: "3rem",
        textAlign: "center",
        color: "#2e2b3d",
        width: "100%",
        marginTop: "100px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Title */}
      <motion.h2
        className="fw-bold mb-5 d-flex align-items-center justify-content-center gap-2 great-vibes-heading"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.img
          src={sideSweet}
          alt="Side sweet"
          style={{ height: "40px" }}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
        <span>Sweets</span>
        <motion.img
          src={sideSweet}
          alt="Side sweet"
          style={{ height: "40px" }}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
      </motion.h2>

      {/* Features Row */}
      <motion.div
        variants={containerVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <Row className="mb-5 justify-content-center mx-0">
          {[
            { icon: "fa-truck", text: "National Shipping in 5–7 days" },
            { icon: "fa-clock", text: "15 Days Shelf Life" },
            { icon: "fa-globe", text: "Global Customers" },
            { icon: "fa-leaf", text: "No Preservatives" },
          ].map((f, idx) => (
            <Col key={idx} xs={6} sm={3} md={2} className="mb-4">
              <motion.div variants={popInVariant}>
                <i className={`fa ${f.icon}`} style={featureIconStyle}></i>
                <p style={featureTextStyle}>{f.text}</p>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.div>

      {/* Product Categories */}
      <motion.div
        className="w-100 px-3 px-md-5"
        variants={containerVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <Row className="g-4 justify-content-center mx-0">
          {[
            { title: "All Products", count: 97, image: allProductsImg },
            { title: "Sweets", count: 45, image: sweetsImg },
            { title: "Indian Biscotti", count: 6, image: biscottiImg },
            { title: "Sugar Free", count: 17, image: sugarFreeImg },
            { title: "Tea Time Snacks", count: 22, image: teaTimeImg },
            { title: "Cake", count: 32, image: cakeImg },
          ].map((item, idx) => (
            <Col key={idx} xs={6} sm={4} md={2} className="text-center">
              <motion.div
                variants={fadeUpVariant}
                whileHover={{
                  scale: 1.08,
                  rotate: 1,
                  boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  overflow: "hidden",
                  borderRadius: "16px",
                  marginBottom: "0.5rem",
                  backgroundColor: "#fff",
                }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </motion.div>
              <h6 style={categoryTitleStyle}>{item.title}</h6>
              <p style={categoryCountStyle}>{item.count} Products</p>
            </Col>
          ))}
        </Row>
      </motion.div>

      {/* Scoped CSS */}
      <style jsx>{`
        .great-vibes-heading {
          font-family: "Great Vibes", cursive !important;
          font-weight: 400;
          font-style: normal;
          font-size: 4rem;
          color: #d97706;
          letter-spacing: 2px;
          text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
