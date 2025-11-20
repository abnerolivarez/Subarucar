// Product Array
const products = [
    { id: 1, name: "Oil Filter", image: "img/cars1.png", price: 550 },
    { id: 2, name: "Air Filter", image: "img/cars2.png", price: 400 },
    { id: 3, name: "Oil", image: "img/cars3.png", price: 650 },
    { id: 4, name: "Brake Pad Set", image: "img/cars4.png", price: 4500 },
    { id: 5, name: "HeadLight Set", image: "img/cars5.png", price: 6500 },
    { id: 6, name: "Flasher Relay", image: "img/cars6.png", price: 500 },
    { id: 7, name: "ECU System", image: "img/cars7.png", price: 25000 },
    { id: 8, name: "Wiper", image: "img/cars8.png", price: 1500 }
];

function createProductCards() {
    const cardContainer = document.getElementById("cardContainer");

    products.forEach((product, index) => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="card-content">
                <h3>${product.name}</h3>
                <p class="price">₱${product.price.toLocaleString()}</p>
                <p>Description card.</p>
                <button class="decrement" data-index="${index}">--</button>
                <span class="counter" id="counter-${index}">0</span>
                <button class="increment" data-index="${index}">+</button>
                <button class="reset" data-index="${index}"><i class="fa-solid fa-trash"></i></button><br>
                <button class="addtocart" data-index="${index}">Add to Cart</button>
            </div>
        `;
        cardContainer.appendChild(card);
    });

    addEventListeners();
}


function addEventListeners() {
    const counter = Array(products.length).fill(0);
    
    const cartMainContainer = document.getElementById("cart-main-container");
    const shoppingCart = document.getElementById("shopping-cart");
    
    let shopCart = 0;
  
    function updateTotalAmount() {
        let totalAmount = 0;

        document.querySelectorAll('.cart-item').forEach(item => {
            const totalText = item.querySelector('.cart-total').textContent.replace("₱", "").replace(",", "");
            totalAmount += parseFloat(totalText);
        });

        document.getElementById("total-amount").textContent = `₱${totalAmount.toLocaleString()}`;

        if (totalAmount === 0) {
            document.getElementById("total-amount").textContent = 0;
            shoppingCart.textContent = "0";
        }
    }

    function updateShoppingCartQuantity() {
        let totalQuantity = 0;

        document.querySelectorAll('.cart-item').forEach(item => {
            const itemQuantity = parseInt(item.querySelector('.cart-quantity').textContent);
            totalQuantity += itemQuantity;
        });

        shoppingCart.textContent = totalQuantity;

        // Call Total Amount Function Here 
        updateTotalAmount();
    }

    document.querySelectorAll(".increment").forEach(button => {
        button.addEventListener("click", () => {
            const index = button.getAttribute("data-index");
            counter[index]++;
            document.getElementById(`counter-${index}`).textContent = counter[index];
        });
    });

    document.querySelectorAll(".decrement").forEach(button => {
        button.addEventListener("click", () => {
            const index = button.getAttribute("data-index");
            if (counter[index] > 0) counter[index]--;
            document.getElementById(`counter-${index}`).textContent = counter[index];
        });
    });

    document.querySelectorAll(".reset").forEach(button => {
        button.addEventListener("click", () => {
            const index = button.getAttribute("data-index");
            counter[index] = 0;
            document.getElementById(`counter-${index}`).textContent = counter[index];
        });
    });

    document.querySelectorAll(".addtocart").forEach(button => {
        button.addEventListener("click", () => {
            const index = button.getAttribute("data-index");

            if (counter[index] > 0) {
                shopCart += counter[index];
                shoppingCart.textContent = shopCart;
                addToCart(index);
            } else {
                Swal.fire({
                    title:"Oops!",
                    text:"Please select item!",
                    icon:"info",
                });
                
                
            }
        });
    });

// ==================After adding to Cart it goes to Shopping Cart ======================//
    function addToCart(index) {
        const existingItem = document.getElementById(`cart-item-${index}`);
        const price = parseFloat(products[index].price);
        const totalPrice = price * counter[index];

        if (existingItem) {
            const quantityElement = existingItem.querySelector(".cart-quantity");
            const totalElement = existingItem.querySelector(".cart-total");

            let currentQuantity = parseInt(quantityElement.textContent);
            currentQuantity += counter[index];
            quantityElement.textContent = currentQuantity;
            totalElement.textContent = `₱${(currentQuantity * price).toLocaleString()}`;
        } else {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.id = `cart-item-${index}`;

            cartItem.innerHTML = `
                <div class="cart-main-container">
                    <div>
                        <img src="${products[index].image}" alt="${products[index].name}" class="cart-image">
                    </div>
                    <div class="cart-content">
                        <p><strong>${products[index].name}</strong></p>
                        <p>Price: ${products[index].price.toLocaleString()}</p>
                        <p>Quantity: <span class="cart-quantity">${counter[index]}</span></p>
                        <p>Total: <span class="cart-total">₱${totalPrice.toLocaleString()}</span></p>
                        <button class="decrement" id="decrementBtn">--</button>
                       
                        <button class="increment" id="incrementBtn">+</button>
                    </div>
                </div>
            `;
            cartMainContainer.appendChild(cartItem);


            cartItem.querySelector("#incrementBtn").addEventListener("click", () => {
                const quantityElement = cartItem.querySelector(".cart-quantity");
                let quantity = parseInt(quantityElement.textContent);
                quantity++;
                quantityElement.textContent = quantity;
                cartItem.querySelector(".cart-total").textContent = `₱${(quantity * price).toLocaleString()}`;
                updateShoppingCartQuantity();
            });

            cartItem.querySelector("#decrementBtn").addEventListener("click", () => {
                const quantityElement = cartItem.querySelector(".cart-quantity");
                let quantity = parseInt(quantityElement.textContent);
                
                if (quantity > 1) {
                    quantity--;
                    quantityElement.textContent = quantity;
                    cartItem.querySelector(".cart-total").textContent = `₱${(quantity * price).toLocaleString()}`;
                    updateShoppingCartQuantity();
                   

                }else {
                    cartItem.remove(); // Remove cart item if quantity becomes 0
                    updateShoppingCartQuantity();
                    updateTotalAmount();
                   
                   
                }
            });

            // cartItem.querySelector(".remove-from-cart").addEventListener("click", () => {
            //     shopCart -= parseInt(cartItem.querySelector(".cart-quantity").textContent);
            //     cartItem.remove();
            //     updateTotalAmount();
            //     updateShoppingCartQuantity();
               
            // });
            
        }

        counter[index] = 0;
        document.getElementById(`counter-${index}`).textContent = counter[index];
        updateShoppingCartQuantity();
    }

   
    const placeOrder = document.getElementById('place-Order');
          placeOrder.addEventListener('click', ()=>{
            
            console.log("ShopCart value:",shopCart);
            // Always update shopCart to check remaining cart items
            shopCart = cartMainContainer.children.length;

            if (shopCart > 0 ) {
                Swal.fire({
                    title: "Order Placed Successfully!",
                    icon: "success",
                    confirmButtonText: "OK"
                });
                
                cartMainContainer.innerHTML = "";
                shoppingCart.textContent = 0;
                shopCart = 0;
                updateTotalAmount();
                 
            } else {
                
                Swal.fire({
                    title: "Your cart is empty!",
                    icon: "warning",
                    confirmButtonText: "OK"
                });
            }
          
    });
}
createProductCards();


// ==========Cart Items Show & Hide===========//

const showCart = document.querySelector('.fa-cart-shopping');  //this is button
const faXmark = document.querySelector('.fa-circle-xmark');
const cartInfo = document.querySelector('.cart-details');   //this is the container to show

showCart.addEventListener('click',()=>{
        cartInfo.classList.toggle('show');
        cartInfo.classList.toggle('hide');
});


faXmark.addEventListener('click', () => {
    cartInfo.classList.remove('show'); // Hide cart when 'X' is clicked
   
});

   

 // ==========Cart Items===========//


 