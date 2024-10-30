import React from "react";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import Carousel1 from "../../Images/Carousel/Carou1.jpg";
import Carousel2 from "../../Images/Carousel/Carou2.jpg";
import Carousel3 from "../../Images/Carousel/Carou3.jpg";

function HeroSection() {
  return (
    <div className="hero-section">
      <Carousel fade interval={2000}>
        <Carousel.Item>
          <img
            className="d-block w-100 -mb-20 zoom"
            src={Carousel1}
            alt="First slide"
          />
          <Carousel.Caption className="pb-2">
            <h1 className="text-xl md:text-3xl lg:text-4xl">Coming soon</h1>
            <p className="text-sm md:text-lg lg:text-xl">
              Nulla vitae elit libero, a pharetra augue mollis interdum.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 -mb-20 zoom"
            src={Carousel2}
            alt="Second slide"
          />
          <Carousel.Caption className="pb-2">
            <h1 className="text-xl md:text-3xl lg:text-4xl">Coming soon</h1>
            <p className="text-sm md:text-lg lg:text-xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 -mb-20 zoom"
            src={Carousel3}
            alt="Third slide"
          />
          <Carousel.Caption className="pb-2">
            <h1 className="text-xl md:text-3xl lg:text-4xl">Coming soon</h1>
            <p className="text-sm md:text-lg lg:text-xl">
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default HeroSection;
