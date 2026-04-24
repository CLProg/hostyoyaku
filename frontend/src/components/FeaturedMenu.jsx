import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../Style/FeaturedMenu.css";

function FeaturedMenu() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_URL}/api/products/featured`,
        );
        setFeaturedItems(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFeatured();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Desktop
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // Tablet
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // Mobile
        settings: {
          slidesToShow: 1, // <--- CHANGE THIS TO 1
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "20px", // Gives a little peek of the next card
        },
      },
    ],
  };

  return (
    <section className="featured-menu">
      <h2>FEATURED ITEMS</h2>

      <div className="carousel-container">
        <Slider {...settings}>
          {featuredItems.map((item) => (
            <div key={item.id} className="menu-card-wrapper">
              <div className="menu-card">
                <img
                  src={`${import.meta.env.VITE_APP_URL || "https://hostyoyaku.onrender.com"}${item.image_url}`}
                  alt={item.name}
                />
                <span>{item.name}</span>
                <small>₱{item.price}</small>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* This button now takes the user to the Full Menu component */}
      <button className="all-menu-btn" onClick={() => navigate("/menu")}>
        VIEW FULL MENU
      </button>
    </section>
  );
}

export default FeaturedMenu;
