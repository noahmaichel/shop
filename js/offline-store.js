/*
This script handles the cart and user details for a functioning demo.
*/

/* STATUS UPDATES */

const UPDATE_STATUS_NEUTRAL = 0;
const UPDATE_STATUS_SUCCESS = 1;
const UPDATE_STATUS_FAILURE = 2;

function enqueueUpdate(text, code) {
	let list = document.getElementById("status-update-list");
	let node = document.createElement("span");

	node.innerHTML = text;
	node.classList.add("status-update");

	switch (code) {
		case UPDATE_STATUS_SUCCESS:
			node.classList.add("success");
			break;
		case UPDATE_STATUS_FAILURE:
			node.classList.add("failure");
			break;
	}

	node.addEventListener("animationend", function() {
		list.removeChild(node);
	});
	
	list.append(node);
}

/* USER DETAILS */

// TODO

/* CART */

const all_products = new Map([
	["invalid_product", {
		name: "Invalid Produkt",
		description: "Invalid",
		price: "-1,00",
		details: new Map([
		]),
	}],
	["test_product", {
		name: "Test Produkt",
		description: "Test Produkt Beschreibung",
		price: "9,99",
		details: new Map([
			["secret", "42"]
		]),
	}],
	["mail_basic", {
		name: "Mail - Basic",
		description: "1 E-Mail Postfach mit 2 GB, jederzeit erweiterbar",
		price: "1,00",
		details: new Map([
			["domain", "deine-domain.de"]
		]),
	}],
	["mail_premium", {
		name: "Mail - Premium",
		description: "5 E-Mail Postfächer mit je 10 GB, jederzeit erweiterbar",
		price: "4,00",
		details: new Map([
			["domain", "deine-domain.de"]
		]),
	}],
	["mail_professional", {
		name: "Mail - Professional",
		description: "50 E-Mail Postfächer mit je 25 GB",
		price: "35,00",
		details: new Map([
			["domain", "deine-domain.de"]
		]),
	}],
	["cloud", {
		name: "Cloud Computing",
		description: "Individuelles Cloud Server Paket",
		price: "xx,xx",
		details: new Map([
			["cpu", "1 vCore"],
			["ram", "512 MB"],
			["storage", "10 GB"]
		]),
	}],
]);

const cloud_prices = {
	// cpu
	0: [0.99, 1.99, 2.99, 4.99, 8.99],
	// ram
	1: [0.5, 1, 2, 4, 7, 12, 20],
	// storage
	2: [0.25, 0.5, 1, 2, 4],
}

const cloud_values = {
	// cpu
	0: ["1 vCore", "2 vCore", "4 vCore", "8 vCore", "16 vCore"],
	// ram
	1: ["512 MB", "1 GB", "2 GB", "4 GB", "8 GB", "16 GB", "32 GB"],
	// storage
	2: ["10 GB", "20 GB", "50 GB", "100 GB", "200 GB"],
}

// predefined product adders

function addTestProduct() {
	let productConfig = document.getElementById("product-configuration");
	let config = new Map();

	Array.from(productConfig.children).forEach(element => {
		if (element.tagName != "INPUT") {
			return;
		}
		config.set(element.name, element.value);
	});

	addItemToCart(Object.assign({},all_products.get("test_product")), config);
}

function addEmailProduct() {
	let tiers = document.getElementById("email-tiers");
	let domainField = tiers.querySelector("div > form > input");
	let selectedPlanIndex = -1;
	let product = Object.assign({},all_products.get("invalid_product"));
	let config = new Map();

	Array.from(tiers.children).forEach((child, i) => {
		if (child.getAttribute("data-selected") == "true") {
			selectedPlanIndex = i;
		}
	});

	switch (selectedPlanIndex) {
		case 0:
			product = Object.assign({},all_products.get("mail_basic"));
			break;
		case 1:
			product = Object.assign({},all_products.get("mail_premium"));
			break;
		case 2:
			product = Object.assign({},all_products.get("mail_professional"));
			break;
		default:
			enqueueUpdate("<i class='fa-solid fa-xmark'></i> Invalid plan index", 2);
			return;
	}

	if (domainField.value == "") { // TODO domain lookup
		enqueueUpdate("<i class='fa-solid fa-xmark'></i> Es wird eine Domain benötigt", 2);
		return;
	}
	config.set("domain", domainField.value);

	addItemToCart(product, config);
}

