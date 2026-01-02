$(document).ready(function () {
  function formatPrice(originPrice, newPriceValue, isCount) {
    let priceValue = isCount
      ? newPriceValue.toString()
      : (newPriceValue / 100).toFixed(2).toString();
    if (originPrice.includes(",")) priceValue = priceValue.replace(".", ",");
    const originPriceNumber = originPrice.replace(/[^0-9.,]/g, "");

    return originPrice.replace(originPriceNumber.toString(), priceValue);
  }

  function updateCartPriceAndCount(cart) {
    const cartDrawerContainer = document.querySelector("cart-drawer");
    if (cartDrawerContainer) {
      const totalsElem = cartDrawerContainer.querySelector(
        ".gb-discounts-cart-values .totals__total"
      );
      const itemsCountElem = cartDrawerContainer.querySelector(
        ".gb-cart-total-item"
      );
      const totalPriceElem = cartDrawerContainer.querySelector(
        ".gb-discounts-cart-values .totals__total-value"
      );
      const comparePriceElem = cartDrawerContainer.querySelector(
        ".gb-discounts-cart-values .cart-item__old-price"
      );
      const itemCount = cart.item_count;
      const totalPrice = cart.total_price;
      const originPriceText = totalPriceElem?.innerText ?? "";
      const oldTotalPrice = originPriceText.replace(/[^0-9]/g, "");
      const oldComparePriceText = comparePriceElem?.innerText ?? "";

      if (totalPriceElem)
        totalPriceElem.innerText = formatPrice(originPriceText, totalPrice);
      if (itemsCountElem)
        itemsCountElem.innerText = formatPrice(
          itemsCountElem.innerText,
          itemCount,
          true
        );
      if (totalsElem)
        totalsElem.innerText = formatPrice(
          totalsElem.innerText,
          itemCount,
          true
        );

      if (comparePriceElem && oldComparePriceText) {
        const oldComparePrice = oldComparePriceText.replace(/[^0-9]/g, "");
        comparePriceElem.innerText = formatPrice(
          oldComparePriceText,
          parseInt(oldComparePrice) +
            parseInt(totalPrice) -
            parseInt(oldTotalPrice)
        );
      }
    }
  }

  if (amount_free_product > 0) {
    /*GB! free product added STARTS*/
    setTimeout(function () {
      var cart_total = $(".gb-totals-total-value").first().text();
      console.log(
        "Initial cart total check:",
        cart_total,
        "threshold:",
        amount_free_product
      );
      if (cart_total >= amount_free_product) {
        if ($(".cart-item").hasClass("gb-find-remove-product")) {
          console.log("Free product already in cart");
        } else {
          console.log("Adding free product");
          $(".gb-free-product-tirgger").trigger("click");
        }
      } else {
        console.log("Removing free product - under threshold");
        $(".gb-remove-product").trigger("click");
      }
    }, 3000);
    $("body").on("click", ".gb-sumbit-free", function () {
      setTimeout(function () {
        var cart_total = $(".gb-totals-total-value").first().text();
        if (cart_total >= amount_free_product) {
          if ($(".cart-item").hasClass("gb-find-remove-product")) {
          } else {
            $(".gb-free-product-tirgger").trigger("click");
          }
        } else {
          $(".gb-remove-product").trigger("click");
        }
      }, 3000);
    });
  }

  $("body").on("click", ".quantity__button", function () {
    setTimeout(function () {
      var cart_total = $(".gb-totals-total-value").first().text();
      if (cart_total >= amount_free_product) {
        if ($(".cart-item").hasClass("gb-find-remove-product")) {
        } else {
          $(".gb-free-product-tirgger").trigger("click");
        }
      } else {
        $(".gb-remove-product").trigger("click");
      }
    }, 3000);
  });

  $("body").on("keyup", ".quantity__input", function () {
    setTimeout(function () {
      var cart_total = $(".gb-totals-total-value").first().text();
      if (cart_total >= amount_free_product) {
        if ($(".cart-item").hasClass("gb-find-remove-product")) {
        } else {
          $(".gb-free-product-tirgger").trigger("click");
        }
      } else {
        $(".gb-remove-product").trigger("click");
      }
    }, 3000);
  });

  $("body").on("click", ".cart-remove-button", function () {
    setTimeout(function () {
      var cart_total = $(".gb-totals-total-value").first().text();
      if (cart_total >= amount_free_product) {
        if ($(".cart-item").hasClass("gb-find-remove-product")) {
        } else {
          $(".gb-free-product-tirgger").trigger("click");
        }
      } else {
        $(".gb-remove-product").trigger("click");
      }
    }, 3000);
  });

  $("body").on(
    "click",
    ".gb-shipping-protection-button label.switch",
    async (e) => {
      if (e.target.tagName == "INPUT") return;
      const curElem = document.querySelector(
        ".gb-shipping-protection-button label.switch"
      );
      const curInputElem = document.querySelector(
        ".gb-shipping-protection-button label.switch input"
      );
      const spinAnim = document.querySelector(
        ".gb-shipping-protection-button .spin-animation"
      );
      const checkElem = document.querySelector(
        ".gb-shipping-protection-button .complete-check"
      );
      if (curElem.classList.contains("unchecked") && !curInputElem.checked) {
        if (spinAnim.style.display == "block" || curInputElem.checked) return;

        // $(".gb-product-shipping-protection-product-tirgger").trigger("click");
        const form = document.querySelector("form.shipping-protection-form");
        const formData = new FormData(form);
        spinAnim.style.display = "block";

        try {
          const response = await fetch("/cart/add", {
            method: "POST",
            body: formData,
            headers: {
              Accept: "application/json",
              "X-Requested-With": "XMLHttpRequest",
            },
          });

          if (response.ok) {
            spinAnim.style.display = "none";

            checkElem.style.display = "block";
            fetch("/cart.js")
              .then((res) => res.json())
              .then((cart) => {
                updateCartPriceAndCount(cart);
              });
          }
        } catch (err) {
          console.error("error at shipping protection form submission", err);
        }

        curElem.classList.remove("unchecked");
        curElem.classList.add("checked");
        curInputElem.checked = true;
      } else if (
        curElem.classList.contains("checked") &&
        curInputElem.checked
      ) {
        checkElem.style.display = "none";

        try {
          const cartResponse = await fetch("/cart.js");
          const cartData = await cartResponse.json();
          const protectItem = cartData.items.find(
            (_item) =>
              _item.id == shipping_product && _item.discounts.length == 0
          );

          if (protectItem) {
            const response = await fetch("/cart/update", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
              },
              body: JSON.stringify({
                updates: {
                  [protectItem.key]: 0,
                },
              }),
            });

            if (response.ok) {
              const cart = await response.json();
              updateCartPriceAndCount(cart);
            }
          }
        } catch (err) {
          console.error("Error while removing shipping protection item", err);
        }

        curElem.classList.remove("checked");
        curElem.classList.add("unchecked");
        curInputElem.removeAttribute("checked");
      }
    }
  );

  $("body").on("change", ".gb-change-variant_id", function () {
    var id_change = $(this).find(":selected").attr("data-variant-id");
    console.log("Variant changed to ID:", id_change);
    if (!id_change) {
      console.error("No data-variant-id found on selected option");
      return;
    }
    $(this)
      .closest(".gb-get-main-freq-pro")
      .find(".product-variant-id")
      .val(id_change);
  });
});

