// import { Leaf } from "lucide-react";
// import { Link } from "react-router-dom";

// export default function Footer() {
//   return (
//     <footer className="w-full bg-green-950 px-6 md:px-16 pt-14 pb-6">
//       <div className="max-w-7xl mx-auto">

//         {/* Top Row */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10">

//           {/* Brand */}
//           <div className="flex flex-col gap-4">
//             <Link to="/" className="flex items-center gap-2 w-fit">
//               <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center">
//                 <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
//               </div>
//               <span className="text-white font-semibold text-lg tracking-tight">GreenNest</span>
//             </Link>
//             <p className="text-green-300 text-sm leading-relaxed max-w-xs">
//               Your one-stop destination for quality plants, gardening products, and
//               professional gardening services. Bringing nature closer to your home.
//             </p>
//           </div>

//           {/* Quick Links */}
//           <div className="flex flex-col gap-4">
//             <h3 className="text-white font-bold text-base">Quick Links</h3>
//             <ul className="flex flex-col gap-3">
//               <li><Link to="/plants" className="text-green-300 text-sm hover:text-white transition-colors duration-150">Browse Plants</Link></li>
//               <li><Link to="/gardeners" className="text-green-300 text-sm hover:text-white transition-colors duration-150">Find Gardeners</Link></li>
//               <li><Link to="/orders" className="text-green-300 text-sm hover:text-white transition-colors duration-150">My Orders</Link></li>
//             </ul>
//           </div>

//           {/* Support */}
//           <div className="flex flex-col gap-4">
//             <h3 className="text-white font-bold text-base">Support</h3>
//             <ul className="flex flex-col gap-3">
//               <li>
//                 <Link to="mailto:help@greennest.com" className="text-green-300 text-sm hover:text-white transition-colors duration-150">
//                   help@greennest.com
//                 </Link>
//               </li>
//               <li>
//                 <Link to="tel:+15551234567" className="text-green-300 text-sm hover:text-white transition-colors duration-150">
//                   +1 (555) 123-4567
//                 </Link>
//               </li>
//             </ul>
//           </div>

//         </div>

//         {/* Divider */}
//         <div className="border-t border-green-800/60" />

//         {/* Bottom */}
//         <div className="pt-6 text-center">
//           <p className="text-green-400 text-sm">
//             © 2026 GreenNest. All rights reserved.
//           </p>
//         </div>

//       </div>
//     </footer>
//   );
// }