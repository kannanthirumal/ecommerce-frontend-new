const productDetails = document.getElementById("productDetails");
const addToCartBtn = document.getElementById("addToCartBtn");
const goToCartBtn = document.getElementById("goToCartBtn");

function loadProductDetails() {
  const productId = window.location.search.split("=")[1];
  fetch(BASE_URL + `/products/${productId}`, {
    method: "GET", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data) {
        renderProductDetails(data);
      }
    })
    .catch((error) => {
      console.log("Error:", error.message);
    });
}

function renderProductDetails(data) {
  const productDetailsHtml =
    '<div class="product-name">' +
    data.name +
    "</div>" +
    '<div class="product-price fw-bold">&#8377; ' +
    data.cost +
    "</div>" +
    '<div class="product-description">' +
    '<div class="product-description-title fw-bold">Description</div>' +
    '<div class="product-description-data">' +
    data.description +
    "</div>" +
    "</div>";

  productDetails.innerHTML = productDetailsHtml;

  if (data.addedToCart == 1) {
    console.log("data.addedToCart", data.addedToCart);
    goToCartBtn.classList.remove("d-none");
    addToCartBtn.classList.add("d-none");
  }
}

// function addToCartFn() {
//   const productId = window.location.search.split("=")[1];
//   const cartId = localStorage.getItem("cartId");

//   const token = localStorage.getItem("token");
//   const headers = {
//     "Content-Type": "application/json",
//     "x-access-token": token,
//   };

//   const data = {
//     productsToAdd: [
//       {
//         productId: productId,
//         quantity: 1,
//       },
//     ],
//   };

//   fetch(BASE_URL + `/carts/${cartId}`, {
//     method: "PUT",
//     headers: headers,
//     body: JSON.stringify(data),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       if (data) {
//         goToCartBtn.classList.remove("d-none");
//         addToCartBtn.classList.add("d-none");
//       }
//     })
//     .then(() => {
//       updateCartItemCount();
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }

/**Add to cart with localStorage option whne offline */
function addToCartFn() {
  const productId = window.location.search.split("=")[1];
  const cartId = localStorage.getItem("cartId");

  const token = localStorage.getItem("token");

  // Check if the user is logged in
  if (token) {
    const headers = {
      "Content-Type": "application/json",
      "x-access-token": token,
    };

    const data = {
      productsToAdd: [
        {
          id: productId,
          quantity: 1,
        },
      ],
    };

    fetch(BASE_URL + `/carts/${cartId}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data) {
          goToCartBtn.classList.remove("d-none");
          addToCartBtn.classList.add("d-none");
        }
      })
      .then(() => {
        updateCartItemCount();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    // User is not logged in, handle local storage logic
    const localCartItems = localStorage.getItem("localCartItems");
    let cartItems = localCartItems ? JSON.parse(localCartItems) : [];

    // Check if the product is already in the local cart
    const existingProduct = cartItems.find(
      (item) => item.productId === productId
    );

    if (existingProduct) {
      // Increase the quantity if the product is already in the local cart
      existingProduct.quantity += 1;
    } else {
      // Add the product to the local cart

      fetch(BASE_URL + `/products/${productId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((product) => {
          console.log("product: ", product);
          cartItems.push({
            id: product.id,
            quantity: 1,
            name: product.name,
            cost: product.cost,
          });
          console.log("cartItems: ", cartItems);
          // Update local storage with the modified cart items
          localStorage.setItem("localCartItems", JSON.stringify(cartItems));
          updateCartItemCount();
        })
        .catch((err) => {
          console.log("Error: ", err);
        });
    }

    // Update UI accordingly
    goToCartBtn.classList.remove("d-none");
    addToCartBtn.classList.add("d-none");
  }
}

addToCartBtn.addEventListener("click", addToCartFn);

loadProductDetails();
