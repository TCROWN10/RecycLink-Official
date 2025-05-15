import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import Navbar from "../components/Navbar";
import Recycle from "../components/Recycle";
import Reward from "../components/Reward";
import Faq from "../components/Faq";
import Future from "../components/Future";
import Bottom from "../components/Bottom";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Logo from "../components/Logo";
import { WasteWise } from "../components/WasteWise";
import SignUpButton from "../components/SignUpButton";
import SDG from "../components/SDG";
import recycle1 from "../assets/transparent_recycle2 2.png";
import {
  community,
  // plasticOnEarth,
  // plasticInOcean,
  // plasticOnLand,
  // tr1hd,
  // wasteOnLand,
} from "../assets";

const TextReplacementAnimation = () => {
  const replacementTexts = [
    'Track',
    'Trade',
    'Earn',
    'Sustainably!'
  ];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => 
        (prevIndex + 1) % replacementTexts.length
      );
    }, 2000); // Change text every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-12 sm:h-16 md:h-20 lg:h-24">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentTextIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ 
            duration: 0.5,
            type: "spring",
            stiffness: 100
          }}
          className="absolute text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#824d9f] to-[#d800ff] inline-block text-transparent bg-clip-text"
        >
          {replacementTexts[currentTextIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

const RollingImage = () => {
  return (
    <motion.img
      src="https://res.cloudinary.com/detc4yjdi/image/upload/v1743679466/Home_z53wh7.png"
      alt="Image of recycling"
      className="w-full lg:w-11/12"
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        duration: 20,
        ease: "linear",
        repeat: Infinity,
      }}
    />
  );
};