function addCloudProduct() {
	let sliders = document.querySelectorAll("input[type=range]");
	let price = 0.0;
	let product = Object.assign({},all_products.get("cloud"));
	let config = new Map();

	if (sliders.length != 3) {
		return;
	}

	// easier than using loops, etc.

	price += cloud_prices[0][parseInt(sliders[0].value, 10)];
	price += cloud_prices[1][parseInt(sliders[1].value, 10)];
	price += cloud_prices[2][parseInt(sliders[2].value, 10)];

	product.price = price.toFixed(2);;

	config.set("cpu", cloud_values[0][parseInt(sliders[0].value, 10)]);
	config.set("ram", cloud_values[1][parseInt(sliders[1].value, 10)]);
	config.set("storage", cloud_values[2][parseInt(sliders[2].value, 10)]);

	addItemToCart(product, config);
}

// general

function addItemToCart(product, details) {
	if (details instanceof Map) {
		product.details = details;
	}

	appendData(STORAGE_ID_CART, product);
	enqueueUpdate("<i class='fa-solid fa-plus'></i> Zum Warenkorb hinzugefügt", 0);
}

function getCart() {
	return getData(STORAGE_ID_CART);
}

function getItemFromCart(index) {
	let cart = getData(STORAGE_ID_CART);
	return cart[index];
}

function getCartTotal() {
	let cart = getCart();
	let total = 0.0;

	for (let i = 0; i < cart.length; i++) {
		total += parseFloat(cart[i].price.replace(',','.'));
	}
	return total;
}

function removeItemFromCart(index) {
	let cart = getData(STORAGE_ID_CART);

	if (cart[0] == undefined) return;

	cart.splice(index, 1);
	setData(STORAGE_ID_CART, cart);
	enqueueUpdate("<i class='fa-solid fa-minus'></i> Aus Warenkorb entfernt", 0);
}

function clearCart() {
	setData(STORAGE_ID_CART, []);
}

function logCart() {
	console.log(getCart());
}

function printCart() {
	let cartList = document.getElementById("cart-list");
	let internalCart = getCart();

	while (cartList.lastChild) {
		cartList.removeChild(cartList.lastChild)
	}

	for (let i = 0; i < internalCart.length; i++) {
		let node = document.createElement("li");
		node.innerHTML = JSON.stringify(internalCart[i], replacer, 4);
		cartList.append(node);
	}
}

