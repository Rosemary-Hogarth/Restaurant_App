import { menuArray } from './data.js'

// ****************render the menu items********************
const menuHtml = []

menuArray.forEach(function(item) {
  menuHtml.push(`
      <section class="container">
    <div class="card">
      <div class="card-image">
        <p class="emoji">${item.emoji}</p>
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
const selectedOrders = []

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
  const targetOrderObj = menuArray.find(order => order.id === orderId)

  if (targetOrderObj) {
    selectedOrders.push(targetOrderObj) // Add selected item to array
  }

  render()
}

// Generate the order HTML dynamically based on selected items
// when clicked the order html should be rendered in the order container
function getOrderHtml(){
  let orderItemsHtml = ''
  let totalPrice = 0

  // loop through the items that have been selected and add them to the container
  selectedOrders.forEach(function(item){
    orderItemsHtml += `
    <div class="order-container">
        <div class="pizza-remove">
          <p class="order">${item.name}</p>
          <a href="#" class="delete-btn" data-remove-id="${item.id}">remove</a>
        </div>
        <p class="order-price">$${item.price}</p>
      </div>
      `

      totalPrice += item.price
  })

  return `
  <section class="container">
      <h2 class="order-heading">Your order</h2>
      ${orderItemsHtml}
      <div class="total-price-container">
        <p class="total-price-text">Total price:</p>
        <p class="total-price">$${totalPrice}</p>
      </div>
      <div id="order-container">
      <div class="button-container">
        <button class="complete-order-button" id="openModalBtn">Complete order</button>
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
  const payBtn = document.getElementById("pay-btn");
  const orderContainer = document.getElementById("order-container")

  // Open modal
  if (openModalBtn) {
    openModalBtn.onclick = function() {
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


// Render function to display order HTML in order container
function render() {
  if (selectedOrders.length > 0) {
    orderContainer.innerHTML = getOrderHtml()
    orderContainer.style.display = 'block'  // Show the order container
    setupModalListeners() // Call after rendering order container
  } else {
    orderContainer.innerHTML = ''
    orderContainer.style.display = 'none'   // Hide the order container if no items
  }
}


// Initially hide the order container
orderContainer.style.display = 'none'
render()
