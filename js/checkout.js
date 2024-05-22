const orderSummary = document.getElementById("orderSummary");
const priceDetails = document.getElementById("priceDetails");
const confirmPaymentBtn = document.getElementById("confirmPaymentBtn");
const orderConfirmed = document.getElementById("orderConfirmed");
let orderId = 0;

function loadOrderDetails() {
  const cartId = localStorage.getItem("cartId");

  const URI = `/carts/${cartId}`;

  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${token}`,
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

function renderOrderDetails(data) {
  let orderDetailsHtml =
    '<div class="order-details-title fw-bold">Order Summary</div>';
  console.log(data);
  for (i = 0; i < data.productsSelected.length; i++) {
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
      "</div>";
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

  orderSummary.innerHTML = orderDetailsHtml;
  priceDetails.innerHTML = priceDetailsHtml;
}

async function updateCartStatusAndCreateNew() {
  const token = localStorage.getItem("token");
  const cartId = localStorage.getItem("cartId");
  console.log(token);
  const headers = {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${token}`,
    "x-access-token": token,
  };

  try {
    const oldCart = await fetch(BASE_URL + `/carts/${cartId}/update-status`, {
      method: "PUT",
      headers: headers,
    });

    let data1 = await oldCart.json();
    console.log("oldCart: ", data1);

    const newCart = await fetch(BASE_URL + "/carts", {
      method: "POST",
      headers: headers,
    });

    let data = await newCart.json();
    console.log("newCart: ", data);

    console.log("inside updateCartStatusAndCreateNew - cartId: ", data.id);
    localStorage.setItem("cartId", data.id);
    localStorage.removeItem("localCartItems");
    updateCartItemCount(); //get here--------------------------------------------------
  } catch (error) {
    console.log("Error: ", error.message);
  }
}

async function confirmPayment() {
  const cartId = localStorage.getItem("cartId");
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    "x-access-token": token,
  };

  // const cartResponse = await fetch(BASE_URL + `/carts/${cartId}`, {
  //   method: "GET",
  //   headers: headers,
  // });

  // const cart = cartResponse.json();

  try {
    const response = await fetch(BASE_URL + `/stripe-checkout-session`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ id: cartId }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("url: ", data.url);
      orderConfirmed.classList.remove("d-none");
      confirmPaymentBtn.classList.add("d-none");
      await updateCartStatusAndCreateNew();
      window.location.href = data.url;
    } else {
      const json = response.json();
      Promise.reject(json);
    }
  } catch (error) {
    console.log("Error: ", error);
  }

  // orderConfirmed.classList.remove("d-none");
  // confirmPaymentBtn.classList.add("d-none");
  // updateCartStatusAndCreateNew();
}

loadOrderDetails();

confirmPaymentBtn.addEventListener("click", confirmPayment);
