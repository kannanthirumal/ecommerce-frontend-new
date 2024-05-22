// const logoutBtn = document.getElementById("logoutBtn");
// const userIntro = document.getElementById("userIntro");

// const BASE_URL = "http://localhost:8080/ecomm/api/v1";

// logoutBtn.addEventListener("click", logoutFn);

// function logoutFn() {
//   localStorage.removeItem("username");
//   window.location.href = "login.html";
// }

// if (!localStorage.getItem("username")) {
//   // window.location.href = "login.html";
//   userIntro.innerText = "Hi User";
// } else {
//   userIntro.innerText = "Hi " + localStorage.getItem("username");
// }

// //cart item count
// const cartItemCountElement = document.getElementById("cartItemCount");

// function updateCartItemCount() {
//   const cartId = localStorage.getItem("cartId");
//   const URI = `/carts/${cartId}`;

//   const token = localStorage.getItem("token");
//   const headers = {
//     "Content-Type": "application/json",
//     "x-access-token": token,
//   };

//   fetch(BASE_URL + URI, {
//     method: "GET",
//     headers: headers,
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       const itemCount = data.totalQuantity || 0;
//       if (itemCount <= 1) {
//         cartItemCountElement.textContent = "[" + itemCount + " item]";
//       } else {
//         cartItemCountElement.textContent = "[" + itemCount + " items]";
//       }

//       // Add or remove classes based on cart status
//       if (itemCount === 0) {
//         cartItemCountElement.classList.add("cart-empty");
//         cartItemCountElement.classList.remove("cart-not-empty");
//       } else {
//         cartItemCountElement.classList.add("cart-not-empty");
//         cartItemCountElement.classList.remove("cart-empty");
//       }
//     })
//     .catch((error) => {
//       console.error("Error fetching cart item count:", error);
//     });
// }

// Call this function whenever the page loads or after cart update
// updateCartItemCount();

// common.js

const BASE_URL = "http://localhost:8080/ecomm/api/v1";

const userIntro = document.getElementById("userIntro");
const cartItemCountElement = document.getElementById("cartItemCount");
const logoutBtn = document.getElementById("logoutBtn");
const loginBtn = document.getElementById("loginBtn");

function updateUIBasedOnLogin() {
  const username = localStorage.getItem("username");
  const cartItems = localStorage.getItem("localCartItems");

  if (username) {
    // User is logged in
    userIntro.textContent = `Hi, ${username}`;
    logoutBtn.classList.remove("d-none");
    loginBtn.classList.add("d-none");
  } else {
    // User is not logged in
    userIntro.textContent = "Hi, Guest";
    logoutBtn.classList.add("d-none");
    loginBtn.classList.remove("d-none");
  }

  // Update cart item count in UI
  updateCartItemCount();
}

function updateCartItemCount() {
  const token = localStorage.getItem("token");
  if (token) {
    const cartId = localStorage.getItem("cartId");
    console.log("inside updateCartItemCount - cartId: ", cartId);
    const URI = `/carts/${cartId}`;

    const headers = {
      "Content-Type": "application/json",
      "x-access-token": token,
    };

    fetch(BASE_URL + URI, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data: ", data);
        const itemCount = data.totalQuantity || 0;
        console.log("itemCount: ", itemCount);
        if (itemCount <= 1) {
          cartItemCountElement.textContent = "[" + itemCount + " item]";
        } else {
          cartItemCountElement.textContent = "[" + itemCount + " items]";
        }

        // Add or remove classes based on cart status
        if (itemCount === 0) {
          cartItemCountElement.classList.add("cart-empty");
          cartItemCountElement.classList.remove("cart-not-empty");
        } else {
          cartItemCountElement.classList.add("cart-not-empty");
          cartItemCountElement.classList.remove("cart-empty");
        }
      })
      .catch((error) => {
        console.error("Error fetching cart item count:", error);
      });
  } else {
    // User is not logged in, update cart item count from local storage
    const cartItems = localStorage.getItem("localCartItems");

    if (cartItems != null) {
      const parsedCartItems = JSON.parse(cartItems);
      const itemCount = calculateTotalQuantity(parsedCartItems);
      cartItemCountElement.textContent = itemCount;

      if (itemCount <= 1) {
        cartItemCountElement.textContent = "[" + itemCount + " item]";
      } else {
        cartItemCountElement.textContent = "[" + itemCount + " items]";
      }

      // Add or remove classes based on cart status
      if (itemCount === 0) {
        cartItemCountElement.classList.add("cart-empty");
        cartItemCountElement.classList.remove("cart-not-empty");
      } else {
        cartItemCountElement.classList.add("cart-not-empty");
        cartItemCountElement.classList.remove("cart-empty");
      }
    } else {
      const itemCount = 0;

      if (itemCount <= 1) {
        cartItemCountElement.textContent = "[" + itemCount + " item]";
      } else {
        cartItemCountElement.textContent = "[" + itemCount + " items]";
      }

      // Add or remove classes based on cart status
      if (itemCount === 0) {
        cartItemCountElement.classList.add("cart-empty");
        cartItemCountElement.classList.remove("cart-not-empty");
      } else {
        cartItemCountElement.classList.add("cart-not-empty");
        cartItemCountElement.classList.remove("cart-empty");
      }
    }
  }
}

logoutBtn.addEventListener("click", function () {
  // Perform logout actions
  localStorage.removeItem("username");
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("cartId");
  localStorage.removeItem("localCartItems");

  // Redirect to the login page or homepage
  window.location.href = "login.html"; // Update with your login page URL
});

// Helper function to calculate total quantity
function calculateTotalQuantity(cartItems) {
  let quantity = 0;
  console.log(cartItems);
  for (let item of cartItems) {
    quantity += item.quantity;
  }
  console.log("quantity", quantity);
  return quantity;
}

// Call the function to update the UI based on login information
updateUIBasedOnLogin();
