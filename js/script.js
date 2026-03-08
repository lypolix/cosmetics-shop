
const products = [
  { id: 1, name: "Помада Ruby Red", price: 499, category: "classic", img: "./img/lipstick1.jpg" },
  { id: 2, name: "Помада Pink Dream", price: 349, category: "nude", img: "./img/lipstick2.jpg" },
  { id: 3, name: "Помада Bordeaux", price: 599, category: "classic", img: "./img/lipstick1.jpg" },
  { id: 4, name: "Бальзам Care Soft", price: 199, category: "care", img: "./img/lipstick2.jpg" }
];


let cart = [];

const loadCart = () => {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
};

const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cart));
};


const byId = (id) => document.getElementById(id);

const formatRub = (value) => `${value} ₽`;

const getProductById = (id) => products.find(p => p.id === id);

// Функция подсчета цены (общая сумма корзины)
const calculateTotal = () => {
  return cart.reduce((sum, productId) => {
    const product = getProductById(productId);
    return sum + (product ? product.price : 0);
  }, 0);
};

// ------------------------------
// Отрисовка товаров
// ------------------------------
const renderProducts = (list) => {
  const container = byId("products");
  if (!container) return;

  container.innerHTML = "";

  list.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.category = p.category;
    card.dataset.price = p.price;

    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p class="price">Цена: ${formatRub(p.price)}</p>
      <button class="btn-cart" data-id="${p.id}" type="button">Добавить в корзину</button>
      <button class="btn-details" data-id="${p.id}" type="button">Подробнее</button>
      <div class="details" id="details-${p.id}" style="display:none;">
        <p>Категория: ${p.category}. Товар добавляется в корзину и участвует в расчёте суммы.</p>
      </div>
    `;

    container.appendChild(card);
  });

  bindProductButtons();
};

const bindProductButtons = () => {
  document.querySelectorAll(".btn-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      cart.push(id);
      saveCart();
      renderCart();
    });
  });


  document.querySelectorAll(".btn-details").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const block = byId(`details-${id}`);
      if (!block) return;
      block.style.display = block.style.display === "none" ? "block" : "none";
    });
  });
};

const renderCart = () => {
  const countEl = byId("cart-count");
  const totalEl = byId("cart-total");
  const listEl = byId("cart-list");

  if (countEl) countEl.textContent = String(cart.length);
  if (totalEl) totalEl.textContent = String(calculateTotal());

  if (!listEl) return;

  // Считаем количество каждого товара
  const counts = {};
  cart.forEach((id) => { counts[id] = (counts[id] || 0) + 1; });

  listEl.innerHTML = "";

  Object.keys(counts).forEach((idStr) => {
    const id = Number(idStr);
    const product = getProductById(id);
    if (!product) return;

    const qty = counts[id];
    const lineTotal = product.price * qty;

    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <span>${product.name} × ${qty} = ${formatRub(lineTotal)}</span>
      <button class="btn-remove" data-id="${id}" type="button">Удалить 1</button>
      <button class="btn-remove-all" data-id="${id}" type="button">Удалить все</button>
    `;
    listEl.appendChild(li);
  });

  bindCartRemoveButtons();
};

// Удаление из корзины
const removeOneFromCart = (productId) => {
  const idx = cart.indexOf(productId);
  if (idx !== -1) {
    cart.splice(idx, 1);
    saveCart();
    renderCart();
  }
};

const removeAllFromCart = (productId) => {
  cart = cart.filter(id => id !== productId);
  saveCart();
  renderCart();
};

const bindCartRemoveButtons = () => {
  document.querySelectorAll(".btn-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeOneFromCart(Number(btn.dataset.id));
    });
  });

  document.querySelectorAll(".btn-remove-all").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeAllFromCart(Number(btn.dataset.id));
    });
  });
};

// Очистка корзины
const clearCart = () => {
  cart = [];
  saveCart();
  renderCart();
};

// Оплата
const pay = () => {
  if (cart.length === 0) {
    alert("Корзина пуста!");
    return;
  }
  alert("Покупка прошла успешно!");
  clearCart();
};

const applyFilter = () => {
  const category = byId("filter-category")?.value || "all";
  const maxPriceRaw = byId("filter-max-price")?.value || "";
  const maxPrice = maxPriceRaw === "" ? null : Number(maxPriceRaw);

  let filtered = [...products];

  if (category !== "all") {
    filtered = filtered.filter(p => p.category === category);
  }

  if (maxPrice !== null && !Number.isNaN(maxPrice)) {
    filtered = filtered.filter(p => p.price <= maxPrice);
  }

  renderProducts(filtered);
};

const resetFilter = () => {
  if (byId("filter-category")) byId("filter-category").value = "all";
  if (byId("filter-max-price")) byId("filter-max-price").value = "";
  renderProducts(products);
};


const init = () => {
  loadCart();  
  // товары
  renderProducts(products);
  // корзина
  renderCart();
  // фильтр
  byId("filter-apply")?.addEventListener("click", applyFilter);
  byId("filter-reset")?.addEventListener("click", resetFilter);
  // кнопки корзины
  byId("cart-clear")?.addEventListener("click", clearCart);
  byId("cart-pay")?.addEventListener("click", pay);
};

document.addEventListener("DOMContentLoaded", init);
