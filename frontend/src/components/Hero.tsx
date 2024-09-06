import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const Hero = () => {
  const dd = useRef(null);
  function createStars(type: any, quantity: any) {
    for (let i = 0; i < quantity; i++) {
      var star = document.createElement("div");
      star.classList.add("star", `type-${type}`);
      star.style.left = `${randomNumber(1, 99)}%`;
      star.style.bottom = `${randomNumber(1, 99)}%`;
      star.style.animationDuration = `${randomNumber(50, 200)}s`;
      //@ts-ignore
      dd?.current?.appendChild(star);
    }
  }
  function randomNumber(min: any, max: any) {
    return Math.floor(Math.random() * max) + min;
  }
  const finalPath = "M 10 150 Q 500 150 990 150";
  useEffect(() => {
    createStars(1, 100);
    createStars(2, 90);
    createStars(3, 100);
  }, []);
  // useEffect(() => {
  //   gsap.to("#page2 p", {
  //     transform: "translate(-100%)",
  //     duration: 0.2,
  //     scrollTrigger: {
  //       trigger: "#page2",
  //       scroller: "body",
  //       start: "top 0%",
  //       end: "top -3%",
  //       scrub: 3,
  //       pin: true,
  //       markers: true,
  //     },
  //   });
  // }, []);

  return (
    <div
      ref={dd}
      className="
    flex items-center justify-center flex-col gap-5  px-4  rounded-t-xl overflow-x-hidden"
    >
      <motion.p
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=" text-[30px] md:text-[40px] text-center"
      >
        Stock market app for investors, offering a convenient way to manage
        investments and access real-time market data.
      </motion.p>
      <p className="text-center text-[20px] md:text-[30px]">
        <Typewriter
          options={{
            strings: [
              "Charts intergration",
              "Real-time data",
              "User friendly UI",
            ],
            autoStart: true,
            loop: true,
            wrapperClassName: "typewriter-wrapper",
            cursorClassName: "typewriter-cursor",
          }}
        />
      </p>
      <div
        className="h-[300px] w-[1000px] z-10 relative flex items-center justify-center"
        onMouseMove={(event) => {
          const div = event.currentTarget;
          // Calculate mouse position relative to the div
          const rect = div.getBoundingClientRect();
          const mouseX = event.clientX - rect.left;
          const mouseY = event.clientY - rect.top;

          console.log({ mouseX, mouseY });
          let pathe = `M 10 150 Q ${mouseX} ${mouseY} 990 150`;
          gsap.to("svg path", {
            attr: { d: pathe },
            duration: 0.3,
            ease: "power3.out",
          });
        }}
        onMouseLeave={() => {
          console.log("leave");
          gsap.to("svg path", {
            attr: { d: finalPath },
            duration: 1.2,
            ease: "elastic.out(1.0.2)",
          });
        }}
      >
        <svg width="1000" height="300">
          <path
            d="M 10 150 Q 500 150 990 150"
            stroke="white"
            fill="transparent"
          />
        </svg>
      </div>
      <Link
        to="/coins"
        className="glow-on-hover text-white text-[20px] flex items-center justify-center z-10"
      >
        Coins
      </Link>
      {/* <div
        className="min-h-[50dvh] flex items-center overflow-x-hidden bg-red-500"
        id="page2"
      >
        <p className="text-[35vw] bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-transparent bg-clip-text">
          EXPERIENCE
        </p>
      </div> */}
    </div>
  );
};

export default Hero;
