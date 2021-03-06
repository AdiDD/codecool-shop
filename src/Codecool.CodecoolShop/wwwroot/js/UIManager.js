import { LocalStorage } from "./localStorageHandler.js";
import { dataHandler } from "./dataHandler.js";

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const checkoutCartBtn = document.querySelector(".checkout-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");

export class UI {
    setUpAddToCartButtons() {
        document.addEventListener('keydown', this.onEscPress.bind(this), false);
        const buttons = [...document.querySelectorAll(".add-to-cart")];
        buttons.forEach(button => {
            button.addEventListener("click", () => this.addProductHandler(event.target))
        });
    }

    onEscPress(event) {
        console.log(cartOverlay);
        if (event.key == "Escape" && cartOverlay.classList.contains("transparentBcg"))
            this.hideCart();
    }

    setupApp() {
        this.setUpAddToCartButtons();
        this.cartLogic();
        this.setCartValues();
        this.populateCart();
        cartBtn.addEventListener("click", this.showCart);
        closeCartBtn.addEventListener("click", this.hideCart);
    }

    cartLogic() {
        clearCartBtn.addEventListener("click", () => this.clearCart());

        checkoutCartBtn.addEventListener("click", () => this.saveCart());

        cartOverlay.addEventListener("click", (event) => {
            if (event.target.classList.contains("transparentBcg"))
                this.hideCart();
        })

        cartContent.addEventListener("click", event => {
            if (event.target.classList.contains("remove-item")) {
                let itemToRemove = event.target;
                let id = itemToRemove.dataset.id;
                this.removeItem(id);
            } else if (event.target.classList.contains("fa-chevron-up")) {
                var cart = LocalStorage.getCart();
                let id = event.target.dataset.id;
                let item = LocalStorage.getProduct(id);
                LocalStorage.updateQuantity(cart, item)
            } else if (event.target.classList.contains("fa-chevron-down")) {
                var cart = LocalStorage.getCart();
                let id = event.target.dataset.id;
                let item = LocalStorage.getProduct(id);
                if (item.quantity == 1)
                    this.removeItem(id);
                else {
                    LocalStorage.decreaseQuantity(cart, item);
                }
            }

            this.setCartValues();
            this.populateCart();
        })
    }

    clearCart() {
        localStorage.removeItem("cart");
        this.hideCart();
        this.populateCart();
        this.setCartValues();
    }

    async saveCart() {
        var cart = localStorage.getItem("cart");
        if (cart !== '') {
            var response = await dataHandler.saveCart(cart);
            console.log(await response);
        } else {
            console.log("Cart empty");
        }
    }

    removeItem(id) {
        var cart = LocalStorage.getCart();
        cart = cart.filter(item => item.id != id)
        LocalStorage.saveCart(cart);
    }

    addProductHandler(doc) {
        var product = {
            "id": $(doc).data("id"),
            "name": $(doc).data('name'),
            "price": parseFloat($(doc).data('price')),
            "quantity": 1
        }

        LocalStorage.addToCart(product);
        this.populateCart();
        this.setCartValues();
        this.showCart();
    }

    setCartValues() {
        var cart = LocalStorage.getCart();
        let priceTotal = 0;
        let itemsTotal = 0;

        cart.map(item => {
            priceTotal += item.price * item.quantity;
            itemsTotal += item.quantity;
        });

        cartTotal.innerText = parseFloat(priceTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }

    displayCartItem(item) {
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
            <img src="../../img/${item.name}.jpg" alt="product" />
            <div>
                <h4>${item.name}</h4>
                <h5>$${item.price}</h5>
                <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
                <i class="fas fa-chevron-up" data-id=${item.id}></i>
                <p class="item-amount">${item.quantity}</p>
                <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>
        `;
        cartContent.appendChild(div);
    }

    showCart() {
        cartOverlay.classList.add("transparentBcg");
        cartDOM.classList.add("showCart");
    }

    hideCart() {
        cartOverlay.classList.remove("transparentBcg");
        cartDOM.classList.remove("showCart");
    }

    populateCart() {
        cartContent.innerHTML = "";
        var cart = LocalStorage.getCart();
        cart.forEach(item => this.displayCartItem(item))
    }
}