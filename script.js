let coffeeButtons = document.querySelectorAll('.coffee-item');
let balance = document.querySelector('.coffee-balance input');
let displayText = document.querySelector('.display-text');
let coffeeStatus = "waiting";

let progressBar = document.querySelector('.progress');
let progressBarInner = document.querySelector('.progress-bar');


// Приготовление купюр
for(let i = 0; i < coffeeButtons.length; i++) {
	coffeeButtons[i].onclick = buyCoffee;
}

function buyCoffee() {
	let cost = +this.getAttribute("cost");
	let coffeeName = this.querySelector('img').getAttribute("alt");
	let coffeeImg = this.querySelector('img').getAttribute('src');
	if(coffeeStatus != "waiting") {
		return;
	}
	if(balance.value < cost) {
		displayText.innerText = "Недостаточно средств";
		balance.style.border = "1px solid red";
		return;
	}
	balance.style.border = "";
	balance.value -= cost;
	cookCoffee(coffeeName, coffeeImg);
}

function cookCoffee(name, imageSrc) {
	coffeeStatus = "cooking";

	displayText.innerText = "Ваш " + name.toLowerCase() + " готовится";

	progressBar.classList.remove('d-none');

	let coffeeCup = document.querySelector('.coffee-cup img');
	coffeeCup.classList.remove('d-none');
	coffeeCup.setAttribute('src', imageSrc);
	coffeeCup.style.opacity = 0;

	let t = 0;
	let cookingInterval = setInterval(function() {
		if(t == 100) {
			clearInterval(cookingInterval);
			t = 0;
			displayText.innerText = "Ваш " + name.toLowerCase() + " готов!";
			coffeeStatus = "ready";
			coffeeCup.onclick = getCoffee;
			return;
		}
		t++
		progressBarInner.style.width = t + "%";
		coffeeCup.style.opacity = t/100;
	}, 100)
}

function getCoffee() {
	if (coffeeStatus != "ready") {
		return;
	}
	let cup = this;
	cup.classList.add('d-none');
	displayText.innerText = "Выберите кофе";
	progressBar.classList.add("d-none");
	progressBarInner.style.width = 0;
	coffeeStatus = "waiting";

}

// Drag'n'Drop купюр

let bills = document.querySelectorAll('.wallet img');

for(let i = 0; i< bills.length; i++) {
	bills[i].onmousedown = takeMoney;
}

function takeMoney(e) {
	e.preventDefault();

	let bill = this;

	bill.style.position = "absolute";
	bill.style.transform = "rotate(90deg)";

	let billWidth = bill.getBoundingClientRect().width;
	let billHeight = bill.getBoundingClientRect().height;
		
	bill.style.top = e.clientY - billWidth/2 + 'px';
	bill.style.left = e.clientX - billHeight/2 + 'px';

	window.onmousemove = (e) => {
		bill.style.left = e.clientX - billHeight/2 + 'px';
		bill.style.top = e.clientY - billWidth/2 + 'px';
	}

	bill.onmouseup = dropMoney;
}

function dropMoney() {
	window.onmousemove = null;

	

	let bill = this;
	let billCost = +bill.getAttribute("value");

	if( inAtm(bill) ) {
		bill.remove();
		balance.value = +balance.value + billCost;
	} 

}

function inAtm(bill) {
	let atm = document.querySelector('.coffee-atm');
	let atmCoords = atm.getBoundingClientRect();
	let billCoords = bill.getBoundingClientRect();

	let atmLeftTopCornerX = atmCoords.x;
	let atmLeftTopCornerY = atmCoords.y;
	let atmRightTopCornerX = atmCoords.x + atmCoords.width;
	let atmRightTopCornerY = atmCoords.y;
	let atmLeftBottomCornerX = atmCoords.x;
	let atmLeftBottomCornerY = atmCoords.y + atmCoords.height/3;
	let atmRightBottomCornerX = atmCoords.x + atmCoords.width;
	let atmRightBottomCornerY = atmCoords.y + atmCoords.height/3;

	let billLeftCornerX = billCoords.x;
	let billLeftCornerY = billCoords.y;
	let billRigthCornerX = billCoords.x + billCoords.width;
	let billRigthCornerY = billCoords.y;

	if (billLeftCornerX > atmLeftTopCornerX && billLeftCornerY > atmLeftTopCornerY && billRigthCornerX < atmRightTopCornerX && billLeftCornerY < atmLeftBottomCornerY) {
		return true;
	} else {
		return false;
	}


}