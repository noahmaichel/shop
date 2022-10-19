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
]);

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

	addItemToCart("test_product", config);
}

function addEmailProduct() {
	let tiers = document.getElementById("email-tiers");
	let domainField = tiers.querySelector("div > form > input");
	let selectedPlanIndex = -1;
	let product = "invalid_product";
	let config = new Map();

	Array.from(tiers.children).forEach((child, i) => {
		if (child.getAttribute("data-selected") == "true") {
			selectedPlanIndex = i;
		}
	});

	switch (selectedPlanIndex) {
		case 0:
			product = "mail_basic";
			break;
		case 1:
			product = "mail_premium";
			break;
		case 2:
			product = "mail_professional";
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

// general

function addItemToCart(product_name, details) {
	product = all_products.get(product_name);

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

localStorage.setItem(STORAGE_ID_CART, JSON.stringify([], replacer, 4));