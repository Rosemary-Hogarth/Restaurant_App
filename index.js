import { menuArray } from './data.js'

// ****************render the menu items********************
const menuHtml = []

menuArray.forEach(function(item) {
  menuHtml.push(`
      <section class="container">
    <div class="card">
      <div class="card-image">
        <img src="${item.image}" alt="${item.name}" class="card-img" />
      </div>
      <div class="card-content">
        <h2 class="card-title">${item.name}</h2>
        <p class="card-text">${item.ingredients.join(', ')}</p>
        <p class="price">$${item.price}</p>
      </div>
      <div class="card-button-container">
        <button class="card-button" id="card-button-id" data-order="${item.id}">+</button>
      </div>
    </div>
  </section>`)
})

document.getElementById('container').innerHTML = menuHtml.join('')



// ************Render the order section*****************
// Add data attribute to order button with the id from the menuData


// grab order-container
const orderContainer = document.getElementById("order-container");
// Array to store selected items
let selectedOrders = {}

// create event listener and target the element with the data attribute 'order'
document.addEventListener('click', function(e) {
  if(e.target.dataset.order) {
    // if the data attribute is found, call the function with the dataset as an argument
    // id needs to be saved as a number not a string
    handleOrderClick(Number(e.target.dataset.order))
  }

})


// associate the click with the id of the menu item
function handleOrderClick(orderId) {
  // Find the menu item that matches the clicked order ID
  const targetOrderObj = menuArray.find(order => order.id === orderId);

  // If a matching menu item was found
  if (targetOrderObj) {
     // Check if this item is already in the order
    if (selectedOrders[orderId]) {
      // If the item is already in the order, increment its quantity
      selectedOrders[orderId].quantity++;
    } else {
       // If it's not in the order yet, add it
      selectedOrders[orderId] = {
        // Copy all properties from targetOrderObj (like name, price, etc.)
        ...targetOrderObj,
        // Add a new property 'quantity' and set it to 1
        quantity: 1
      };
    }
  }
  render();
}


function hasSelectedItems() {
  return Object.keys(selectedOrders).length > 0;
}

// Generate the order HTML dynamically based on selected items
// when clicked the order html should be rendered in the order container
function getOrderHtml(){
   // Initialize an empty string to store the HTML for order items
  let orderItemsHtml = ''
  // Initialize a variable to keep track of the total price
  let totalPrice = 0

  // Loop through the items in the selectedOrders object
  for (let orderId in selectedOrders) {
    // Get the current item from selectedOrders
    let item = selectedOrders[orderId];

    // Add HTML for this item to orderItemsHtml
    orderItemsHtml += `
    <div class="order-container">
        <div class="pizza-remove">
          <p class="order">${item.quantity}x ${item.name}</p>
          <a href="#" class="delete-btn" data-remove-id="${orderId}">remove</a>
        </div>
        <p class="order-price">$${(item.price * item.quantity).toFixed(2)}</p>
      </div>
      `
    // Add the price of this item (price * quantity) to the total price
      totalPrice += item.price * item.quantity;
  }
  const isDisabled = !hasSelectedItems();


  // Return the complete HTML for the order, including all items and total price
  return `
  <section class="container">
      <h2 class="order-heading">Your order</h2>
      ${orderItemsHtml}
      <div class="total-price-container">
        <p class="total-price-text">Total price:</p>
        <p class="total-price">$${totalPrice.toFixed(2)}</p>
      </div>
      <div id="order-container">
      <div class="button-container">
        <button class="complete-order-button" id="openModalBtn" ${isDisabled ? 'disabled' : ''}>Complete order</button>
      </div>
    </div>
  </section>
    `
}


// *************MODAL**************************
function setupModalListeners(){
  // Get modal elements
  const modal = document.getElementById("modal");
  const openModalBtn = document.getElementById("openModalBtn");
  const closeBtn = document.getElementsByClassName("close")[0];
  const modalForm = document.getElementById("modalForm");
  const orderContainer = document.getElementById("order-container")

  // Open modal
  if (openModalBtn && !openModalBtn.disabled) {
    openModalBtn.onclick = function() {
      // calculate total price
      let totalPrice = 0;
      for(let orderId in selectedOrders) {
        totalPrice += selectedOrders[orderId].price * selectedOrders[orderId].quantity;
      }

      // Check if total price is less than $10
      if (totalPrice < 15) {
        alert("The minimum price for delivery is $15");
        return; // Stop here and don't open the modal
      }

      // If total price is $10 or more, open the modal
      modal.style.display = "block";
    }
  }


  // Close modal
  if (closeBtn){
    closeBtn.onclick = function() {
    modal.style.display = "none";
    }
  }

  // Close modal if clicked outside
  window.onclick = function(e) {
  if (e.target == modal) {
    modal.style.display = "none";
  }
}

// Handle form submission
if (modalForm) {
  modalForm.onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const cardNum = document.getElementById("card-num").value;
    const cvvNum = document.getElementById("cvv-num").value;

    console.log("Form submitted:", { name, cardNum, cvvNum});
    // Display message to the user
    const confirmationMessage = `<p class="message">Thanks, ${name}! Your order is on its way!</p>`;
    // replace the order container with the message
    orderContainer.innerHTML = confirmationMessage

    modal.style.display = "none";
    modalForm.reset();
    }
  }
}

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('delete-btn')) {
    e.preventDefault();

    // Get the order ID from the data attribute and convert it to a number
    const orderId = Number(e.target.dataset.removeId)
    console.log("Delete order with ID:", orderId);
    if(selectedOrders[orderId].quantity > 1) {
      selectedOrders[orderId].quantity--;
    } else {
      delete selectedOrders[orderId]
    }
    render()
  }
    // selectedOrders = selectedOrders.filter(order => order.id !== orderId)

  })


// Render function to display order HTML in order container
function render() {
    orderContainer.innerHTML = getOrderHtml()
    orderContainer.style.display = 'block'  // Show the order container
    setupModalListeners() // Call after rendering order container
}
render()
