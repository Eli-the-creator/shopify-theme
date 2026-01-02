document.addEventListener('DOMContentLoaded', function() {
  // Find all carousel sections on the page
  const carouselSections = document.querySelectorAll('.collection-grid-carousel');
  
  carouselSections.forEach(section => {
    const container = section.querySelector('.product-carousel');
    const prevButton = section.querySelector('.nav-button.prev');
    const nextButton = section.querySelector('.nav-button.next');

    function updateProductAlignment() {
      if (!container) return;

      const productCards = container.querySelectorAll('.product-card');
      if (productCards.length === 0) {
        container.style.justifyContent = 'center'; // Center if no cards
        return;
      }

      // Calculate total width of cards + gaps
      let totalWidth = 0;
      const gapStyle = window.getComputedStyle(container).getPropertyValue('gap');
      const gap = parseFloat(gapStyle) || 20; // Use computed gap or fallback

      productCards.forEach((card, index) => {
        totalWidth += card.offsetWidth;
        if (index < productCards.length - 1) {
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
    updateProductAlignment();
    window.addEventListener('resize', updateProductAlignment);

    // Ensure images are loaded before calculating width for accuracy
    // Using Promise.all to wait for all images inside cards to load
    const images = container ? container.querySelectorAll('.product-card img') : [];
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
        updateProductAlignment(); // Recalculate after images load
      });
    } else {
      // If no images or all are complete, run alignment check once more just in case
      updateProductAlignment();
    }

    // Read scroll amount from data attribute on the container if available
    const scrollAmount = container && container.dataset.scrollAmount 
      ? parseInt(container.dataset.scrollAmount, 10)
      : 360; // Default value
    
    setupNavigation(scrollAmount);
  });
}); 