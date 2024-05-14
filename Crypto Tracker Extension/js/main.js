let arrFavsId = [];
let storedPropFavs = [];
let sortOptions = '';
let currencyOption = "";
let isCoinGecko = false;
let page = 1;
let searchKey = '';

if (localStorage.getItem("sortOptions") !== null) {
	sortOptions = localStorage['sortOptions'];
} else {
	sortOptions = "rankAsc";
	localStorage['sortOptions'] = sortOptions;
}

if (localStorage.getItem("currencyOption") !== null) {
	currencyOption = localStorage['currencyOption'];
} else {
	currencyOption = "USD";
	localStorage['currencyOption'] = currencyOption;
}

milliseconds = (new Date).getTime();

if (localStorage.getItem("milliseconds") !== null) {
	storedMS = parseInt(localStorage['milliseconds']);
} else {
	localStorage['milliseconds'] = milliseconds;
	storedMS = parseInt(localStorage['milliseconds']);
}

if (localStorage.getItem("platform") !== null) {
	const platform = localStorage.getItem("platform");
	isCoinGecko = platform === 'CoinGecko';
	$('#platform').val(platform);
}
	
$(document).ready(function () {
	getPageSize();
	start();

	function start(showTop = false) {
		if (((storedMS + (isCoinGecko ? 5000 : 1000)) < milliseconds) || 
		localStorage.getItem("coinGeckoStoredPropFavs") === null || 
		localStorage.getItem("storedPropFavs") === null) {

			if (localStorage.getItem("arrFavsObj") !== null && JSON.parse(localStorage.getItem("arrFavsObj")).length > 0) {
				arrFavsId = JSON.parse(localStorage['arrFavsObj']);
			}
			jQuery('#cryptoTable').html('');			
			jQuery('#cryptoTable').html("<td><div class='spinner-grow' role='status'><span class='sr-only'>Loading...</span></div></td><td><h4>Loading...</h4></td>");
			localStorage['milliseconds'] = (new Date).getTime();
			finalString = arrFavsId?.length > 0 ? arrFavsId.join(",") : searchKey;
			
			$.ajax({
				type: "GET",
				url: isCoinGecko ? ((searchKey?.length === 0 || searchKey === null) ? "https://api.coingecko.com/api/v3/coins/markets?" : "https://api.coingecko.com/api/v3/search?") : "https://api.coincap.io/v2/assets?",
				dataType: "json",
				data: isCoinGecko ? ((searchKey?.length === 0 || searchKey === null) ? {
					ids: showTop ? null : finalString,
					vs_currency: 'usd',
					order: 'market_cap_desc',
					page: page,
					per_page: '100',
					sparkline: false,
				} : {query: searchKey}) : ((searchKey?.length === 0 || searchKey === null) ? {
					ids: showTop ? null : finalString, 
					limit: page === 1 ? 100 : page,
				} : {
					search: searchKey,
					limit: page === 1 ? 100 : page,
				}),
				crossDomain: true,
				success: function (data) {
					if (isCoinGecko) {
						storedPropFavs = ((searchKey?.length === 0 || searchKey === null) ? data : data.coins);
						localStorage['coinGeckoStoredPropFavs'] = JSON.stringify(storedPropFavs);
					} else {
						storedPropFavs = data.data;
						localStorage['storedPropFavs'] = JSON.stringify(storedPropFavs);
					}
					sortDisplay();
				},
				error: function () {
					storedPropFavs = JSON.parse(localStorage[isCoinGecko ? 'coinGeckoStoredPropFavs' : 'storedPropFavs']);
					sortDisplay();		
				}
			});
		} else {		
			storedPropFavs = JSON.parse(localStorage[isCoinGecko ? 'coinGeckoStoredPropFavs' : 'storedPropFavs']);
			sortDisplay();		
		}	
	}

	function displayCoins() {
		jQuery('#cryptoTable').html('');
		for (let propertyName in storedPropFavs) {
			isFav = arrFavsId.findIndex(i => i === storedPropFavs[propertyName].id) > -1 ? true : false;
			b = document.createElement("TR");
			b.id = storedPropFavs[propertyName].id;
			b.innerHTML = "<td id="+storedPropFavs[propertyName].id+" align=\"center\">"+ (isFav ? "<img id="+storedPropFavs[propertyName].id+" src=\"../images/favorite.png\" style=\"width:25px;height:25px;\" style=\"width:25px;height:25px;\">" : "") +"</td>";
			b.innerHTML += isCoinGecko ? "<td align=\"center\"><img src="+(storedPropFavs[propertyName].image ?? storedPropFavs[propertyName].thumb)+" style=\"max-height: 16; max-width: 16\"></td>" : "<td align=\"center\"><img src=\"https://assets.coincap.io/assets/icons/" + storedPropFavs[propertyName].symbol.toLowerCase() + "@2x.png\" style=\"max-height: 16; max-width: 16\"></td>";
			b.innerHTML += "<td>" + storedPropFavs[propertyName].symbol.toUpperCase() + "</td><td align=\"center\">" + storedPropFavs[propertyName][isCoinGecko ? 'market_cap_rank' : 'rank'] + "</td>";
			b.innerHTML += isCoinGecko ? "<td><a href=\"https://www.coingecko.com/en/coins/" + storedPropFavs[propertyName].id + "\" target=\"blank\">" + storedPropFavs[propertyName].name + "</a</td>" : "<td><a href=\"https://coinmarketcap.com/currencies/" + storedPropFavs[propertyName].id + "\" target=\"blank\">" + storedPropFavs[propertyName].name + "</a</td>";
			let num = Number(storedPropFavs[propertyName][isCoinGecko ? 'current_price' : 'priceUsd']);
			b.innerHTML += "<td title="+ storedPropFavs[propertyName][isCoinGecko ? 'current_price' : 'priceUsd'] +" align=\"right\">" + num.toLocaleString(undefined, {
				minimumFractionDigits: 4,
				maximumFractionDigits: 4
			}) + "</td><td></td><td></td>";

			let change24h = storedPropFavs[propertyName][isCoinGecko ? 'price_change_percentage_24h' : 'changePercent24Hr'];
			if (change24h == null) {
				change24h = 0
			}

			if (change24h > 0) {
				b.innerHTML += "<td align=\"center\"><div style=\"background-color: green; color: white; border-radius: 5px; width: 80px\">" + parseFloat(change24h).toFixed(2) + "%</div></td>";
			} else {
				b.innerHTML += "<td align=\"center\"><div style=\"background-color: red; color: white; border-radius: 5px; width: 80px\">" + parseFloat(change24h).toFixed(2) + "%</div></td>";
			}
			$("#cryptoTable").append(b);
			b.addEventListener('click', function handleClick(event) {
				const coinId = $(this).closest('tr').attr('id');
				if ($('td#' +coinId).children()?.length > 0) {
					$('td#' +coinId).empty();
					arrFavsId = arrFavsId.filter(i => i !== coinId);
				} else {
					imgTag = document.createElement("img");
					imgTag.id = storedPropFavs[propertyName].id;
					imgTag.src = "../images/favorite.png";
					imgTag.style = "width:25px;height:25px;"

					$('td#' +coinId).append(imgTag);
					if (arrFavsId.findIndex(i => i === coinId) === -1) {
						arrFavsId.push(coinId);
					}
				}
				localStorage['arrFavsObj'] = JSON.stringify(arrFavsId);
			});
		}
	}

	function sortDisplay(settings) {

		switch (settings) {
		case 'rank':
			if (sortOptions == 'rankAsc') {
				sortOptions = 'rankDesc';
			} else {
				sortOptions = 'rankAsc';
			}
			break;
		case 'name':
			if (sortOptions == 'nameAsc') {
				sortOptions = 'nameDesc';
			} else {
				sortOptions = 'nameAsc';
			}
			break;
		case 'price':
			if (sortOptions == 'priceAsc') {
				sortOptions = 'priceDesc';
			} else {
				sortOptions = 'priceAsc';
			}
			break;
		case 'change':
			if (sortOptions == 'changeAsc') {
				sortOptions = 'changeDesc';
			} else {
				sortOptions = 'changeAsc';
			}
			break;
		}

		switch (sortOptions) {
		case 'rankAsc':
			storedPropFavs.sort(function (a, b) {
				return isCoinGecko ? (a.market_cap_rank - b.market_cap_rank) : (a.rank - b.rank)
			});
			break;
		case 'rankDesc':
			storedPropFavs.sort(function (a, b) {
				return isCoinGecko ? (b.market_cap_rank - a.market_cap_rank) : (b.rank - a.rank)
			});
			break;
		case 'nameAsc':
			storedPropFavs.sort((a, b) => a.name.localeCompare(b.name));
			break;
		case 'nameDesc':
			storedPropFavs.sort((a, b) => b.name.localeCompare(a.name));
			break;
		case 'priceAsc':
			storedPropFavs.sort(function (a, b) {
				return isCoinGecko ? (a.current_price - b.current_price) : (a.priceUsd - b.priceUsd)
			});
			break;
		case 'priceDesc':
			storedPropFavs.sort(function (a, b) {
				return isCoinGecko ? (b.current_price - a.current_price) : (b.priceUsd - a.priceUsd)
			});
			break;
		case 'changeAsc':
			storedPropFavs.sort(function (a, b) {
				return isCoinGecko ? (a.price_change_percentage_24h - b.price_change_percentage_24h) : (a.changePercent24Hr - b.changePercent24Hr)
			});
			break;
		case 'changeDesc':
			storedPropFavs.sort(function (a, b) {
				return isCoinGecko ? (b.price_change_percentage_24h - a.price_change_percentage_24h) : (b.changePercent24Hr - a.changePercent24Hr)
			});
			break;
		}

		localStorage['sortOptions'] = sortOptions;
		displayCoins();
	}

	function getPageSize() {
		$('#pageSize').empty();
		if (isCoinGecko) {
			page = 1;
			for (let i = 1; i <= 20; i++) {
				$('#pageSize').append('<option value=' +i+'>Page '+i+'</option>')
			}
		} else {
			page = 100;
			$('#pageSize').append('<option selected value="100">Top 100</option><option value="200">Top 200</option><option value="500">Top 500</option>')
		}
	}

	$("#rank").click(function () {
		sortDisplay("rank");
	});
	$("#name").click(function () {
		sortDisplay("name");
	});
	$("#price").click(function () {
		sortDisplay("price");
	});
	$("#change").click(function () {
		sortDisplay("change");
	});
	$("#favorite").click(function () {
		searchKey = null;
		$('#coinSearch').val(null)
		start()
	});
	$("#top").click(function () {
		searchKey = null;
		$('#coinSearch').val(null)
		start(true)
	});

	$('#platform').change(function() {
		isCoinGecko = $('#platform').val() === 'CoinGecko';
		getPageSize();
		localStorage['platform'] = $('#platform').val();
		start(true)
	})
	$('#pageSize').change(function() {
		page = $('#pageSize').val();
		searchKey = null;
		$('#coinSearch').val(null)
		start(true)
	})
	$('#coinSearch').keypress(function(e) {
		if (e.which == 13) {
			searchKey = $(this).val()
			start()
			e.preventDefault();
		}
	})
});