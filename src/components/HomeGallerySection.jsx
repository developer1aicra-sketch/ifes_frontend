// import {
//   PartnerCarouselNav,
//   partnerCarouselTrackClassName,
//   partnerCarouselCardClassName,
// } from './partner/PartnerCarouselNav';

// /**
//  * @param {object} props
//  * @param {Array<{ src: string, alt: string }>} props.images
//  * @param {string} [props.title]
//  * @param {string} [props.carouselId]
//  */
// export default function HomeGallerySection({
//   images = [],
//   title = 'Gallery',
//   carouselId = 'home-gallery-carousel',
// }) {
//   if (!images.length) return null;

//   return (
//     // <section className="py-16 bg-white border-t border-slate-100" aria-labelledby="home-gallery-title">
//     //   <div className="container mx-auto px-4">
//     //     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//     //       <h2 id="home-gallery-title" className="text-3xl font-bold text-slate-900">
//     //         {title}
//     //       </h2>
//     //       <PartnerCarouselNav
//     //         carouselId={carouselId}
//     //         prevAriaLabel="Previous gallery images"
//     //         nextAriaLabel="Next gallery images"
//     //       />
//     //     </div>

//     //     <div className="relative">
//     //       <div id={carouselId} className={partnerCarouselTrackClassName}>
//     //         {images.map((img, i) => (
//     //           <figure
//     //             key={`${img.src}-${i}`}
//     //             className={`${partnerCarouselCardClassName} rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100`}
//     //           >
//     //             <div className="relative pt-[65%]">
//     //               <img
//     //                 src={img.src}
//     //                 alt={img.alt || `Gallery ${i + 1}`}
//     //                 className="absolute inset-0 w-full h-full object-cover"
//     //                 loading="lazy"
//     //               />
//     //             </div>
//     //           </figure>
//     //         ))}
//     //       </div>
//     //     </div>
//     //   </div>
//     // </section>



//     // updated code 
//  <section className="relative py-16 mt-10 bg-gradient-to-br from-slate-950 via-slate-900 to-black border-t border-white/5 overflow-hidden" aria-labelledby="home-gallery-title">
  
//   {/* Soft Glow Background */}
//   <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(34,211,238,0.08),transparent_40%),radial-gradient(circle_at_75%_30%,rgba(168,85,247,0.08),transparent_40%)]" />

//   <div className="container mx-auto px-4 relative z-10">
    
//     {/* Header */}
//     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
      
//       <h2
//         id="home-gallery-title"
//         className="text-3xl md:text-4xl font-extrabold text-white tracking-tight"
//       >
//         <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
//           {title}
//         </span>
//       </h2>

//       <div className="text-white">
//         <PartnerCarouselNav
//           carouselId={carouselId}
//           prevAriaLabel="Previous gallery images"
//           nextAriaLabel="Next gallery images"
//         />
//       </div>
//     </div>

//     {/* Carousel */}
//     <div className="relative">
//       <div id={carouselId} className={partnerCarouselTrackClassName}>
        
//         {images.map((img, i) => (
//           <figure
//             key={`${img.src}-${i}`}
//             className={`${partnerCarouselCardClassName} group relative rounded-xl overflow-hidden border border-white/5 shadow-lg bg-slate-900/60 backdrop-blur-lg transition-all duration-500 hover:scale-[1.04] hover:shadow-xl hover:shadow-cyan-500/10`}
//           >
            
//             {/* Image */}
//             <div className="relative pt-[65%]">
//               <img
//                 src={img.src}
//                 alt={img.alt || `Gallery ${i + 1}`}
//                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                 loading="lazy"
//               />
//             </div>

//             {/* Gradient Overlay (better than plain black) */}
//             <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>

//             {/* Glow Border Effect */}
//             <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-cyan-400/40 transition duration-500"></div>

//           </figure>
//         ))}

//       </div>
//     </div>

//   </div>
// </section>
//   );
// }



// latest code satendra sir code
import {
  PartnerCarouselNav,
  partnerCarouselTrackClassName,
  partnerCarouselCardClassName,
} from './partner/PartnerCarouselNav';

/**
 * @param {object} props
 * @param {Array<{ src: string, alt: string }>} props.images
 * @param {string} [props.title]
 * @param {string} [props.carouselId]
 */
export default function HomeGallerySection({
  images = [],
  title = 'Gallery',
  carouselId = 'home-gallery-carousel',
}) {
  if (!images.length) return null;

  return (
    <section
      className="relative py-14 mt-10 bg-gradient-to-br from-slate-950 via-slate-900 to-black border-t border-white/5 overflow-hidden"
      aria-labelledby="home-gallery-title"
    >
      {/* Soft Glow Background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_25%_25%,rgba(34,211,238,0.08),transparent_40%),radial-gradient(circle_at_75%_30%,rgba(168,85,247,0.08),transparent_40%)]" />

      <div className="max-w-7xl mx-auto px-5 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          
          <h2
            id="home-gallery-title"
            className="text-2xl md:text-3xl font-extrabold tracking-tight"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
              {title}
            </span>
          </h2>

          <div className="text-white">
            <PartnerCarouselNav
              carouselId={carouselId}
              prevAriaLabel="Previous gallery images"
              nextAriaLabel="Next gallery images"
            />
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div id={carouselId} className={partnerCarouselTrackClassName}>
            
            {images.map((img, i) => (
              <figure
                key={`${img.src}-${i}`}
                className={`${partnerCarouselCardClassName} group relative rounded-lg overflow-hidden border border-white/5 bg-slate-900/60 backdrop-blur-md transition-all duration-500 hover:scale-[1.03] hover:shadow-lg hover:shadow-cyan-500/10`}
              >
                
                {/* Image */}
                <div className="relative pt-[65%]">
                  <img
                    src={img.src}
                    alt={img.alt || `Gallery ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

                {/* Subtle Glow Border */}
                <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-cyan-400/30 transition duration-500" />
              </figure>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}