/* $('.gbfrequently-bought-with-main-whole-slider').slick({
          infinite: true,
          autoplaySpeed: 1000,
          autoplay: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
          // adaptiveHeight: true
          //prevArrow: $('.our-customer-slider-prev'),
          //nextArrow: $('.our-customer-slider-next'),
     });   */

document.addEventListener("change", function (e) {
  if (
    e.target.matches(
      ".cart-drawer .gbfrequently-bought-with-main-whole .select__select"
    )
  ) {
    const parentBlock = e.target.closest(".gb-get-main-freq-pro");
    if (!parentBlock) {
      console.log("Error: Could not find parent block");
      return;
    }

    const allValues = Array.from(
      parentBlock.querySelectorAll(".select__select")
    )
      .map((sel) => sel.value)
      .join(" / ");

    const variantSelect = parentBlock.querySelector('[name="variants"]');
    if (!variantSelect) {
      console.log("Error: Could not find variant selector");
      return;
    }

    const matchedOption = Array.from(variantSelect.options).find((option) =>
      option.text.includes(allValues)
    );

    const idInput = parentBlock.querySelector('[name="id"]');
    if (!idInput) {
      console.log("Error: Could not find id input field");
      return;
    }

    if (matchedOption) {
      console.log("Matched variant option value:", matchedOption.value);
      idInput.value = matchedOption.value;
      console.log("Set ID input value to:", idInput.value);
    } else {
      console.log("No matching variant found for:", allValues);
    }
  }
});

