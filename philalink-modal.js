document.addEventListener("DOMContentLoaded", () => {
  const openButton = document.getElementById("openPhilaLinkModal");
  const modal = document.getElementById("philalinkModal");
  const closeButton = document.getElementById("closePhilaLinkModal");

  if (!openButton || !modal || !closeButton) {
    return;
  }

  const tabs = Array.from(
    modal.querySelectorAll("[data-philalink-tab]"),
  );

  const panels = Array.from(
    modal.querySelectorAll("[data-philalink-panel]"),
  );

  const viewport = document.getElementById("philalinkCarouselViewport");
  const track = document.getElementById("philalinkCarouselTrack");

  const slides = track
    ? Array.from(track.querySelectorAll(".philalink-carousel__slide"))
    : [];

  const previousButton = document.getElementById("philalinkPrevPhoto");
  const nextButton = document.getElementById("philalinkNextPhoto");

  const photoLabel = document.getElementById("philalinkPhotoLabel");
  const photoCurrent = document.getElementById("philalinkPhotoCurrent");
  const photoTotal = document.getElementById("philalinkPhotoTotal");

  let activePhotoIndex = 0;
  let lastFocusedElement = null;

  if (photoTotal) {
    photoTotal.textContent = String(slides.length);
  }

  const centreActiveSlide = () => {
    if (!viewport || !track || !slides.length) {
      return;
    }

    const activeSlide = slides[activePhotoIndex];

    const viewportCentre = viewport.clientWidth / 2;

    const slideCentre =
      activeSlide.offsetLeft + activeSlide.offsetWidth / 2;

    track.style.transform = `translateX(${
      viewportCentre - slideCentre
    }px)`;
  };

  const updateCarousel = () => {
    if (!slides.length) {
      return;
    }

    slides.forEach((slide, index) => {
      slide.classList.toggle(
        "active",
        index === activePhotoIndex,
      );
    });

    const activeSlide = slides[activePhotoIndex];

    const caption =
      activeSlide.dataset.caption ||
      "Community health care workers from my village";

    if (photoLabel) {
      photoLabel.textContent = caption;
    }

    if (photoCurrent) {
      photoCurrent.textContent = String(
        activePhotoIndex + 1,
      );
    }

    requestAnimationFrame(centreActiveSlide);
  };

  const showPhoto = (index) => {
    if (!slides.length) {
      return;
    }

    activePhotoIndex =
      (index + slides.length) % slides.length;

    updateCarousel();
  };

  const activateTab = (tabName) => {
    tabs.forEach((tab) => {
      const active =
        tab.dataset.philalinkTab === tabName;

      tab.classList.toggle("active", active);

      tab.setAttribute(
        "aria-selected",
        active ? "true" : "false",
      );
    });

    panels.forEach((panel) => {
      const active =
        panel.dataset.philalinkPanel === tabName;

      panel.classList.toggle("active", active);

      panel.hidden = !active;
    });

    if (tabName === "community") {
      requestAnimationFrame(() => {
        updateCarousel();
      });
    }
  };

  const openModal = () => {
    lastFocusedElement = document.activeElement;

    modal.classList.add("is-open");

    modal.setAttribute(
      "aria-hidden",
      "false",
    );

    document.body.classList.add(
      "philalink-modal-open",
    );

    activateTab("origin");

    requestAnimationFrame(() => {
      closeButton.focus();
    });
  };

  const closeModal = () => {
    modal.classList.remove("is-open");

    modal.setAttribute(
      "aria-hidden",
      "true",
    );

    document.body.classList.remove(
      "philalink-modal-open",
    );

    if (
      lastFocusedElement &&
      typeof lastFocusedElement.focus === "function"
    ) {
      lastFocusedElement.focus();
    }
  };

  openButton.addEventListener(
    "click",
    openModal,
  );

  closeButton.addEventListener(
    "click",
    closeModal,
  );

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activateTab(
        tab.dataset.philalinkTab,
      );
    });
  });

  if (previousButton) {
    previousButton.addEventListener(
      "click",
      () => {
        showPhoto(activePhotoIndex - 1);
      },
    );
  }

  if (nextButton) {
    nextButton.addEventListener(
      "click",
      () => {
        showPhoto(activePhotoIndex + 1);
      },
    );
  }

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener(
    "keydown",
    (event) => {
      if (!modal.classList.contains("is-open")) {
        return;
      }

      if (event.key === "Escape") {
        closeModal();
        return;
      }

      const communityPanel =
        document.getElementById(
          "philalinkCommunityPanel",
        );

      const communityPanelVisible =
        communityPanel &&
        !communityPanel.hidden;

      if (!communityPanelVisible) {
        return;
      }

      if (event.key === "ArrowLeft") {
        showPhoto(activePhotoIndex - 1);
      }

      if (event.key === "ArrowRight") {
        showPhoto(activePhotoIndex + 1);
      }
    },
  );

  window.addEventListener(
    "resize",
    () => {
      if (
        modal.classList.contains("is-open")
      ) {
        centreActiveSlide();
      }
    },
  );

  slides.forEach((slide, index) => {
    slide.addEventListener(
      "click",
      () => {
        showPhoto(index);
      },
    );
  });

  updateCarousel();
});