function updateCart() {
	let cart = document.getElementById("cart").getElementsByTagName("tbody")[0];
	let internalCart = getCart();

	if (cart == null) {
		return;
	}

	while (cart.firstChild) {
		cart.removeChild(cart.firstChild);
	}

	if (internalCart.length > 0) {
		while (cart.firstChild) {
			cart.removeChild(cart.firstChild);
		}

		for (let i = 0; i < internalCart.length; i++) {
			let cartItem = document.createElement("tr");
			cartItem.classList.add("cart-item");

			let name = document.createElement("td");
			name.classList.add("cart-item-name");
			name.innerHTML = internalCart[i].name;
			cartItem.append(name);

			let description = document.createElement("td");
			description.classList.add("cart-item-description");
			description.innerHTML = internalCart[i].description;
			cartItem.append(description);
			
			let details = document.createElement("td");
			details.classList.add("cart-item-details");
			
			if (internalCart[i].details.size > 0) {
				internalCart[i].details.forEach(function (value, key) {
					if (value != "") {
						details.innerHTML += key + ": " + value + "<br>";
					}
				});
			}

			cartItem.append(details);
			
			let price = document.createElement("td");
			price.classList.add("cart-item-price");
			price.innerHTML = internalCart[i].price + "€";
			cartItem.append(price);

			let actionTd = document.createElement("td");
			let actionSpan = document.createElement("span");
			let actionI = document.createElement("i");
			actionTd.classList.add("cart-item-actions");
			actionSpan.classList.add("cart-item-actions-button");
			(function(index){
				actionSpan.addEventListener("click", function() {
					removeItemFromCart(index);
					updateCart();
				}, false);
			})(i);
			actionI.classList.add("fa-solid");
			actionI.classList.add("fa-trash");

			actionSpan.append(actionI);
			actionTd.append(actionSpan);
			cartItem.append(actionTd);
			
			cart.append(cartItem);
		}
	} else {
			let cartItem = document.createElement("tr");
			cartItem.classList.add("cart-item");

			let name = document.createElement("td");
			name.classList.add("cart-item-name");
			name.innerHTML = "/";
			cartItem.append(name);

			let description = document.createElement("td");
			description.classList.add("cart-item-description");
			cartItem.append(description);
			
			let details = document.createElement("td");
			details.classList.add("cart-item-details");
			cartItem.append(details);
			
			let price = document.createElement("td");
			price.classList.add("cart-item-price");
			cartItem.append(price);

			let actionTd = document.createElement("td");
			actionTd.classList.add("cart-item-actions");
			cartItem.append(actionTd);
			
			cart.append(cartItem);
	}

	let cartTotal = document.getElementById("cart-total");
	cartTotal.innerHTML = getCartTotal().toFixed(2).replace(".", ",") + "€";
}

/* PRODUCT FUNCTIONALITY */

function selectEmailPlan(index) {
	let selectionContainer = document.getElementById("email-tiers");

	Array.from(selectionContainer.children).forEach((child, i) => {
		let button = child.querySelector("button");

		if (child.hasAttribute("data-selected")) {
			child.classList.remove("white-themed");
			child.classList.remove("darker-themed");
			child.setAttribute("data-selected", "false");
			button.innerHTML = "Auswählen";
		}
		if (i == index) {
			child.classList.add("white-themed");
			child.classList.add("darker-themed");
			child.setAttribute("data-selected", "true");
			button.innerHTML = "Ausgewählt";
		}
	});
}

function updateCloudPrice() {
	let displayPrice = document.getElementById("config-price");
	let sliders = document.querySelectorAll("input[type=range]");
	let price = 0.0;

	if (displayPrice == null || sliders.length != 3) {
		return;
	}

	Array.from(sliders).forEach((slider, i) => {
		price += cloud_prices[i][parseInt(slider.value, 10)];
	});

	displayPrice.innerHTML = price.toFixed(2); + "€";
}

/* INTERNAL API */

const STORAGE_ID_USER = 0;
const STORAGE_ID_CART = 1;

function setData(id, data) {
	localStorage.setItem(id, JSON.stringify(data, replacer));
}

function appendData(id, data) {
	let item = getData(id);

	if (item === null) {
		item = [];
	} else if (!Array.isArray(item)) {
		let temp = item;
		item = [temp];
	}

	item.push(data)

	localStorage.setItem(id, JSON.stringify(item, replacer));
}

function getData(id) {
	let item = localStorage.getItem(id);
	
	return JSON.parse(item, reviver)
}

// from stack over flow: https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map

function replacer(key, value) {
	if(value instanceof Map) {
		return {
			dataType: 'Map',
			value: Array.from(value.entries()), // or with spread: value: [...value]
		};
	} else {
		return value;
	}
}

function reviver(key, value) {
	if(typeof value === 'object' && value !== null) {
		if (value.dataType === 'Map') {
			return new Map(value.value);
		}
	}
	return value;
}

/* SETUP */

if (localStorage.getItem(STORAGE_ID_CART) == null) {
	localStorage.setItem(STORAGE_ID_CART, JSON.stringify([], replacer, 4));
}
updateCloudPrice();
updateCart();