// Add validation for form submissions to ensure ID parameter is present
document.addEventListener("submit", function (e) {
  if (e.target.action && e.target.action.includes("/cart/add")) {
    const idInput = e.target.querySelector('[name="id"]');
    if (!idInput || !idInput.value) {
      console.log("Preventing submission - missing id parameter");
      e.preventDefault();
      return false;
    }
  }
});

// Add specific handler for the product quantity selector
$(document).ready(function () {
  // Handle quantity changes on product page
  $("#QuantitySelector-template--16566428696689__main-7356969582705").on(
    "change",
    ".quantity__input",
    function () {
      console.log("Product page quantity changed to:", $(this).val());

      // Ensure the form has the quantity value
      const quantityValue = $(this).val();
      const formId = "product-form-template--16566428696689__main";
      const formElement = $("#" + formId);

      // Find or create a quantity input in the form
      let quantityInput = formElement.find('input[name="quantity"]');
      if (quantityInput.length === 0) {
        console.log("Adding quantity input to form");
        quantityInput = $("<input>")
          .attr({
            type: "hidden",
            name: "quantity",
          })
          .appendTo(formElement);
      }

      // Set the quantity value
      quantityInput.val(quantityValue);
      console.log("Updated form quantity to:", quantityValue);
    }
  );

  // Also listen for manual input in the quantity field
  $(
    "#QuantitySelector-template--16566428696689__main-7356969582705 .quantity__input"
  ).on("input", function () {
    $(this).trigger("change");
  });

  // Add a submit handler to validate product form
  $("#product-form-template--16566428696689__main").on("submit", function (e) {
    const idInput = $(this).find('input[name="id"]');
    const quantityInput = $(this).find('input[name="quantity"]');

    console.log(
      "Product form submission - ID:",
      idInput.val(),
      "Quantity:",
      quantityInput.val()
    );

    if (!idInput.val()) {
      console.error("Missing product ID in form submission");
      e.preventDefault();
      return false;
    }

    if (!quantityInput.val() || quantityInput.val() < 1) {
      console.log("Setting default quantity to 1");
      quantityInput.val(1);
    }
  });
});

