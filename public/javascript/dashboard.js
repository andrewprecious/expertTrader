const fullDashboard = document.querySelector(".fullDashboard");
const leftArrow = document.querySelector(".fa-long-arrow-left");
const rightArrow = document.querySelector(".fa-long-arrow-right");

// function to hideSide bar
function hideSidebar() {
  fullDashboard.classList.add("toggle");
}

leftArrow.addEventListener("click", () => {
  fullDashboard.classList.add("toggle");
});

rightArrow.addEventListener("click", () => {
  fullDashboard.classList.remove("toggle"); // Example action
});

/* deposit page starts */
// Function to update payment method description
function updatePaymentDescription() {
  const paymentSelect = document.getElementById("payment");
  const paymentMethodParagraph = document.getElementById("paymentMethod");
  const selectedPaymentMethod =
    paymentSelect.options[paymentSelect.selectedIndex].text;

  // Update the paragraph content based on the selected payment method
  switch (selectedPaymentMethod) {
    case "Bitcoin":
      paymentMethodParagraph.innerText =
        "Pay To this Bitcion wallat 1223333373736";
      break;
    case "Ethereum":
      paymentMethodParagraph.innerText =
        "Pay To this Ethereum wallat 1223333373736";
      break;
    case "USDT":
      paymentMethodParagraph.innerText =
        "Pay To this USDT wallat 1223333373736";
      break;
    default:
      paymentMethodParagraph.innerText = " ";
  }

  // ADD PAYMENT AMOUNT TO REVIEW SECTION
  const payMethod = document.querySelector(".payMethod");
  payMethod.innerHTML = selectedPaymentMethod;
  /* deposit page starts */
}

// Event listener to call the function when a payment method is selected
document
  .getElementById("payment")
  .addEventListener("change", updatePaymentDescription);

// Initially call the function to set the default payment method description
updatePaymentDescription();

//  FUNCTION TO ADD PAYMENT AMOUNT TO REVIEW SECTION
const amountInput = document.querySelector("#amount");
const reviewAmount = document.querySelectorAll(".reviewAmount");

amountInput.addEventListener("keyup", () => {
  reviewAmount.forEach((para) => {
    para.innerText = amountInput.value;
  });
});