const Landing = () => {
  return (
    <section>
      <Navbar />
      
      {/* Hero Section */}
      <div className="hero before:top-0 before:-hue-rotate-90 before:absolute lg:before:scale-100 lg:before:top-0 before:start-1/2 before:bg-[url('https://preline.co/assets/svg/examples/polygon-bg-element.svg')] before:bg-no-repeat before:bg-top before:bg-cover before:w-full before:h-full before:-z-[1] before:transform before:-translate-x-1/2 dark:before:bg-[url('https://preline.co/assets/svg/examples/polygon-bg-element-dark.svg')] dark:before:opacity-30">
        <div className="hero-content text-left w-full min-w-full flex flex-col lg:flex-row lg:space-x-8">
          <div className="w-full px-2 pt-12 lg:px-12 lg:py-40">
            <div className="min-w-6/12">
              <div className="w-full px-4 md:px-6 lg:px-8">
                <h1 className="text-center lg:text-left max-w-6xl mx-auto">
                  {/* <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium mb-2 md:mb-4">
                    Revolutionizing Recycling with Web3
                  </div> */}
                  <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start space-y-2 lg:space-y-0 lg:space-x-3">
                    <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                    Revolutionizing Recycling with Web3
                    <TextReplacementAnimation />
                    </div>
                  </div>
                </h1>
              </div>
              <div className="space-y-4 w-full py-6 text-2xl text-center lg:w-8/12 lg:text-2xl lg:text-left lg:py-12">
                <p>
                  Let's collaborate to build a more sustainable future. Together, we can make a difference—one recycled plastic at a time!
                </p>
                <p className="text-2xl lg:text-2xl">
                  Be part of the movement to turn plastic waste into valuable resources!
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-x-hidden self-stretch flex flex-col items-end justify-center w-full before:-hue-rotate-90 before:absolute before:top-0 before:right-0 before:start-1/2 before:bg-[url('https://preline.co/assets/svg/component/squared-bg-element.svg')] before:bg-no-repeat before:bg-top before:bg-right before:w-full before:h-full before:-z-[1] before:transform before:-translate-x-1/2 dark:before:bg-[url('https://preline.co/assets/svg/component/squared-bg-element-dark.svg')]">
            <RollingImage />
          </div>
        </div>
      </div>

      {/* Environmental Impact Section */}
      <section className="mt-20 lg:m-0">
        <div className="text-center">
          Make smart choices—locate our recycling partners, dispose of your waste responsibly, and earn rewards for your efforts!
        </div>
        <div className="text-center text-4xl font-bold px-2 py-5">
          Play your role in protecting the planet from plastic pollution.
          <br />
        </div>
        <div className="text-center text-2xl pt-6">
          Plastic pollution affects the environment in the following ways:
        </div>

        <SDG
          title="Effects on Marine Ecosystems"
          content="Poor Plastic Recycling Can Harm the Environment  
                  When plastics are not recycled correctly, they often end up in landfills, 
                  oceans, and natural habitats, posing a threat to wildlife and ecosystems."
        >
          <img
            src="https://res.cloudinary.com/detc4yjdi/image/upload/v1743679474/plasticDestructionOcean_en1ort.jpg"
            alt="Plastic in the ocean"
            className="relative h-full rounded-xl lg:rounded-3xl object-cover object-center"
          />
        </SDG>

        <SDG
          title="Effects on Animal Life"
          content="Improper plastic recycling poses a serious threat to the environment. 
          When not disposed of correctly, plastics accumulate in landfills, pollute oceans, 
          and disrupt natural habitats, endangering wildlife and ecosystems."
        >
          <img
            src="https://res.cloudinary.com/detc4yjdi/image/upload/v1743679473/plasticDestructionEarth_m2hh2s.jpg"
            alt="Plastic on earth"
            className="relative h-full rounded-xl lg:rounded-3xl object-cover object-center"
          />
        </SDG>

        <SDG
          title="Effects on Terrestrial Ecosystems"
          content="Plastics that are not properly recycled can release toxic chemicals into the environment,
           leading to air and water pollution. Additionally, burning plastics emits greenhouse gases,
            accelerating climate change and contributing to global warming."
          reverse={true}
        >
          <img
            src="https://res.cloudinary.com/detc4yjdi/image/upload/v1743679474/plasticDestructionWater_f9borx.jpg"
            alt="Plastic on land"
            className="relative h-full rounded-xl lg:rounded-3xl object-cover object-center"
          />
        </SDG>

        <SDG
          title="Effects on the Ecosystem"
          content="Proper plastic recycling is essential to minimizing environmental harm.
           Following local recycling guidelines helps ensure effective waste management. 
           Additionally, reducing plastic use by opting for reusable bags, bottles, 
           and containers can significantly cut down plastic waste and pollution."
        >
          <img
            src="https://res.cloudinary.com/detc4yjdi/image/upload/v1743679479/waste_on_land_rrxjp5.jpg"
            alt="Plastic on land"
            className="relative h-full rounded-xl lg:rounded-3xl object-cover object-center"
          />
        </SDG>
      </section>

      {/* SDG Quote Section */}
      <div className="w-full p-4 text-center mx-auto my-24 lg:w-8/12 lg:my-32">
        <blockquote className="relative">
          <svg
            className="absolute top-0 start-0 transform -translate-x-8 -translate-y-4 h-24 w-24 text-base-200 dark:text-gray-700"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M7.39762 10.11c0 .926-.756 1.681-1.681 1.681S0 11.036 0 10.111C0 9.186.756 8.43 1.68 8.43h1.682v1.68zm.846 0c0-.924.756-1.68 1.681-1.68s1.681.756 1.681 1.68v4.21c0 .924-.756 1.68-1.68 1.68a1.685 1.685 0 0 1-1.682-1.68v-4.21zM5.89 3.362c-.926 0-1.682-.756-1.682-1.681S4.964 0 5.89 0s1.68.756 1.68 1.68v1.682H5.89zm0 .846c.924 0 1.68.756 1.68 1.681S6.814 7.57 5.89 7.57H1.68C.757 7.57 0 6.814 0 5.89c0-.926.756-1.682 1.68-1.682h4.21zm6.749 1.682c0-.926.755-1.682 1.68-1.682.925 0 1.681.756 1.681 1.681s-.756 1.681-1.68 1.681h-1.681V5.89zm-.848 0c0 .924-.755 1.68-1.68 1.68A1.685 1.685 0 0 1 8.43 5.89V1.68C8.43.757 9.186 0 10.11 0c.926 0 1.681.756 1.681 1.68v4.21zm-1.681 6.748c.926 0 1.682.756 1.682 1.681S11.036 16 10.11 16s-1.681-.756-1.681-1.68v-1.682h1.68zm0-.847c-.924 0-1.68-.755-1.68-1.68 0-.925.756-1.681 1.68-1.681h4.21c.924 0 1.68.756 1.68 1.68 0 .926-.756 1.681-1.68 1.681h-4.21z"
              fill="currentColor"
            />
          </svg>

          <div className="relative z-[1]">
            <p className="text-xs font-semibold text-gray-500 tracking-wide uppercase mb-3 dark:text-gray-200">
              Sustainable Development Goals
            </p>

            <p className="text-xl font-medium italic text-gray-800 md:text-2xl md:leading-normal xl:text-3xl xl:leading-normal dark:text-gray-200">
              The SDGs are a call to action for all countries - developed and
              developing - to work together to achieve a sustainable future for
              all.
            </p>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              You can learn more about the SDGs on the United Nations
              Development Programme website1
              https://www.undp.org/sustainable-development-goals
            </p>
          </div>
        </blockquote>
      </div>

      {/* Mission Section */}
      <section className="hero min-h-screen bg-base-200">
        <div className="relative max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <blockquote className="text-center lg:mx-auto lg:w-3/5">
            <div className="mx-auto w-20 h-auto sm:w-28 text-gray-800 text-xl font-semibold dark:text-gray-200">
              Our Mission
            </div>

            <div className="mt-6 lg:mt-10">
              <p className="relative text-xl sm:text-2xl md:text-3xl md:leading-normal font-medium text-gray-800">
                <svg
                  className="absolute top-0 start-0 transform -translate-x-8 -translate-y-8 h-16 w-16 text-base-300 sm:h-24 sm:w-24 dark:text-gray-700"
                  width="16"
                  height="13"
                  viewBox="0 0 16 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M7.18079 9.25611c0 .926-.756 1.681-1.681 1.681S0 11.036 0 10.111C0 9.186.756 8.43 1.68 8.43h1.682v1.68zm.846 0c0-.924.756-1.68 1.681-1.68s1.681.756 1.681 1.68v4.21c0 .924-.756 1.68-1.68 1.68a1.685 1.685 0 0 1-1.682-1.68v-4.21zM5.89 3.362c-.926 0-1.682-.756-1.682-1.681S4.964 0 5.89 0s1.68.756 1.68 1.68v1.682H5.89zm0 .846c.924 0 1.68.756 1.68 1.681S6.814 7.57 5.89 7.57H1.68C.757 7.57 0 6.814 0 5.89c0-.926.756-1.682 1.68-1.682h4.21zm6.749 1.682c0-.926.755-1.682 1.68-1.682.925 0 1.681.756 1.681 1.681s-.756 1.681-1.68 1.681h-1.681V5.89zm-.848 0c0 .924-.755 1.68-1.68 1.68A1.685 1.685 0 0 1 8.43 5.89V1.68C8.43.757 9.186 0 10.11 0c.926 0 1.681.756 1.681 1.68v4.21zm-1.681 6.748c.926 0 1.682.756 1.682 1.681S11.036 16 10.11 16s-1.681-.756-1.681-1.68v-1.682h1.68zm0-.847c-.924 0-1.68-.755-1.68-1.68 0-.925.756-1.681 1.68-1.681h4.21c.924 0 1.68.756 1.68 1.68 0 .926-.756 1.681-1.68 1.681h-4.21z"
                    fill="currentColor"
                  />
                </svg>
                <span className="relative z-[1] italic text-gray-800 dark:text-neutral-content">
                  Our mission is to incentivize people for disposing their waste
                  with a focus on plastics in accordance with the Sustainable
                  development goals (SDG 3, 6, 11, 14 and 15). RecycLink aims
                  to help foster a generation that will be known for reducing
                  the effect of plastic. With an aim to target campuses and
                  institutions, with the incentives to recycle, keep the
                  environment clean and reduce climate action. RecycLink aims
                  makes saving the planet a rewarding activity.
                </span>
              </p>
            </div>

            <footer className="mt-6">
              <div className="font-semibold text-gray-800 dark:text-neutral-content">
                RecycLink Team
              </div>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Hidden Roadmap Section */}
      <section className="hero min-h-screen bg-base-100 hidden">
        <div className="relative max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <blockquote className="text-center lg:mx-auto lg:w-3/5">
            <div className="mx-auto w-20 h-auto sm:w-28 text-gray-800 text-xl font-semibold dark:text-gray-200">
              Our Roadmap
            </div>

            <div className="mt-6 lg:mt-10">
              <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
                <li>
                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="timeline-start md:text-end mb-10">
                    <time className="font-mono italic">March 2025</time>
                    <div className="text-lg font-black">
                      RecycLink is born
                    </div>
                    We launched RecycLink with a mission to help fight against
                    plastic pollution on the earth. With our target on the youth
                    who we believe will be crucial to the next plastic-free
                    generation.
                  </div>
                  <hr className="bg-primary" />
                </li>
                <li>
                  <hr className="bg-primary" />
                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="timeline-end md:text-start mb-10">
                    <time className="font-mono italic">April 2025</time>
                    <div className="text-lg font-black">Launch RecycLink </div>
                    We aim to go live with RecycLink on mainnet after weeks
                    of rigorous testing, analysis and professional vetting and a
                    round of alpha and beta testers.
                  </div>
                  <hr />
                </li>
                <li>
                  <hr />
                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="timeline-start md:text-end mb-10">
                    <time className="font-mono italic">May 2025</time>
                    <div className="text-lg font-black">RecycLink Blog</div>
                    Information is Power. RecycLink plans to have a blog that
                    creates awareness about the environment. There will be a
                    weekly blog release about how plastic pollution have caused
                    havoc to the environment. We believe that this will: (1.)
                    give awareness to everyone that will read the blog and (2.)
                    Help people have more access to the Platform and the
                    community we intend to build at large.
                  </div>
                  <hr />
                </li>
                <li>
                  <hr />
                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="timeline-end mb-10 md:text-start">
                    <time className="font-mono italic">June - August 2025</time>
                    <div className="text-lg font-black">
                      Onboard Ambassadors and Launch Discord Server
                    </div>
                    From the second quarter of 2025, RecycLink aims to onboard
                    ambassadors. This ambassadors will help with the discord
                    community and also help raise more awareness about the
                    environment.
                  </div>
                  <hr />
                </li>
                <li>
                  <hr />
                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="timeline-start mb-10 md:text-end">
                    <time className="font-mono italic">October 2025</time>
                    <div className="text-lg font-black">Feedback hub</div>
                    Feedback is key for the growth of any individual, group or
                    community. RecycLink aims to build a feedback for the
                    platform that will allow us to get feedback anytime and
                    anywhere in the world, 24 times a day, 7 days a week,
                    leveraging the power of blockchain technology.
                  </div>
                  <hr />
                </li>
                <li>
                  <hr />
                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="timeline-end md:text-start mb-10">
                    <time className="font-mono italic">November 2025</time>
                    <div className="text-lg font-black">
                      Partner with other War against Plastics Communities
                    </div>
                    We intend to partner with other communities that wage war
                    against plastic pollution, both offline and online. We will
                    also join the war against plastic pollution on the
                    environment as a community.
                  </div>
                </li>
              </ul>
            </div>

            <footer className="mt-6"></footer>
          </blockquote>
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <div className="bg-base-300 px-4 py-10 sm:px-6 lg:px-8 lg:py-24 mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
            <h2 className="text-2xl font-bold md:text-3xl md:leading-tight text-gray-800 dark:text-gray-200">
              Frequently Asked Questions
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Answers to the most frequently asked questions.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-6 md:gap-12">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Q: What is RecycLink?
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                RecycLink: A Blockchain Solution for Plastic Waste & Climate Action  
                RecycLink is a cutting-edge blockchain-based platform designed to tackle the global 
                plastic waste crisis while supporting climate action. Our system converts recycled 
                plastics into verifiable carbon credits through a streamlined process that includes 
                incentivized recycling, tokenization of recycled materials, a carbon credit marketplace, 
                and a rewards system.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Q: How does the RecycLink process work?
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400"> 
                    RecycLink follows a seamless and rewarding process:  

                    1. Users drop off recyclable plastics at designated collection centers.  
                    2. They earn Deposit Tokens as a reward for their contributions.  
                    3. The collected plastics are transported to recycling facilities for processing.  
                    4. Verifiable carbon credits are generated based on the amount of plastic recycled.  
                    5. These carbon credits are tokenized and recorded on the blockchain.  
                    6. The tokenized credits can be traded on the Carbon Wise marketplace.  
                    This system encourages recycling, reduces plastic waste, and fosters a transparent market for carbon credits, supporting global sustainability efforts.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Q: What are carbon credits and why are they important?
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                Carbon credits are like points earned for reducing pollution. Each credit represents one ton of carbon dioxide (or similar gases) that didn't go into the air. They help fight climate change by rewarding people and businesses for making eco-friendly choices.
                In RecycLink:Carbon credits are created when plastics are recycled instead of making new plastic.
                These credits show how much pollution was avoided.
                They are stored on the blockchain, making them easy to track and trade.
                Carbon credits matter because they put a price on pollution,
                encouraging everyone to reduce waste and protect the planet.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Q: How can I participate in RecycLink?
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                Sign up on our platform, locate a nearby collection point, and start recycling plastic waste. 
                You'll earn Experience Points (XP) for your efforts, 
                which can be exchanged for cash or used in the general marketplace. 
                Join us in reducing plastic pollution while getting rewarded!
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Q: Is there a cost to participate?
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  A: No, there is no cost to participate in RecycLink.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Q: What blockchain technology does RecycLink use?
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  A: RecycLink is aspiring to be multi-chain and available on
                  as many protocols as possible.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Q: How are carbon credits verified on RecycLink?
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  A: Carbon credits on RecycLink are verified through a
                  rigorous process that involves third-party audits and
                  blockchain technology.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Q: How does RecycLink contribute to environmental
                  sustainability?
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  A: RecycLink helps reduce plastic pollution, conserve
                  resources, and mitigate climate change by incentivizing
                  plastic recycling and generating carbon credits.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Q: How many carbon credits can be generated from recycling
                  plastic?
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  A: The number of carbon credits generated depends on the type
                  and quantity of plastic recycled. However, we can provide
                  estimates based on industry standards.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Q: How does RecycLink compare to other plastic recycling
                  initiatives?
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  A: RecycLink differentiates itself by offering a unique
                  combination of plastic recycling, carbon credit generation,
                  and blockchain technology. This provides a more comprehensive
                  and sustainable solution to the plastic waste crisis.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Q: Who can participate in RecycLink?
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  A: Everyone! Whether you're an individual looking to recycle
                  and earn rewards or a business seeking to reduce your carbon
                  footprint by purchasing carbon credits, RecycLink has
                  something for everyone. We also work with private waste
                  management companies and governments to drive sustainable
                  practices.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Q: What can businesses and corporations gain from RecycLink?
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  A: Businesses and corporations can purchase tokenized carbon
                  credits to offset their carbon footprint. By doing so, they
                  contribute to environmental sustainability while meeting
                  regulatory requirements and enhancing their corporate social
                  responsibility efforts.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Q: What future features can we expect from RecycLink?
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  A: We are working on several exciting features, including
                  real-time notifications for recyclers, dashboards for users,
                  advanced analytics for tracking plastic waste, and more! Stay
                  tuned for updates as we continue to innovate and expand the
                  platform.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Q: How does RecycLink align with the Sustainable Development
                  Goals (SDGs)?
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  A: RecycLink  aligns with several SDGs by promoting good
                  health and well-being (SDG 3), clean water and sanitation (SDG
                  6), sustainable cities and communities (SDG 11), responsible
                  consumption (SDG 12), climate action (SDG 13), life below
                  water (SDG 14) and life on land (SDG 15). We aim to foster
                  sustainable practices that benefit both people and the planet.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Q: Who can I contact for more information?
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  A: For more information or inquiries, please reach out to us
                  via our contact page or send us a DM on our social media
                  handles. We're here to help!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section>
        <footer className="w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto">
          {/* <!-- Grid --> */}
          <div className="text-center">
            <div>
              <a
                className="flex-none text-xl font-semibold text-black dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                href="#"
                aria-label="Brand"
              >
                <Logo />
              </a>
              <div>Rewarding Responsibility</div>
            </div>
            {/* <!-- End Col --> */}

            <div className="mt-3">
              {/* <p className="text-gray-500">
                We're part of the{" "}
                <a
                  className="font-semibold text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
                  href="https://web3bridge.com"
                >
                  Web3bridge
                </a>{" "}
                family.
              </p>
              */}
              <p className="text-gray-500">
                © RecycLink. {new Date().getFullYear()}.
                <br />
                All rights reserved.
              </p>
            </div>

            {/* <!-- Social Brands --> */}
            <div className="mt-3 space-x-2">
              <a
                className="inline-flex justify-center items-center w-10 h-10 text-center text-gray-500 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white transition dark:text-gray-500 dark:hover:text-gray-200 dark:hover:bg-gray-800"
                href="#"
              >
                <svg
                  className="flex-shrink-0 w-3.5 h-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                </svg>
              </a>
              <a
                className="inline-flex justify-center items-center w-10 h-10 text-center text-gray-500 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white transition dark:text-gray-500 dark:hover:text-gray-200 dark:hover:bg-gray-800"
                href="#"
              >
                <svg
                  className="flex-shrink-0 w-3.5 h-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                </svg>
              </a>
              <a
                className="inline-flex justify-center items-center w-10 h-10 text-center text-gray-500 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white transition dark:text-gray-500 dark:hover:text-gray-200 dark:hover:bg-gray-800"
                href="#"
              >
                <svg
                  className="flex-shrink-0 w-3.5 h-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </a>
              <a
                className="inline-flex justify-center items-center w-10 h-10 text-center text-gray-500 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white transition dark:text-gray-500 dark:hover:text-gray-200 dark:hover:bg-gray-800"
                href="#"
              >
                <svg
                  className="flex-shrink-0 w-3.5 h-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.362 10.11c0 .926-.756 1.681-1.681 1.681S0 11.036 0 10.111C0 9.186.756 8.43 1.68 8.43h1.682v1.68zm.846 0c0-.924.756-1.68 1.681-1.68s1.681.756 1.681 1.68v4.21c0 .924-.756 1.68-1.68 1.68a1.685 1.685 0 0 1-1.682-1.68v-4.21zM5.89 3.362c-.926 0-1.682-.756-1.682-1.681S4.964 0 5.89 0s1.68.756 1.68 1.68v1.682H5.89zm0 .846c.924 0 1.68.756 1.68 1.681S6.814 7.57 5.89 7.57H1.68C.757 7.57 0 6.814 0 5.89c0-.926.756-1.682 1.68-1.682h4.21zm6.749 1.682c0-.926.755-1.682 1.68-1.682.925 0 1.681.756 1.681 1.681s-.756 1.681-1.68 1.681h-1.681V5.89zm-.848 0c0 .924-.755 1.68-1.68 1.68A1.685 1.685 0 0 1 8.43 5.89V1.68C8.43.757 9.186 0 10.11 0c.926 0 1.681.756 1.681 1.68v4.21zm-1.681 6.748c.926 0 1.682.756 1.682 1.681S11.036 16 10.11 16s-1.681-.756-1.681-1.68v-1.682h1.68zm0-.847c-.924 0-1.68-.755-1.68-1.68 0-.925.756-1.681 1.68-1.681h4.21c.924 0 1.68.756 1.68 1.68 0 .926-.756 1.681-1.68 1.681h-4.21z" />
                </svg>
              </a>
            </div>
            {/* <!-- End Social Brands --> */}
          </div>
          {/* <!-- End Grid --> */}
        </footer>
      </section>

      {/* <Reward /> */}
      {/* <Faq /> */}
      {/* <Future /> */}
      {/* <Bottom /> */}
      {/* <Footer /> */}
    </section>
  );
};

export default Landing;
