const showSignupBtn = document.getElementById("showSignupBtn");
const showLoginBtn = document.getElementById("showLoginBtn");
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const signupUsername = document.getElementById("signupUsername");
const signupPassword = document.getElementById("signupPassword");
const signupEmail = document.getElementById("signupEmail");

const authErrMsg = document.getElementById("authErrMsg");
const succErrMsg = document.getElementById("succErrMsg");
const authSpinner = document.getElementById("authSpinner");

function showSignup() {
  updateAuthErrorMsg("");
  updateSuccErrorMsg("");
  signupForm.classList.remove("d-none");
  loginForm.classList.add("d-none");
}

function showLogin() {
  updateAuthErrorMsg("");
  updateSuccErrorMsg("");
  signupForm.classList.add("d-none");
  loginForm.classList.remove("d-none");
}

const BASE_URL = "http://localhost:8080/ecomm/api/v1";

async function createCart() {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": token,
  };

  try {
    const response = await fetch(BASE_URL + "/carts", {
      method: "POST",
      headers: headers,
    });

    if (response.ok) {
      const data = await response.json();
      console.log("createCart Success:", data.id);

      // Update this line to set cartId in localStorage
      localStorage.setItem("cartId", data.id);

      return data; // Return the data or whatever you want to return
    } else {
      // Handle non-successful response (e.g., status code is not in the range 200-299)
      console.error("createCart Error:", response.statusText);
    }
  } catch (error) {
    console.error("createCart Error:", error.message);
  }
}

async function addItemsToCart(cartItems) {
  console.log("inside addItemsToCart");
  const cartId = localStorage.getItem("cartId");
  const URI = `/carts/${cartId}`; // Update the URI accordingly

  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": token,
  };

  try {
    const data = cartItems;

    let response = await fetch(BASE_URL + URI, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(data),
    });

    let msg = await response.json();
    console.log("Success:", msg);
  } catch (error) {
    console.log(error.message);
  }
}

// function loginFn() {
//   if (loginUsername.value == "") {
//     updateAuthErrorMsg("Username should not be empty");
//   } else if (loginPassword.value == "") {
//     updateAuthErrorMsg("Password should not be empty");
//   } else {
//     updateAuthErrorMsg("");
//     toggleSpinner(true);
//     const data = {
//       username: loginUsername.value,
//       password: loginPassword.value,
//     };
//     fetch(BASE_URL + "/auth/signin", {
//       method: "POST", // or 'PUT'
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         toggleSpinner(false);
//         console.log("Success:", data.accessToken);
//         if (data.accessToken) {
//           localStorage.setItem("username", data.username);
//           localStorage.setItem("userId", data.id);
//           localStorage.setItem("token", data.accessToken);
//           localStorage.setItem("email", data.email);
//           createCart();
//         } else {
//           updateAuthErrorMsg(data.message);
//         }
//       })
//       .catch((error) => {
//         toggleSpinner(false);
//         updateAuthErrorMsg("An error occurred. Please try again later.");
//         console.error("Error:", error);
//       });
//   }
// }

async function loginFn() {
  if (loginUsername.value == "") {
    updateAuthErrorMsg("Username should not be empty");
  } else if (loginPassword.value == "") {
    updateAuthErrorMsg("Password should not be empty");
  } else {
    updateAuthErrorMsg("");
    toggleSpinner(true);
    const data = {
      username: loginUsername.value,
      password: loginPassword.value,
    };

    try {
      const response = await fetch(BASE_URL + "/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const userData = await response.json();

      toggleSpinner(false);

      if (userData.accessToken) {
        localStorage.setItem("username", userData.username);
        localStorage.setItem("userId", userData.id);
        localStorage.setItem("token", userData.accessToken);
        localStorage.setItem("email", userData.email);

        const urlSearchParams = new URLSearchParams(window.location.search);
        const localCart = urlSearchParams.get("cartItems");
        console.log(localCart === "true");

        let cartItemsParsed;
        if (localStorage.getItem("localCartItems") != null) {
          cartItemsParsed = await JSON.parse(
            localStorage.getItem("localCartItems")
          );
        } else {
          await createCart();
          window.location.href = "index.html";
          return;
        }

        let cartItems = [];
        for (const item of cartItemsParsed) {
          let obj = {};
          obj["id"] = item.id;
          obj["quantity"] = item.quantity;
          cartItems.push(obj);
        }
        console.log(cartItems);

        if (localCart === "true") {
          await createCart();
          console.log("second");
          const data = {
            productsToAdd: cartItems,
          };
          console.log(data);
          await addItemsToCart(data);
          localStorage.removeItem("localCartItems");
          window.location.href = "checkout.html";
        } else {
          await createCart();
          window.location.href = "index.html";
        }
      } else {
        updateAuthErrorMsg(userData.message);
      }
    } catch (error) {
      toggleSpinner(false);
      updateAuthErrorMsg("An error occurred. Please try again later.");
      console.error("Error:", error);
    }
  }
}

function signupFn() {
  if (signupUsername.value == "") {
    updateAuthErrorMsg("Username should not be empty");
  } else if (signupPassword.value == "") {
    updateAuthErrorMsg("Password should not be empty");
  } else if (signupEmail.value == "") {
    updateAuthErrorMsg("Email should not be empty");
  } else {
    updateAuthErrorMsg("");
    updateSuccErrorMsg("");
    toggleSpinner(true);
    const data = {
      username: signupUsername.value,
      password: signupPassword.value,
      email: signupEmail.value,
    };
    fetch(BASE_URL + "/auth/signup", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log('Success:', data);
        // localStorage.setItem("username", data.username)
        // localStorage.setItem("userId", data.id);
        // localStorage.setItem("email", data.email);
        // localStorage.setItem("token", data.accessToken);
        // createCart();
        // window.location.href = "index.html";
        toggleSpinner(false);
        updateSuccErrorMsg(data.message);
      })
      .catch((error) => {
        toggleSpinner(false);
        updateAuthErrorMsg("An error occurred. Please try again later.");
        console.error("Error:", error);
      });
  }
}

function updateAuthErrorMsg(msg) {
  authErrMsg.innerText = msg;
}
function updateSuccErrorMsg(msg) {
  succErrMsg.innerText = msg;
}

function toggleSpinner(show) {
  if (show) {
    authSpinner.classList.remove("d-none");
  } else {
    authSpinner.classList.add("d-none");
  }
}

// function redirectToHome() {
//   window.location.href = "/";
// }

showSignupBtn.addEventListener("click", showSignup);
showLoginBtn.addEventListener("click", showLogin);
signupBtn.addEventListener("click", signupFn);
loginBtn.addEventListener("click", loginFn);

if (localStorage.getItem("username")) {
  // window.location.href = "index.html";
}