// Improve cart quantity handlers
$(document).ready(function () {
  // Ensure all cart quantity changes include product ID
  $(".cart-item .quantity__button, .cart-item .quantity__input").on(
    "click change input",
    function () {
      const cartItem = $(this).closest(".cart-item");
      const variantId = $(this)
        .closest(".quantity-input")
        .find(".quantity__input")
        .data("quantity-variant-id");

      // If this is a form submission, ensure the ID is included
      if ($(this).closest("form").length > 0) {
        let idInput = $(this).closest("form").find('input[name="id"]');
        if (idInput.length === 0 && variantId) {
          console.log("Adding missing ID input to cart form");
          $("<input>")
            .attr({
              type: "hidden",
              name: "id",
              value: variantId,
            })
            .appendTo($(this).closest("form"));
        } else if (idInput.length > 0 && variantId) {
          idInput.val(variantId);
        }
      }
    }
  );

  // Add validation for cart drawer checkout button
  $("#CartDrawer-Checkout").on("click", function (e) {
    const form = $("#CartDrawer-Form");
    if (form.length === 0) return;

    // Check if there are any items in the cart
    const cartItems = form.find(".cart-item");
    if (cartItems.length === 0) {
      console.log("No items in cart, preventing checkout");
      e.preventDefault();
      return false;
    }

    console.log("Cart checkout with", cartItems.length, "items");
  });

  // Enhanced free product and cart update handling
  function checkFreeProductEligibility() {
    var cart_total = $(".gb-totals-total-value").first().text();

    try {
      if (cart_total >= amount_free_product) {
        if (!$(".cart-item").hasClass("gb-find-remove-product")) {
          $(".gb-free-product-tirgger").trigger("click");
        }
      } else {
        $(".gb-remove-product").trigger("click");
      }
    } catch (error) {
      console.error("Error in free product handling:", error);
    }
  }

  /**
   * * Prevent redirecting to checkout when pressing enter at quantity input
   */
  $(document).on("keydown", ".quantity__input", function (e) {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
      $(this).trigger("blur");
    }
  });
  // * End of handler

  // Replace existing similar function calls with this unified one
  $(".quantity__button, .quantity__input, .cart-remove-button").on(
    "click change keyup",
    function () {
      // Debounce the check to prevent multiple calls
      clearTimeout($(this).data("freeProductTimer"));
      $(this).data(
        "freeProductTimer",
        setTimeout(checkFreeProductEligibility, 3000)
      );
    }
  );
});

// Fix for frequently bought products add to cart
$(document).ready(function () {
  // Find all frequently bought product forms or buttons
  $(
    ".gbfrequently-bought-with-main-whole button, .gbfrequently-bought-with-main-whole .gb-sumbit-free, .gb-free-product-tirgger, .gb-product-shipping-protection-product-tirgger"
  ).on("click", function (e) {
    const parentBlock = $(this).closest(".gb-get-main-freq-pro, form");
    if (!parentBlock) {
      console.error(
        "Could not find parent block for frequently bought product"
      );
      return;
    }

    // Find the product ID input or data attribute
    let productId = null;

    // Check for direct ID input
    const idInput = parentBlock.find('input[name="id"]');
    if (idInput.length > 0 && idInput.val()) {
      productId = idInput.val();
    }
    // Check for variant ID on select
    else if (parentBlock.find(".gb-change-variant_id").length > 0) {
      const selectedOption = parentBlock.find(
        ".gb-change-variant_id option:selected"
      );
      if (selectedOption.length > 0) {
        productId = selectedOption.data("variant-id");
      }
    }
    // Check for product-variant-id input
    else if (parentBlock.find(".product-variant-id").length > 0) {
      productId = parentBlock.find(".product-variant-id").val();
    }
    // Check for data attributes on the button itself
    else if ($(this).data("variant-id")) {
      productId = $(this).data("variant-id");
    }

    console.log("Frequently bought product add to cart - ID:", productId);

    // If no product ID found, prevent submission
    if (!productId) {
      console.error("Missing product ID for frequently bought product");
      e.preventDefault();
      return false;
    }

    // Update or create the ID input
    if (idInput.length === 0) {
      console.log("Adding missing ID input to frequently bought product form");
      $("<input>")
        .attr({
          type: "hidden",
          name: "id",
          value: productId,
        })
        .appendTo(parentBlock);
    } else {
      idInput.val(productId);
    }

    // Ensure quantity is included
    let quantityInput = parentBlock.find('input[name="quantity"]');
    if (quantityInput.length === 0) {
      console.log(
        "Adding default quantity input to frequently bought product form"
      );
      $("<input>")
        .attr({
          type: "hidden",
          name: "quantity",
          value: 1,
        })
        .appendTo(parentBlock);
    } else if (!quantityInput.val() || quantityInput.val() < 1) {
      quantityInput.val(1);
    }

    console.log(
      "Ready to add frequently bought product - ID:",
      productId,
      "Quantity:",
      parentBlock.find('input[name="quantity"]').val()
    );
  });
});
