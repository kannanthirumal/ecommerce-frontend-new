const orderDetails = document.getElementById("orderDetails");
const priceDetails = document.getElementById("priceDetails");

/** 

function loadOrderDetails() {
  const cartId = localStorage.getItem("cartId");

  const URI = `/carts/${cartId}`;

  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": token,
  };
  fetch(BASE_URL + URI, {
    method: "GET", // or 'PUT'
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      renderOrderDetails(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

*/

function renderOrderDetails(data) {
  let orderDetailsHtml =
    '<div class="order-details-title fw-bold">Order Details</div>';
  if (data.productsSelected.length === 0) {
    orderDetailsHtml +=
      '<div class="empty-cart-message">Your cart is empty</div>';
  } else {
    for (let i = 0; i < data.productsSelected.length; i++) {
      orderDetailsHtml +=
        '<div class="order-details-product d-flex flex-row">' +
        '<div class="order-details-product-img d-flex">' +
        '<img src="https://img.favpng.com/8/17/0/product-design-clip-art-logo-food-png-favpng-TsCQEsJH2LUYN3d5Q6RzrTsqL.jpg">' +
        "</div>" +
        '<div class="order-details-product-data d-flex flex-column">' +
        "<div>" +
        data.productsSelected[i].name +
        "</div>" +
        "<div>&#8377; " +
        data.productsSelected[i].cost +
        "</div>" +
        "</div>" +
        '<div class="order-details-product-actions d-flex flex-column">' +
        '<div class="order-details-product-quantity">' +
        '<div class="fw-bold">Quantity</div>' +
        '<div class="form-group">' +
        `<select class="form-select" onchange="updateQuantity(${data.productsSelected[i].id}, this.options[this.selectedIndex].value)"
        >` +
        `<option value="1" ${
          data.productsSelected[i].quantity == 1 ? "selected" : ""
        }>1</option>` +
        `<option value="2" ${
          data.productsSelected[i].quantity == 2 ? "selected" : ""
        }>2</option>` +
        `<option value="3" ${
          data.productsSelected[i].quantity == 3 ? "selected" : ""
        }>3</option>` +
        `<option value="4" ${
          data.productsSelected[i].quantity == 4 ? "selected" : ""
        }>4</option>` +
        `<option value="5" ${
          data.productsSelected[i].quantity == 5 ? "selected" : ""
        }>5</option>` +
        "</select>" +
        "</div>" +
        "</div>" +
        `<div class="order-details-product-remove btn btn-info" onclick="removeItem('${data.productsSelected[i].id}')">Remove</div>` +
        "</div>" +
        "</div>";
    }
  }

  let priceDetailsHtml =
    '<div class="price-details-title fw-bold">Price Details</div>' +
    '<div class="price-details-data">' +
    '<div class="price-details-item d-flex flex-row justify-content-between">' +
    "<div>Price</div>" +
    "<div>&#8377; " +
    data.cost +
    "</div>" +
    "</div>" +
    '<div class="price-details-item d-flex flex-row justify-content-between">' +
    "<div>Discount</div>" +
    "<div>&#8377; 0</div>" +
    "</div>" +
    '<div class="price-details-item d-flex flex-row justify-content-between">' +
    "<div>Delivery Charges</div>" +
    "<div>FREE</div>" +
    "</div>" +
    '<div class="price-details-item d-flex flex-row justify-content-between">' +
    "<div>Total</div>" +
    "<div>&#8377; " +
    data.cost +
    "</div>" +
    "</div>" +
    "</div>";

  orderDetails.innerHTML = orderDetailsHtml;
  priceDetails.innerHTML = priceDetailsHtml;
}

// Function to remove an item from the cart
/**
function removeItem(productId) {
  const cartId = localStorage.getItem("cartId");
  const URI = `/carts/${cartId}/remove-items`; // Update the URI accordingly

  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": token,
  };
  const body = JSON.stringify({ productIds: [productId] });
*/

/**
  fetch(BASE_URL + URI, {
    method: "PUT",
    headers: headers,
    body: body,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      loadOrderDetails(); // Reload order details after removal
    })
    .then(() => {
      updateCartItemCount();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

*/

/** 
 * Function to update the quantity
function updateQuantity(productId, newQuantity) {
  const cartId = localStorage.getItem("cartId");
  const URI = `/carts/${cartId}`; // Update the URI accordingly

  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": token,
  };

  const data = {
    productsToAdd: [
      {
        productId: productId,
        quantity: newQuantity,
      },
    ],
  };

  */

/** 

  fetch(BASE_URL + URI, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      loadOrderDetails(); // Reload order details after updating quantity
    })
    .then(() => {
      updateCartItemCount();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

*/

function checkout() {
  const token = localStorage.getItem("token");

  // Check if the user is logged in
  if (token) {
    // User is logged in, perform regular checkout
    window.location.href = "checkout.html";
  } else {
    // User is not logged in, encode localCartItems and redirect to login/signup
    const localCartItems = localStorage.getItem("localCartItems");
    console.log("localCartItems: ", localCartItems);

    if (localCartItems) {
      // Redirect to login/signup with encoded cart items as a query parameter
      window.location.href = `login.html?cartItems=true`;
    } else {
      console.error("Error: Local cart items not found.");
    }
  }
}

