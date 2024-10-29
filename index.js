import { menuArray } from './data.js'

// render the menu items
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
        <button class="card-button">+</button>
      </div>
    </div>
  </section>

    `)
})

document.getElementById('container').innerHTML = menuHtml.join('')


document.addEventListener('DOMContentLoaded', function() {
// Get modal elements
const modal = document.getElementById("modal");
const openModalBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementsByClassName("close")[0];
const modalForm = document.getElementById("modalForm");
const payBtn = document.getElementById("pay-btn");

// Print message
// payBtn.onClick = function() {
  // remove order container and replace with message html
// )

// Open modal
openModalBtn.onclick = function() {
  modal.style.display = "block";
}

// Close modal
closeBtn.onclick = function() {
  modal.style.display = "none";
}

// Close modal if clicked outside
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Handle form submission
modalForm.onsubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const cardNum = document.getElementById("card-num").value;
  const cvvNum = document.getElementById("cvv-num").value;

  console.log("Form submitted:", { name, cardNum, cvvNum});
  // Here you can add code to send the form data to a server

  modal.style.display = "none";
  modalForm.reset();
}
});
