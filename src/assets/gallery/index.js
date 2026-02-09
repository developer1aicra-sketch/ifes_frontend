/**
 * Gallery assets - images are loaded via Vite's glob import.
 * Used by the Gallery page and keeps asset list in one place.
 */
const galleryModules = import.meta.glob('./*.jpg', { eager: true });

export const galleryImages = Object.entries(galleryModules).map(([path, mod]) => {
  const src = mod.default;
  const name = path.replace(/^\.\//, '').replace(/\.(jpg|jpeg|png|webp)$/i, '');
  return { src, alt: name.replace(/-/g, ' ') };
});

export default galleryImages;
