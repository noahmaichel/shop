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

/* CART */

const all_products = new Map([
	["invalid_product", {
		name: "Invalid Produkt",
		description: "Invalid",
		price: "999999,99",
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
	["root_ssd_s", {
		name: "Root S - SSD",
		description: "AMD Ryzen™ 5 3600, 64 GB DDR4 RAM, 2 x 512 GB NVMe SSD, 1 Gbit/s",
		price: "44,39",
		details: new Map([
		]),
	}],
	["root_ssd_m", {
		name: "Root M - SSD",
		description: "AMD Ryzen™ 7 3700X, 64 GB DDR4 ECC RAM, 2 x 1 TB NVMe SSD, 1 Gbit/s",
		price: "70,57",
		details: new Map([
		]),
	}],
	["root_ssd_l", {
		name: "Root L - SSD",
		description: "AMD EPYC™ 7502P, 128 GB DDR4 RAM, 2 x 8 TB NVMe SSD, 2 Gbit/s",
		price: "142,56",
		details: new Map([
		]),
	}],
	["root_hdd_s", {
		name: "Root S - HDD",
		description: "AMD Ryzen™ 5 3600, 64 GB DDR4 RAM, 2 x 2 TB HDD, 1 Gbit/s",
		price: "44,39",
		details: new Map([
		]),
	}],
	["root_hdd_m", {
		name: "Root M - HDD",
		description: "AMD Ryzen™ 7 3700X, 64 GB DDR4 ECC RAM, 2 x 8 TB HDD, 1 Gbit/s",
		price: "70,57",
		details: new Map([
		]),
	}],
	["root_hdd_l", {
		name: "Root L - HDD",
		description: "AMD EPYC™ 7502P, 128 GB DDR4 RAM, 4 x 8 TB HDD, 2 Gbit/s",
		price: "142,56",
		details: new Map([
		]),
	}],
	["managed_s", {
		name: "Managed S",
		description: "Intel® Xeon® E3-1270 V3, 16 GB DDR3 ECC, 1024 GB NVMe SSD",
		price: "38,49",
		details: new Map([
		]),
	}],
	["managed_m", {
		name: "Managed M",
		description: "Intel® Xeon® E5-2640, 32 GB DDR3 ECC, 2048 GB NVMe SSD",
		price: "78,72",
		details: new Map([
		]),
	}],
	["managed_l", {
		name: "Managed L",
		description: "Intel® Xeon® E5-2630 V3, 64 GB DDR3 ECC, 4096 GB NVMe SSD",
		price: "142,53",
		details: new Map([
		]),
	}],
	["website_template_starter", {
		name: "Website-Template Starter",
		description: "Website-Erstellung ohne Vorkenntnisse perfekt bis ins Detail",
		price: "4,99",
		details: new Map([
			["template", "twentytwentytwo"]
		]),
	}],
	["website_template_plus", {
		name: "Website-Template Plus",
		description: "Website-Erstellung mit maximaler Gestaltungsfreiheit",
		price: "12,99",
		details: new Map([
			["template", "twentytwentytwo"]
		]),
	}],
	["website_template_pro", {
		name: "Website-Template Pro",
		description: "Website-Erstellung mit maximaler Gestaltungsfreiheit",
		price: "29,99",
		details: new Map([
			["template", "twentytwentytwo"]
		]),
	}],
	["onlineshop_starter", {
		name: "Onlineshop Starter",
		description: "Webshop ohne Vorkenntnisse perfekt bis ins Detail",
		price: "9,99",
		details: new Map([
			["template", "twentytwentytwo"],
			["domain", "deine-domain.de"],
		]),
	}],
	["onlineshop_plus", {
		name: "Onlineshop Plus",
		description: "Webshop mit maximaler Gestaltungsfreiheit",
		price: "12,99",
		details: new Map([
			["template", "twentytwentytwo"],
			["domain", "deine-domain.de"],
		]),
	}],
	["onlineshop_pro", {
		name: "Onlineshop Pro",
		description: "Webshop mit maximaler Gestaltungsfreiheit",
		price: "29,99",
		details: new Map([
			["template", "twentytwentytwo"],
			["domain", "deine-domain.de"],
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

	if (productConfig != undefined) {
		Array.from(productConfig.children).forEach(element => {
			if (element.tagName != "INPUT") {
				return;
			}
			config.set(element.name, element.value);
		});
	}

	addItemToCart(Object.assign({}, all_products.get("test_product")), config);
}

function addEmailProduct() {
	let tiers = document.getElementById("email-tiers");
	let domainField = tiers.querySelector("div > form > input");
	let selectedPlanIndex = -1;
	let product = Object.assign({}, all_products.get("invalid_product"));
	let config = new Map();

	Array.from(tiers.children).forEach((child, i) => {
		if (child.getAttribute("data-selected") == "true") {
			selectedPlanIndex = i;
		}
	});

	switch (selectedPlanIndex) {
		case 0:
			product = Object.assign({}, all_products.get("mail_basic"));
			break;
		case 1:
			product = Object.assign({}, all_products.get("mail_premium"));
			break;
		case 2:
			product = Object.assign({}, all_products.get("mail_professional"));
			break;
		default:
			enqueueUpdate("<i class='fa-solid fa-xmark'></i> Invalid plan index", 2);
			return;
	}

	if (domainField.value == "" || !isValidDomain(domainField.value)) { // TODO domain lookup
		enqueueUpdate("<i class='fa-solid fa-xmark'></i> Es wird eine Domain benötigt", 2);
		return;
	}
	config.set("domain", domainField.value);

	addItemToCart(product, config);
}

function addCloudProduct() {
	let sliders = document.querySelectorAll("input[type=range]");
	let price = 0.0;
	let product = Object.assign({}, all_products.get("cloud"));
	let config = new Map();

	if (sliders.length != 3) {
		return;
	}

	// easier than using loops, etc.

	price += cloud_prices[0][parseInt(sliders[0].value, 10)];
	price += cloud_prices[1][parseInt(sliders[1].value, 10)];
	price += cloud_prices[2][parseInt(sliders[2].value, 10)];

	product.price = price.toFixed(2);

	config.set("cpu", cloud_values[0][parseInt(sliders[0].value, 10)]);
	config.set("ram", cloud_values[1][parseInt(sliders[1].value, 10)]);
	config.set("storage", cloud_values[2][parseInt(sliders[2].value, 10)]);

	addItemToCart(product, config);
}

function addServerProduct(plan) {
	let product = Object.assign({}, all_products.get("invalid_product"));
	let config = new Map();

	switch (plan) {
		case "ssd_s":
			product = Object.assign({}, all_products.get("root_ssd_s"));
			break;
		case "ssd_m":
			product = Object.assign({}, all_products.get("root_ssd_m"));
			break;
		case "ssd_l":
			product = Object.assign({}, all_products.get("root_ssd_l"));
			break;
		case "hdd_s":
			product = Object.assign({}, all_products.get("root_hdd_s"));
			break;
		case "hdd_m":
			product = Object.assign({}, all_products.get("root_hdd_m"));
			break;
		case "hdd_l":
			product = Object.assign({}, all_products.get("root_hdd_l"));
			break;
		case "managed_s":
			product = Object.assign({}, all_products.get("managed_s"));
			break;
		case "managed_m":
			product = Object.assign({}, all_products.get("managed_m"));
			break;				
		case "managed_l":
			product = Object.assign({}, all_products.get("managed_l"));
			break;
	}

	addItemToCart(product, config);
}

function addWebsiteTemplateProduct() {
	let plan = document.getElementById("website-config-plan");
	let selectedPlanIndex = -1;

	Array.from(plan.children).forEach((child, i) => {
		if (child.getAttribute("data-selected") == "true") {
			selectedPlanIndex = i;
		}
	});

	if (selectedPlanIndex < 0) {
		enqueueUpdate("failed to get selected plan", 2);
		return;
	}

	let template = document.getElementById("website-config-template").children[0];
	let selectedTemplateIndex = -1;

	Array.from(template.children).forEach((child, i) => {
		if (child.getAttribute("data-selected") == "true") {
			selectedTemplateIndex = i;
		}
	});

	if (selectedTemplateIndex < 0) {
		enqueueUpdate("failed to get selected template", 2);
		return;
	}

	let product = Object.assign({}, all_products.get("invalid_product"));
	let config = new Map();

	switch (selectedPlanIndex) {
		case 0:
			product = Object.assign({}, all_products.get("website_template_starter"));
			break;
		case 1:
			product = Object.assign({}, all_products.get("website_template_plus"));
			break;
		case 2:
			product = Object.assign({}, all_products.get("website_template_pro"));
			break;
		default:
			enqueueUpdate("<i class='fa-solid fa-xmark'></i> Invalid plan index", 2);
			return;
	}

	switch (selectedTemplateIndex) {
		case 0:
			config.set("template", "Twenty Twenty-Two")
			break;
		case 1:
			config.set("template", "Astra")
			break;
		case 2:
			config.set("template", "Twenty Twenty")
			break;
		case 3:
			config.set("template", "Kadence")
			break;
		case 4:
			config.set("template", "PopularFX")
			break;
		default:
			break;
	}

	addItemToCart(product, config);
}

function addOnlineshopProduct() {
	let plan = document.getElementById("website-config-plan");
	let selectedPlanIndex = -1;

	Array.from(plan.children).forEach((child, i) => {
		if (child.getAttribute("data-selected") == "true") {
			selectedPlanIndex = i;
		}
	});

	if (selectedPlanIndex < 0) {
		enqueueUpdate("failed to get selected plan", 2);
		return;
	}

	let template = document.getElementById("website-config-template").children[0];
	let selectedTemplateIndex = -1;

	Array.from(template.children).forEach((child, i) => {
		if (child.getAttribute("data-selected") == "true") {
			selectedTemplateIndex = i;
		}
	});

	if (selectedTemplateIndex < 0) {
		enqueueUpdate("failed to get selected template", 2);
		return;
	}

	let product = Object.assign({}, all_products.get("invalid_product"));
	let config = new Map();

	switch (selectedPlanIndex) {
		case 0:
			product = Object.assign({}, all_products.get("onlineshop_starter"));
			break;
		case 1:
			product = Object.assign({}, all_products.get("onlineshop_plus"));
			break;
		case 2:
			product = Object.assign({}, all_products.get("onlineshop_pro"));
			break;
		default:
			enqueueUpdate("<i class='fa-solid fa-xmark'></i> Invalid plan index", 2);
			return;
	}

	switch (selectedTemplateIndex) {
		case 0:
			config.set("template", "Twenty Twenty-Two")
			break;
		case 1:
			config.set("template", "Astra")
			break;
		case 2:
			config.set("template", "Twenty Twenty")
			break;
		case 3:
			config.set("template", "Kadence")
			break;
		case 4:
			config.set("template", "PopularFX")
			break;
		default:
			break;
	}
	
	let domainField = document.getElementById("website-config-domain");

	if (domainField.value == "" || !isValidDomain(domainField.value)) { // TODO domain lookup
		enqueueUpdate("<i class='fa-solid fa-xmark'></i> Es wird eine Domain benötigt", 2);
		return;
	}
	config.set("domain", domainField.value);

	addItemToCart(product, config);
}

// general

function addItemToCart(product, details) {
	if (details instanceof Map) {
		product.details = details;
	}

	appendData(STORAGE_ID_CART, product);
	enqueueUpdate("<i class='fa-solid fa-plus'></i> Zum Warenkorb hinzugefügt", 0);
	updateCartIndicator();
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
	updateCartIndicator();

	let cartTable = document.getElementById("cart");
	let internalCart = getCart();

	if (cartTable == null) {
		return;
	}

	let cart = cartTable.getElementsByTagName("tbody")[0];

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
						details.innerHTML += key.charAt(0).toUpperCase() + key.slice(1) + ": " + value + "<br>";
					}
				});
			}

			cartItem.append(details);
			
			let price = document.createElement("td");
			price.classList.add("cart-item-price");
			price.innerHTML = internalCart[i].price.replace(".", ",") + "€";
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

			let checkout = document.getElementById("checkout-button");
			checkout.style.opacity = 1.0;
			checkout.setAttribute("href", "./checkout.html");
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

			let checkout = document.getElementById("checkout-button");
			checkout.style.opacity = 0.6;
			checkout.removeAttribute("href");
	}

	let cartTotal = document.getElementById("cart-total");
	cartTotal.innerHTML = getCartTotal().toFixed(2).replace(".", ",") + "€";
}

function updateCartIndicator() {
	let indicator = document.getElementById("nav-cart-indicator");

	if (getCart().length > 0) {
		indicator.style.display = "block";
	} else {
		indicator.style.display = "none";
	}
}

/* SITE FUNCTIONALITY */

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

function setRootServerType(index) {
	let ssdSwitch = document.getElementById("ssd-switch");
	let hddSwitch = document.getElementById("hdd-switch");
	let ssdOffers = document.getElementById("rootserver-ssd");
	let hddOffers = document.getElementById("rootserver-hdd");

	switch (index) {
		case 0:
			ssdSwitch.setAttribute("data-selected", "true");
			hddSwitch.setAttribute("data-selected", "false");
			ssdOffers.setAttribute("data-selected", "true");
			hddOffers.setAttribute("data-selected", "false");
			break;
		case 1:
			ssdSwitch.setAttribute("data-selected", "false");
			hddSwitch.setAttribute("data-selected", "true");
			ssdOffers.setAttribute("data-selected", "false");
			hddOffers.setAttribute("data-selected", "true");
			break;
	}
}

function setWebsiteTemplate(index) {
	let templates = document.getElementById("website-config-template");
	let allTemplates = templates.children[0].children;
	let activeTemplate = allTemplates[index];
	
	Array.from(allTemplates).forEach(element => {
		element.setAttribute("data-selected", "false");
	});
	activeTemplate.setAttribute("data-selected", "true");

	let title = document.getElementById("website-config-title");
	let image = document.getElementById("website-config-image");
	
	switch (index) {
		case 0:
			title.innerHTML = "Twenty Twenty-Two";
			image.src = "../../assets/website-templates/twentytwentytwo.jpg";
			break;
		case 1:
			title.innerHTML = "Astra";
			image.src = "../../assets/website-templates/astra.jpg";
			break;
		case 2:
			title.innerHTML = "Twenty Twenty";
			image.src = "../../assets/website-templates/twentytwo.jpg";
			break;
		case 3:
			title.innerHTML = "Kadence";
			image.src = "../../assets/website-templates/kadence.jpg";
			break;
		case 4:
			title.innerHTML = "PopularFX";
			image.src = "../../assets/website-templates/popularfx.jpg";
			break;
		default:
			break;
	}
}

function setWebsiteTemplateTier(index) {
	let options = document.getElementById("website-config-plan");
	let allOptions = options.children;
	let activeOption = allOptions[index];

	Array.from(allOptions).forEach(element => {
		element.setAttribute("data-selected", "false");
	});
	activeOption.setAttribute("data-selected", "true");

	let advantages = document.getElementById("website-config-plan-advantages");
	let price = document.getElementById("website-config-price");

	switch (index) {
		case 0:
			advantages.children[0].innerHTML = "Website-Erstellung ohne Vorkenntnisse perfekt bis ins Detail";
			advantages.children[1].innerHTML = "Domain 1 Jahr inklusive";
			advantages.children[2].innerHTML = "Professionelle E-Mail-Adresse inklusive";
			price.innerHTML = all_products.get("website_template_starter").price;
			break;
		case 1:
			advantages.children[0].innerHTML = "Website-Erstellung mit maximaler Gestaltungsfreiheit";
			advantages.children[1].innerHTML = "Domain 1 Jahr inklusive";
			advantages.children[2].innerHTML = "Mehrsprachige Website";
			price.innerHTML = all_products.get("website_template_plus").price;
			break;
		case 2:
			advantages.children[0].innerHTML = "Website-Erstellung mit maximaler Gestaltungsfreiheit";
			advantages.children[1].innerHTML = "Mehrsprachige Website";
			advantages.children[2].innerHTML = "Dynamische-Websites";
			price.innerHTML = all_products.get("website_template_pro").price;
			break;
		default:
			break;
	}
}

function updateCheckout() {
	let total = getCartTotal();
	let paymentPrice = document.getElementById("payment-price");
	let paymentTax = document.getElementById("payment-tax");
	let paymentTotal = document.getElementById("payment-total");

	if (!paymentPrice || !paymentTax || !paymentTotal) {
		return;
	}

	paymentPrice.innerHTML = (total * 0.81).toFixed(2).replace(".", ",") + "€";
	paymentTax.innerHTML = (total * 0.19).toFixed(2).replace(".", ",") + "€";
	paymentTotal.innerHTML = total.toFixed(2).replace(".", ",") + "€";
}

function processPayment() {
	// verify payment method input
	let methods = document.querySelectorAll("div.payment-method input[type='radio']");
	let proceed = true;

	Array.from(methods).forEach(element => {
		if (element.checked) {
			if (element.id == "payment-paypal") {
				enqueueUpdate('<i class=\'fa-solid fa-xmark\'></i> PayPal ist derzeit nicht verfügbar', 2);
				proceed = false;
				return;
			}

			let fields = element.parentElement.querySelectorAll("div.payment-method-layout input");

			for (let i = 0; i < fields.length; i++) {
				if (fields[i].value == "") {
					enqueueUpdate('<i class=\'fa-solid fa-xmark\'></i> Unvollständige Angaben', 2);
					proceed = false;
					return;
				}
			}
		}
	});

	// verify tos, ...
	let tosCheckbox = document.getElementById("payment-accept-requirements");
	
	if (!tosCheckbox.checked) {
		enqueueUpdate('<i class=\'fa-solid fa-xmark\'></i> Du musst die AGB und Datenschutzbestimmungen akzeptieren.', 2);
		proceed = false;
	}

	if (proceed) {
		location.href = "order-complete.html";
		clearCart();
	}
}

/* INTERNAL API */

const STORAGE_ID_CART = 0;

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

function preloadImage(url)
{
    var img = new Image();
    img.src = url;
}

function isValidDomain(domain) {
	let re = new RegExp("^(?!-)[A-Za-z0-9-]+([\\-\\.]{1}[a-z0-9]+)*\\.[A-Za-z]{2,6}$"); 
    return domain.match(re);
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
updateCheckout();

// preload images

preloadImage("../../assets/brand/Logo-red.png");
preloadImage("../../assets/website-templates/twentytwentytwo.jpg");
preloadImage("../../assets/website-templates/astra.jpg");
preloadImage("../../assets/website-templates/twentytwo.jpg");
preloadImage("../../assets/website-templates/kadence.jpg");
preloadImage("../../assets/website-templates/popularfx.jpg");

// prevent form submit on enter

Array.from(document.querySelectorAll("form")).forEach(element => {
	element.onsubmit = (event) => {
		event.preventDefault();
	}
});
