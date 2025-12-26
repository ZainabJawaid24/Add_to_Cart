import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDzdu2SZriD15eKxPCCj3GXQLNuvj4gWVY",
    authDomain: "firestore-87a07.firebaseapp.com",
    projectId: "firestore-87a07",
    storageBucket: "firestore-87a07.firebasestorage.app",
    messagingSenderId: "406592854200",
    appId: "1:406592854200:web:413bd29d1ca901cc197c4d",
    measurementId: "G-6CSF6DHSEH"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let uid = null;
let cart = {};
let products = [
  {
    id: "p1",
    name: "T-Shirts",
    price: 350,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "p2",
    name: "Jackets",
    price: 1500,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "p3",
    name: "Headphones",
    price: 2500,
    image: "https://images.unsplash.com/photo-1545127398-14699f92334b?q=80&w=435&auto=format&fit=crop"
  },
  {
    id: "p4",
    name: "Watches",
    price: 3000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "p5",
    name: "Sneakers",
    price: 450,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "p6",
    name: "Earbuds",
    price: 2550,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "p7",
    name: "Sunglasses",
    price: 900,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "p8",
    name: "Hoodies",
    price: 3500,
    image: "https://images.unsplash.com/photo-1680292783974-a9a336c10366?q=80&w=394&auto=format&fit=crop"
  },
  {
    id: "p9",
    name: "Caps",
    price: 2000,
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "p10",
    name: "Bags",
    price: 2500,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop"
  }
];


const items = document.getElementById('products');
const cartPanel = document.getElementById('cartPanel');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const closeCart = document.getElementById('closeCart');
const openCart = document.getElementById('openCart');
const subTotal = document.getElementById('subTotal');
const buy = document.getElementById('buyNow');
const invoiceModal = document.getElementById('invoiceModal');
const invoiceBody = document.getElementById('invoiceBody');
const closeInvoice = document.getElementById('closeInvoice');

// render products cards (loop)
function showProducts() {
    items.innerHTML = '';
    for (let i = 0; i < products.length; i++) {
        let pData = products[i];
        let card = document.createElement('div');

        card.className = 'card';
        card.innerHTML = `
        <img src="${pData.image}">
        <h3>${pData.name}</h3>
        <div class="price">$${pData.price}</div>
        `;

        let btn = document.createElement('button');
        btn.textContent = 'Add to Cart';
        btn.className = 'btn btn-accent card-btn';
        btn.onclick = () => addToCart(pData.id);

        card.appendChild(btn);
        items.appendChild(card);
    };
}

// Add items to cart 
function addToCart(id) {
    let found = null;

    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            found = products[i];
            break;
        }
    }
    if (!found) return;

    if (!cart[id]) {
        cart[id] = { qty: 1, product: found };
    }
    else {
        cart[id].qty++;
    }
    saveCart();
    renderCart();
}

// change quantity
function changeQty(id, delta) {
    if (!cart[id]) return;
    cart[id].qty = cart[id].qty + delta;

    if (cart[id].qty <= 0) {
        delete cart[id];
    }

    saveCart();
    renderCart();
}

// remove items
function removeItems(id) {
    if (cart[id]) {
        delete cart[id];

        saveCart();
        renderCart();
    }
}

// render cart
function renderCart() {
    if (!cartItems) return;
    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    for (let id in cart) {
        // if (!cart.hasOwnProperty(id)) continue;
        let cartItems = cart[id];
        let price = cartItems.qty * cartItems.product.price;
        total += price;
        count += cartItems.qty;

        let div = document.createElement("div");
        div.className = 'cart-items';
        div.innerHTML = `
          <img src = "${items.product.image}">
          <div>
          <strong>${items.product.name}</strong> * ${items.qty}<br>
          $${price.toFixed(2)} <br>
          <button class="btn" onclick="changeQty('${id}', 1)">+</button>
        <button class="btn" onclick="changeQty('${id}', -1)">-</button>
        <button class="btn" onclick="removeItems('${id}')">Remove</button>
      </div>
        `;
        cartItems.appendChild(div);
    }
    if (cartCount) {
        cartCount.textContent = count;
    };
    if (subTotal) {
        subTotal.textContent = total.toFixed(2);
    };
}

