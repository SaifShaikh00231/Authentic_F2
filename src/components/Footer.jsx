// D:\SweetShopp_Saif\sweet-shop-frontend\src\components\Footer.jsx
import React from "react";
import { motion } from "framer-motion";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  const socialLinks = [
    { icon: "fa-brands fa-github", url: "https://github.com/SaifShaikh00231" },
    {
      icon: "fa-brands fa-linkedin",
      url: "https://linkedin.com/in/saif-shaikh-a0a4252a7",
    },
    {
      icon: "fa-solid fa-globe",
      url: "https://saifshaikh00231.github.io/SaifPortfolio/",
    },
    { icon: "fa-solid fa-envelope", url: "mailto:your@email.com" },
  ];

  return (
    <footer className="footer-section">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
            <motion.h4
              className="footer-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Developed with ❤️ by <span>Saif Shaikh</span>
            </motion.h4>
            <motion.p
              className="footer-info"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              📍 Location: India <br />
              ✉️ Email: saifshaikh00231@email.com
            </motion.p>
          </Col>

          <Col md={6} className="text-center text-md-end">
            <motion.div
              className="social-icons d-flex justify-content-center justify-content-md-end gap-3"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <i className={link.icon}></i>
                </motion.a>
              ))}
            </motion.div>
          </Col>
        </Row>
        <Row>
          <Col>
            <motion.div
              className="footer-bottom text-center mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <p>© {new Date().getFullYear()} Authentic Sweets | All Rights Reserved.</p>
            </motion.div>
          </Col>
        </Row>
      </Container>

      
      <style jsx>{`
        .footer-section {
  background: linear-gradient(135deg, #192b54, #0d1730);
  color: #fdfdfd;
  padding: 1.5rem 1rem;
  font-family: "DM Serif Text", serif;
}

        }
        .footer-title {
          font-family: "Great Vibes", cursive;
          font-size: 2rem;
          color: #f7c442;
        }
        .footer-title span {
          color: #ffdd55;
        }
        .footer-info {
          font-size: 0.95rem;
          line-height: 1.6;
          font-family: "DM Serif Text", serif;
          opacity: 0.9;
        }
        .social-icons .social-icon {
          font-size: 1.5rem;
          color: #fdfdfd;
          transition: color 0.3s ease;
        }
        .social-icons .social-icon:hover {
          color: #f7c442;
        }
        .footer-bottom {
          font-size: 0.85rem;
          opacity: 0.8;
          font-family: "Poppins", sans-serif;
        }
        .floating-sweet-footer {
          position: absolute;
          font-size: 2rem;
          bottom: 20px;
          left: 10%;
          opacity: 0.3;
        }
        .floating-sweet-footer.second {
          left: 50%;
          bottom: 40px;
          font-size: 1.8rem;
        }
        .floating-sweet-footer.third {
          right: 15%;
          bottom: 30px;
          font-size: 2.2rem;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
