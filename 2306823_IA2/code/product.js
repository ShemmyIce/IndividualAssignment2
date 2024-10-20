let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');


cartIcon.onclick = () => {
    cart.classList.add("active");
};
closeCart.onclick = () => {
    cart.classList.remove("active");
};


if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

function ready() {
    const removeCartButtons = document.getElementsByClassName('cart-remove');
    for (let i = 0; i < removeCartButtons.length; i++) {
        removeCartButtons[i].addEventListener('click', removeCartItem);
    }

    const quantityInputs = document.getElementsByClassName("cart-quantity");
    for (let i = 0; i < quantityInputs.length; i++) {
        quantityInputs[i].addEventListener("change", quantityChanged);
    }

    const addCartButtons = document.getElementsByClassName('add-cart');
    for (let i = 0; i < addCartButtons.length; i++) {
        addCartButtons[i].addEventListener("click", addCartClicked);
    }

    document
        .getElementsByClassName("btn-buy")[0]
        .addEventListener("click", buyButtonClicked);
}

function buyButtonClicked() {
    const cartContent = document.getElementsByClassName("cart-content")[0];
    const cartBoxes = cartContent.getElementsByClassName("cart-box");
    let orderDetails = [];

    for (let i = 0; i < cartBoxes.length; i++) {
        const cartBox = cartBoxes[i];
        const title = cartBox.getElementsByClassName('cart-product-title')[0].innerText;
        const price = cartBox.getElementsByClassName('cart-price')[0].innerText;
        const quantity = cartBox.getElementsByClassName('cart-quantity')[0].value;

        orderDetails.push({
            title: title,
            price: price,
            quantity: quantity
        });
    }

    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));

    alert('Your Order is placed');
    
    while (cartContent.hasChildNodes()) {
        cartContent.removeChild(cartContent.firstChild);
    }
    updateTotal();
}

function removeCartItem(event) {
    const buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateTotal();
}

function quantityChanged(event) {
    const input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
}

function addCartClicked(event) {
    const button = event.target;
    const shopItem = button.parentElement; 
    const titleElement = shopItem.querySelector(".product-title") || shopItem.querySelector(".service-title");
    const priceElement = shopItem.querySelector(".price");
    const productImg = shopItem.querySelector(".product-img") || shopItem.querySelector(".service-img");

    if (!titleElement || !priceElement) {
        console.error("Title or price element not found");
        return;
    }

    const title = titleElement.innerText;
    const price = priceElement.innerText;
    const imgSrc = productImg ? productImg.src : ''; 

    addProductToCart(title, price, imgSrc);
    updateTotal();
}

function addProductToCart(title, price, productImg) {
    const cartShopBox = document.createElement('div');
    cartShopBox.classList.add('cart-box');
    const cartItems = document.getElementsByClassName('cart-content')[0];
    const cartItemNames = cartItems.getElementsByClassName('cart-product-title');

    for (let i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText === title) {
            alert('You have already added this item to the cart');
            return;
        }
    }

    const cartBoxContent = `
        <img src="${productImg}" class="cart-img" />
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="1" class="cart-quantity" />
        </div>
        <i class="bx bxs-trash-alt cart-remove"></i>
    `;

    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox);
    cartShopBox
        .getElementsByClassName("cart-remove")[0]
        .addEventListener("click", removeCartItem);
    cartShopBox
        .getElementsByClassName("cart-quantity")[0]
        .addEventListener("change", quantityChanged);
}

function updateTotal() {
    const cartContent = document.getElementsByClassName('cart-content')[0];
    const cartBoxes = cartContent.getElementsByClassName('cart-box');
    let total = 0;

    for (let i = 0; i < cartBoxes.length; i++) {
        const cartBox = cartBoxes[i];
        const priceElement = cartBox.getElementsByClassName('cart-price')[0];
        const quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        const price = parseFloat(priceElement.innerText.replace('$', ''));
        const quantity = quantityElement.value;
        total = total + (price * quantity);
    }

    document.getElementsByClassName('total-price')[0].innerText = '$' + total;
}