//saveCart() — local + Firestore (using .then())
function saveCart() {
    try {
        localStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
        console.error("localStorage error:", e);
    }
    if (uid) {
        setDoc(doc(db, "carts", uid), { items: cart })
            .then(function () {
                // saved successfully
            })
            .catch(function (err) {
                console.error("Firestore save error:", err);
            });
    }
}

//loadCart() — read saved cart (Firestore first if uid)
function loadCart() {
    if (uid) {
        getDoc(doc(db, "carts", uid))

        .then(function (docSnap) {
                if (docSnap.exists()) {
                    cart = docSnap.data().items || {};
                } else {
                    try {
                        cart = JSON.parse(localStorage.getItem("cart") || "{}");
                    } catch (e) {
                        cart = {};
                    }
                }
                renderCart();
            })

            .catch(function (err) {
                console.error("Firestore read error:", err);
                try {
                    cart = JSON.parse(localStorage.getItem("cart") || "{}");
                } catch (e) {
                    cart = {};
                }
                renderCart();
            });
    } else {
        try {
            cart = JSON.parse(localStorage.getItem("cart") || "{}");
        } catch (e) {
            cart = {};
        }
        renderCart();
    }
}

//onBuyNow() — checkout, save order, create invoice PDF
function onBuyNow() {
    let keys = Object.keys(cart);
    if (keys.length === 0) {
        alert("Cart is empty");
        return;
    }

    let invoiceText = "";
    let total = 0;

    for (let id in cart) {
        if (!cart.hasOwnProperty(id)) continue;
        let it = cart[id];
        let price = it.qty * it.product.price;
        invoiceText += `${it.product.name} * ${it.qty} = $${price}\n`;
        total += price;
    }

    invoiceBody.innerHTML = invoiceText.replace(/\n/g, "<br>");
    invoiceModal.classList.add("open");

    addDoc(collection(db, "orders"), {
        uid: uid,
        items: cart,
        total: total,
        created: new Date()
    })
        .then(function (docRef) {
            // order saved
        })
        .catch(function (err) {
            console.error("Order save error:", err);
        });
    try {
        const { jspdf } = window.jspdf;

        let pdf = new jspdf();
        pdf.text("Mini Shop Invoice", 20, 20);
        let y = 30;

        for (let id in cart) {
            if (!cart.hasOwnProperty(id)) continue;
            let it = cart[id];
            pdf.text(`${it.product.name} * ${it.qty} = $${(it.qty * it.product.price).toFixed(2)}`, 20, y);
            y += 10;
        }

        pdf.text(`Total: $${total.toFixed(2)}`, 20, y + 10);
        pdf.save("invoice.pdf");
    } catch (e) {
        console.error("PDF error:", e);
    }
    cart = {};

    saveCart();
    renderCart();
}

//Authentication watcher (onAuthStateChanged)
onAuthStateChanged(auth, function (user) {
    if (user) {
        uid = user.uid;
        loadCart();
    } else {
        signInAnonymously(auth)
            .then(function (result) {
                // after sign-in, onAuthStateChanged will fire again
            })
            .catch(function (err) {
                console.error("Anonymous sign-in failed:", err);
            });
    }
});
showProducts();

//UI event bindings
openCart.onclick = function () { cartPanel.classList.add("open"); };
closeCart.onclick = function () { cartPanel.classList.remove("open"); };
buy.onclick = onBuyNow;
closeInvoice.onclick = function () { invoiceModal.classList.remove("open"); };

window.changeQty = changeQty;
window.removeItems = removeItems;
window.addToCart = addToCart;