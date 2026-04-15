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
    // <section className="py-16 bg-white border-t border-slate-100" aria-labelledby="home-gallery-title">
    //   <div className="container mx-auto px-4">
    //     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
    //       <h2 id="home-gallery-title" className="text-3xl font-bold text-slate-900">
    //         {title}
    //       </h2>
    //       <PartnerCarouselNav
    //         carouselId={carouselId}
    //         prevAriaLabel="Previous gallery images"
    //         nextAriaLabel="Next gallery images"
    //       />
    //     </div>

    //     <div className="relative">
    //       <div id={carouselId} className={partnerCarouselTrackClassName}>
    //         {images.map((img, i) => (
    //           <figure
    //             key={`${img.src}-${i}`}
    //             className={`${partnerCarouselCardClassName} rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100`}
    //           >
    //             <div className="relative pt-[65%]">
    //               <img
    //                 src={img.src}
    //                 alt={img.alt || `Gallery ${i + 1}`}
    //                 className="absolute inset-0 w-full h-full object-cover"
    //                 loading="lazy"
    //               />
    //             </div>
    //           </figure>
    //         ))}
    //       </div>
    //     </div>
    //   </div>
    // </section>



    // updated code 
    <section className="relative py-16 bg-gradient-to-br from-[#020617] via-[#0f172a] to-black border-t border-cyan-500/10 overflow-hidden" aria-labelledby="home-gallery-title">
  
  {/* 🔥 Glow Effect Background */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,255,255,0.08),transparent_40%)]"></div>

  <div className="container mx-auto px-4 relative z-10">
    
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <h2 id="home-gallery-title" className="text-3xl font-bold text-white tracking-wide">
        {title}
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
            className={`${partnerCarouselCardClassName} group rounded-xl overflow-hidden border border-cyan-500/10 shadow-lg bg-slate-900/60 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-cyan-400/40`}
          >
            
            <div className="relative pt-[65%]">
              <img
                src={img.src}
                alt={img.alt || `Gallery ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>

            {/* 🔥 Hover Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300"></div>

          </figure>
        ))}

      </div>
    </div>

  </div>
</section>
  );
}
