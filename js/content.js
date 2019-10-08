const RohlikBabisPlugin = {
	babisBrands: [
		'vodňanské',
		'vodňany',
		'vodňanská',
		'tatra',
		'kostelecké uzeniny',
		'kmotr',
		'olma',
		'penam',
		'papei',
		'odkolek',
		'delta',
	],
	imgUrl: typeof chrome != "undefined" ? chrome.extension.getURL("babis.png") : safari.extension.baseURI + 'babis.png',
	showImages: function () {
		// Autocomplete
		RohlikBabisPlugin.replaceImages('img.Whisperer_image');
		RohlikBabisPlugin.replaceImages('.whisperer-product__img img');
		
		// Catalog / Cart "Don't forget" / Cart "Help us save ..."
		RohlikBabisPlugin.replaceImages('img.productCard__img');
		
		// Favorites / Side cart
		RohlikBabisPlugin.replaceImages('img.grocery-image-placeholder', 'div.products-table__product', '.products-table__name');
		
		// Side cart
		RohlikBabisPlugin.replaceImages('img.itemImage');
		
		// Cart - list of purchased items
		RohlikBabisPlugin.replaceImages('span img.image');
		
		// Detail
		RohlikBabisPlugin.replaceImages('#productDetail .clickable div span img', '#productDetail', '.redirect_link.active')
	},
	replaceImages: function (imgSelector, containerSelector, nameSelector) {
		document.querySelectorAll(imgSelector).forEach(function (img) {
			// [src!="' + RohlikBabisPlugin.imgUrl + '"]:not(".babis__processed")
			if (img.getAttribute('src') === RohlikBabisPlugin.imgUrl) {
				return;
			}
			
			if (img.classList.contains("babis__processed")) {
				return;
			}
			
			let productName = img.getAttribute('name') || img.getAttribute('alt');
			
			if (!productName) {
				if (containerSelector && nameSelector) {
					let titleElement = img.closest(containerSelector).querySelector(nameSelector);
					if (titleElement) {
						productName = titleElement.innerText;
					}
				}
			}
			
			if (!productName) {
				return;
			}
			
			productName = productName.trim().toLowerCase();
			
			let found = false;
			for (let i = 0; i < RohlikBabisPlugin.babisBrands.length; i++) {
				let brand = RohlikBabisPlugin.babisBrands[i];
				
				if (RohlikBabisPlugin.wordInString(productName, brand)/* && productName.indexOf(brand) === 0*/) {
					img.setAttribute('src', RohlikBabisPlugin.imgUrl);
					found = true;
				}
			}
			
			if (found === false) {
				img.classList.add('babis__processed');
			}
		});
	},
	wordInString: function (s, word) {
		s = s.replace("(", " ").replace(")", " ");
		
		const arr = s.split(/\s+/);
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] === word) {
				return true;
			}
		}
		
		return false;
	}
};

window.setInterval(RohlikBabisPlugin.showImages, 100);
