(() => {
  const galleryEl = document.getElementById("gallery");
  const lightboxEl = document.getElementById("lightbox");
  const lightboxCloseBtn = document.getElementById("lightboxClose");
  const lightboxImageEl = document.getElementById("lightboxImage");
  const lightboxCaptionEl = document.getElementById("lightboxCaption");

  // Replace these with your local images (e.g. "images/1.jpg") if desired.
  const IMAGES = [
    { src: "https://picsum.photos/id/1011/800/600", full: "https://picsum.photos/id/1011/1600/1200", alt: "Mountain lake at dusk", caption: "Mountain lake at dusk" },
    { src: "https://picsum.photos/id/1025/800/600", full: "https://picsum.photos/id/1025/1600/1200", alt: "Forest path with sunlight", caption: "Forest path with sunlight" },
    { src: "https://picsum.photos/id/1035/800/600", full: "https://picsum.photos/id/1035/1600/1200", alt: "Snowy mountain peaks", caption: "Snowy mountain peaks" },
    { src: "https://picsum.photos/id/1040/800/600", full: "https://picsum.photos/id/1040/1600/1200", alt: "Desert landscape and sky", caption: "Desert landscape and sky" },
    { src: "https://picsum.photos/id/1050/800/600", full: "https://picsum.photos/id/1050/1600/1200", alt: "Coastal waves and rocks", caption: "Coastal waves and rocks" },
    { src: "https://picsum.photos/id/1069/800/600", full: "https://picsum.photos/id/1069/1600/1200", alt: "Night city lights", caption: "Night city lights" },
    { src: "https://picsum.photos/id/1074/800/600", full: "https://picsum.photos/id/1074/1600/1200", alt: "Waterfall in a green valley", caption: "Waterfall in a green valley" },
    { src: "https://picsum.photos/id/1084/800/600", full: "https://picsum.photos/id/1084/1600/1200", alt: "Autumn trees and fog", caption: "Autumn trees and fog" },
    { src: "https://picsum.photos/id/1080/800/600", full: "https://picsum.photos/id/1080/1600/1200", alt: "Ocean horizon", caption: "Ocean horizon" },
    { src: "https://picsum.photos/id/109/800/600", full: "https://picsum.photos/id/109/1600/1200", alt: "Canyon walls at golden hour", caption: "Canyon walls at golden hour" },
    { src: "https://picsum.photos/id/110/800/600", full: "https://picsum.photos/id/110/1600/1200", alt: "Lush green hills", caption: "Lush green hills" },
    { src: "https://picsum.photos/id/111/800/600", full: "https://picsum.photos/id/111/1600/1200", alt: "Starry sky over landscape", caption: "Starry sky over landscape" },
  ];

  function buildGallery() {
    const fragment = document.createDocumentFragment();

    for (const [index, img] of IMAGES.entries()) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "card";
      btn.setAttribute("data-index", String(index));
      btn.setAttribute("aria-label", Open image: ${img.caption ?? img.alt});

      const media = document.createElement("div");
      media.className = "card-media";

      const thumbnail = document.createElement("img");
      thumbnail.loading = "lazy";
      thumbnail.src = img.src;
      thumbnail.alt = img.alt;

      media.appendChild(thumbnail);
      btn.appendChild(media);

      const caption = document.createElement("div");
      caption.className = "card-caption";
      caption.textContent = img.caption ?? img.alt;
      btn.appendChild(caption);

      fragment.appendChild(btn);
    }

    galleryEl.appendChild(fragment);
  }

  let lastFocusedEl = null;

  function openLightbox({ full, alt }) {
    lastFocusedEl = document.activeElement;

    lightboxImageEl.src = full;
    lightboxImageEl.alt = alt;
    lightboxCaptionEl.textContent = alt || "";

    lightboxEl.classList.add("is-open");
    lightboxEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-lightbox-open");
    lightboxCloseBtn.focus();
  }

  function closeLightbox() {
    lightboxEl.classList.remove("is-open");
    lightboxEl.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-lightbox-open");

    // Clear src to stop animations/network while hidden.
    lightboxImageEl.src = "";
    lightboxCaptionEl.textContent = "";

    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
      lastFocusedEl.focus();
    }
  }

  function onGalleryClick(e) {
    const cardBtn = e.target.closest(".card");
    if (!cardBtn) return;

    const indexStr = cardBtn.getAttribute("data-index");
    const index = indexStr ? Number(indexStr) : NaN;
    if (!Number.isFinite(index) || !IMAGES[index]) return;

    openLightbox(IMAGES[index]);
  }

  // Close interactions
  lightboxCloseBtn.addEventListener("click", closeLightbox);
  lightboxEl.addEventListener("click", (e) => {
    // Only close if the backdrop itself was clicked, not the image/caption area.
    if (e.target === lightboxEl) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightboxEl.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
  });

  // Init
  buildGallery();
  galleryEl.addEventListener("click", onGalleryClick);
})();
