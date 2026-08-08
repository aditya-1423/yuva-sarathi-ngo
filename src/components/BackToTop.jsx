// import { useEffect, useState } from "react";
// import { FaArrowUp } from "react-icons/fa";

// function BackToTop() {

//   const [showButton, setShowButton] = useState(false);

//   useEffect(() => {

//     const handleScroll = () => {

//       if (window.scrollY > 400) {
//         setShowButton(true);
//       } else {
//         setShowButton(false);
//       }

//     };

//     window.addEventListener("scroll", handleScroll);

//     return () => window.removeEventListener("scroll", handleScroll);

//   }, []);

//   const scrollToTop = () => {

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });

//   };

//   return (

//     <>

//       {showButton && (

//         <button
//           onClick={scrollToTop}
//           className="
//           fixed
//           bottom-18
//           left-6
//           w-14
//           h-14
//           rounded-full
//           bg-green-700
//           text-white
//           shadow-2xl
//           hover:bg-green-800
//           hover:scale-110
//           transition-all
//           duration-300
//           z-50
//           flex
//           items-center
//           justify-center
//           "
//         >

//           <FaArrowUp className="text-xl" />

//         </button>

//       )}

//     </>

//   );

// }

// export default BackToTop;