// Add an event listener for the checkout button
const checkoutBtn = document.querySelector(".checkout-btn");
checkoutBtn.addEventListener("click", checkout);

/**New addition for localstorage */

async function loadOrderDetails() {
  const isUserLoggedIn = localStorage.getItem("token") !== null;

  if (isUserLoggedIn) {
    // User is logged in, fetch details from server
    const cartId = localStorage.getItem("cartId");
    const URI = `/carts/${cartId}`;
    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
      "x-access-token": token,
    };

    try {
      let response = await fetch(BASE_URL + URI, {
        method: "GET",
        headers: headers,
      });

      let data = await response.json();

      updateCartItemCount();
      renderOrderDetails(data);
    } catch (error) {
      console.log("Error: ", error);
    }
  } else {
    // User is not logged in, load details from local storage
    const localCartItems = localStorage.getItem("localCartItems");
    const cartItems = localCartItems != null ? JSON.parse(localCartItems) : [];

    // Simulate data structure to match server response
    const [p_cost, p_quantity] = calculateTotalCost(cartItems);
    const data = {
      id: 1,
      productsSelected: cartItems,
      cost: p_cost,
      quantity: p_quantity,
    };
    updateCartItemCount();
    renderOrderDetails(data);
  }
}

// Function to remove an item from the cart
function removeItem(productId) {
  // console.log(productId);
  const isUserLoggedIn = localStorage.getItem("token") !== null;

  if (isUserLoggedIn) {
    // User is logged in, remove item from server cart
    const cartId = localStorage.getItem("cartId");
    const URI = `/carts/${cartId}/remove-items`;

    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      "x-access-token": token,
    };

    const body = JSON.stringify({ productIds: [productId] });

    fetch(BASE_URL + URI, {
      method: "PUT",
      headers: headers,
      body: body,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        loadOrderDetails(); // Reload order details after removal
      })
      .then(() => {
        updateCartItemCount();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    // User is not logged in, remove item directly from local storage
    const localCartItems = localStorage.getItem("localCartItems");

    if (localCartItems) {
      const cartItems = JSON.parse(localCartItems);

      // Find and remove the item from cartItems based on productId
      const updatedCartItems = cartItems.filter(
        (item) => item.id !== parseInt(productId)
      );

      console.log("productId: ", productId);
      console.log("cartItems: ", cartItems);
      console.log("updatedCartItems: ", updatedCartItems);

      // Update local storage with the modified cartItems
      localStorage.setItem("localCartItems", JSON.stringify(updatedCartItems));

      // Reload order details after removal
      loadOrderDetails();
      updateCartItemCount();
    }
  }
}

// Helper function to calculate total cost
function calculateTotalCost(cartItems) {
  let cost = 0;
  let quantity = 0;
  console.log(cartItems);
  for (let item of cartItems) {
    cost += item.cost * item.quantity;
    quantity += item.quantity;
  }
  console.log("cost: ", cost);
  console.log("quantity", quantity);
  console.log("cost: ", cost);
  return [cost, quantity];
}

/**New update quantity function considering the localStorage cart option */
// Function to update the quantity
function updateQuantity(productId, newQuantity) {
  console.log("productId:", productId);
  console.log("newQuantity:", newQuantity);

  // console.log("productId: ", productId, "newQuantity: ", newQuantity);
  const isLoggedIn = checkLoginStatus();

  if (isLoggedIn) {
    // User is logged in, update quantity on the server
    updateQuantityOnServer(productId, newQuantity);
  } else {
    // User is not logged in, update quantity in localStorage
    updateQuantityInLocalStorage(productId, newQuantity);
  }
}

// Helper function to check login status
function checkLoginStatus() {
  return !!localStorage.getItem("token");
}

// Function to update quantity on the server
function updateQuantityOnServer(productId, newQuantity) {
  const cartId = localStorage.getItem("cartId");
  const URI = `/carts/${cartId}`;
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": token,
  };

  const data = {
    productsToAdd: [
      {
        id: productId,
        quantity: newQuantity,
      },
    ],
  };

  fetch(BASE_URL + URI, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      loadOrderDetails(); // Reload order details after updating quantity
    })
    .then(() => {
      updateCartItemCount();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Function to update quantity in localStorage
function updateQuantityInLocalStorage(productId, newQuantity) {
  // console.log("productId: ", productId, "newQuantity: ", newQuantity);

  // Retrieve cart items from localStorage
  const cartItems = JSON.parse(localStorage.getItem("localCartItems")) || [];
  // console.log("cartItems--: ", cartItems);

  // Find the index of the product in cartItems
  const index = cartItems.findIndex((item) => item.id === parseInt(productId));
  console.log("index: ", index);

  if (index !== -1) {
    // Update the quantity if the product is found
    cartItems[index].quantity = parseInt(newQuantity);
    console.log("quantity-inside if loop: ", newQuantity);
    console.log("cartitems-inside if loop: ", cartItems[index]);
    // Save the updated cart items back to localStorage
    localStorage.setItem("localCartItems", JSON.stringify(cartItems));
    console.log(
      "updated cartitems-inside if loop: ",
      JSON.parse(localStorage.getItem("localCartItems"))[index]
    );
    // Reload order details
    loadOrderDetails();
  }
}

loadOrderDetails();
