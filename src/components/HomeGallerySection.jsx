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
    <section className="py-16 bg-white border-t border-slate-100" aria-labelledby="home-gallery-title">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 id="home-gallery-title" className="text-3xl font-bold text-slate-900">
            {title}
          </h2>
          <PartnerCarouselNav
            carouselId={carouselId}
            prevAriaLabel="Previous gallery images"
            nextAriaLabel="Next gallery images"
          />
        </div>

        <div className="relative">
          <div id={carouselId} className={partnerCarouselTrackClassName}>
            {images.map((img, i) => (
              <figure
                key={`${img.src}-${i}`}
                className={`${partnerCarouselCardClassName} rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100`}
              >
                <div className="relative pt-[65%]">
                  <img
                    src={img.src}
                    alt={img.alt || `Gallery ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
