import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { useEffect, useRef } from "react";
import { Button } from "./components/ui/button";
import video from "@/assets/back.mp4";
const Font = () => {
  const main = useRef(null);
  const top = useRef(null);
  const bottom = useRef(null);
  const finalPath = "M 10 150 Q 500 150 990 150";

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: main.current,
        start: "50% 50%",
        end: "150% 50%",
        scrub: 2,
        pin: true,
      },
    });
    tl.to(
      top?.current,
      {
        top: "-50%",
      },
      "ff"
    );
    tl.to(
      bottom?.current,
      {
        bottom: "-50%",
      },
      "ff"
    )
      .to("#top h1", { top: "80%" }, "ff")
      .to("#bottom h1", { bottom: "80%" }, "ff")
      .to("#content", { top: "20%" }, "ff");

    const anothertl = gsap.timeline({
      scrollTrigger: {
        trigger: "#text-container",
        start: "20% 50%",
        end: "100% 50%",
        scrub: 2,
      },
    });
    anothertl.to("#text", {
      width: "100%",
    });
    return () => {
      // Clean up GSAP timeline on unmount
      tl.kill();
    };
  }, []);
  return (
    <div data-scroll-container>
      <div className="h-[100vh] relative overflow-hidden" ref={main}>
        <div
          ref={top}
          id="top"
          className=" h-[50vh] absolute  top-0 flex items-center 
          justify-center w-full bg-white overflow-hidden z-10"
        >
          <h1 className="text-[22vw] absolute top-[41.2%] font-semibold">
            ARPIT.
          </h1>
        </div>
        <div className="h-[100vh] bg-black text-white flex items-center justify-center relative">
          <div
            id="content"
            className=" flex flex-col items-center justify-center absolute top-[100%] w-full"
          >
            <h4 className="text-[10vw] font-semibold">Full Stack Developer</h4>
            <div
              className="h-[300px] w-[8/12] z-10 relative flex items-center justify-center"
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
            <h3 className="text-xl font-another">
              Who is Passinate about Devops and Web3
            </h3>
          </div>
        </div>
        <div
          ref={bottom}
          id="bottom"
          className=" h-[50vh] overflow-hidden absolute flex items-center 
          justify-center bottom-0  w-full bg-white"
        >
          <h1 className="text-[22vw] absolute bottom-[42%] font-semibold">
            ARPIT.
          </h1>
        </div>
      </div>
      <div
        id="text-container"
        className="h-[100vh] relative flex flex-col items-end justify-end overflow-hidden"
      >
        <div className="absolute text-[4vw] left-[25%] top-[20%]  opacity-[0.3] w-[100%]">
          About Me <br />
          Developer From Himachal Who <br />
          is always ready for challenges and <br />
          learn new tech.
        </div>
        <div
          id="text"
          className="absolute text-[4vw] left-[25%]   top-[20%] w-[0%] overflow-hidden"
          style={{ whiteSpace: "nowrap" }}
        >
          About Me <br />
          Developer From Himachal Who <br />
          is always ready for challenges and <br />
          learn new tech.
        </div>
        <div className="bg-black text-white h-[150px] w-full flex flex-col md:gap-2 py-5">
          <p className="text-center text-[20px]">👨🏼‍💻</p>
          <div className="w-full flex-1 flex items-center justify-around">
            <i className="ri-javascript-fill md:text-[40px]"></i>
            <i className="ri-reactjs-fill md:text-[40px]"></i>
            <i className="ri-nextjs-line md:text-[40px]"></i>
            <i className="ri-nodejs-fill md:text-[40px]"></i>
            <i className="ri-tailwind-css-fill md:text-[40px]"></i>
          </div>
        </div>
      </div>
      <div className="h-[100vh] w-full">
        <div className="flex flex-col items-end py-[1vh] px-[3vh]">
          <p className="text-[4vw]">My Work</p>
          <p className="text-[2vw] opacity-[0.4]">
            Projects <i className="ri-task-line text-[40px]"></i>
          </p>
        </div>
      </div>
      <div className="h-[82vh] flex flex-col">
        <p className="text-[5vw] text-center">Try Me</p>
        <div className="flex-1 flex items-center justify-center relative w-full overflow-hidden">
          <video
            id="video"
            src={video}
            autoPlay
            muted
            loop
            className="opacity-[0] absolute top-[50%] left-[50%] w-[100%]"
            style={{ transform: "translate(-50%,-50%)" }}
          ></video>
          <div className="cursor-pointer z-10 flex flex-col gap-2 py-[1vh] px-[2vh] bg-white">
            <p>Thinking of Future</p>
            <Button
              variant={"outline"}
              onMouseEnter={() => {
                gsap.to("#video", {
                  opacity: 1,
                  duration: 1,
                  ease: "circ.in",
                });
              }}
              onMouseLeave={() => {
                gsap.to("#video", {
                  opacity: 0,
                });
              }}
            >
              Take a Look
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl opacity-[0.3]">Take a look at my Github</p>
          <a href="" target="_blank">
            <i className="ri-github-fill text-[40px]"></i>
          </a>
        </div>
      </div>
      <div>
        <p className="py-[1vh] px-[2vh] text-center text-[1vw]">
          Made in India with 💗 by{" "}
          <a href="" target="_blank">
            Arpit Blagan
          </a>
        </p>
      </div>
    </div>
  );
};

export default Font;
