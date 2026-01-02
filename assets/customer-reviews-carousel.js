document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.reviews-container');
  const prevButton = document.querySelector('.nav-button.prev');
  const nextButton = document.querySelector('.nav-button.next');

  function updateReviewAlignment() {
    if (!container) return;

    const reviewCards = container.querySelectorAll('.review-card');
    if (reviewCards.length === 0) {
      container.style.justifyContent = 'center'; // Center if no cards
      return;
    }

    // Calculate total width of cards + gaps
    let totalWidth = 0;
    const gapStyle = window.getComputedStyle(container).getPropertyValue('gap');
    const gap = parseFloat(gapStyle) || 20; // Use computed gap or fallback

    reviewCards.forEach((card, index) => {
      totalWidth += card.offsetWidth;
      if (index < reviewCards.length - 1) {
        totalWidth += gap;
      }
    });

    // Use clientWidth which excludes padding/border/scrollbar width
    const containerWidth = container.clientWidth; 

    // Add a small tolerance to prevent slight overflows causing left alignment
    if (totalWidth < containerWidth - 1) { 
      container.style.justifyContent = 'center';
    } else {
      // Default or explicit flex-start for overflow/scrolling
      container.style.justifyContent = 'flex-start'; 
    }
  }

  // Navigation functionality
  function setupNavigation(scrollAmount) {
    if (!container || !prevButton || !nextButton) return;
    
    prevButton.addEventListener('click', function() {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    nextButton.addEventListener('click', function() {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;

      // Check if near the end (within a small threshold)
      if (container.scrollLeft >= maxScrollLeft - 5) {
        // If at or very near the end, scroll to the beginning
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Otherwise, scroll by the set amount
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    });
  }
  
  // Initial alignment check and setup resize listener
  updateReviewAlignment();
  window.addEventListener('resize', updateReviewAlignment);

  // Ensure images are loaded before calculating width for accuracy
  // Using Promise.all to wait for all images inside cards to load
  const images = container ? container.querySelectorAll('.review-card img') : [];
  const imageLoadPromises = [];
  images.forEach(img => {
    if (!img.complete) {
      imageLoadPromises.push(new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve; // Resolve even if image fails to load
      }));
    }
  });

  if (imageLoadPromises.length > 0) {
    Promise.all(imageLoadPromises).then(() => {
      updateReviewAlignment(); // Recalculate after images load
    });
  } else {
    // If no images or all are complete, run alignment check once more just in case
    updateReviewAlignment();
  }

  // Read scroll amount from data attribute on the container if available
  const scrollAmount = container && container.dataset.scrollAmount 
    ? parseInt(container.dataset.scrollAmount, 10)
    : 360; // Default value
  
  setupNavigation(scrollAmount);
}); 