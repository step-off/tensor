;(function(){
	"use strict";
	function Animate() {
		this._randomArray = [];
		this._generateBtn = $("[data-generate]");
		this._sortBtn = $("[data-sort]");
		this._sortCounter = 0;
	}

	Animate.prototype._swapNumbers = function(i, interval) {
		var that = this;
		var timeout = setTimeout(function(){
  			var array = $("[data-num-item]");
  			[].forEach.call(array, function(item){
  				$(item).removeClass("item_active");
  				$(item).removeClass("swap_animated");
  			});
  			//Проверяем не окончена ли сортировка
  			var check = that._compareArrays.call(that);
  			if(check === array.length){
  				clearInterval(interval);
  				clearTimeout(timeout);
  				if(that._id) return
  				that._sortBtn.removeClass("disabled");
  				that._sortBtn.addClass("sort-btn_done");
  				that._sortBtn.text("Завершено!");
  				$(".sorting-decsription").addClass("sorting-description_done")
  				that._showResults.call(that);
  				that._id = true;
  			}
  			$(array[i]).addClass("item_active");
        $(array[i+1]).addClass("item_active");
  			var number = parseInt(array[i].innerText),
  					nextNumber = parseInt(array[i+1].innerText)
        if (number > nextNumber) {
        	//that._animateSwamp.call(that, array[i], array[i+1]);
        	/*var distance = $(array[i]).offset().left - $(array[i+1]).offset().left;
          $.when($(array[i]).animate({
          	left: distance
          }, 500),
        		$(array[i+1]).animate({
        			left: -distance
        		}, 500)).done(function(){
          	$(array[i]).css("left", "0px");
          	$(array[i+1]).css("left", "0px");
          	$(array[i+1]).insertBefore($(array[i]));
          })*/
          $(array[i]).addClass("swap_animated");
          $(array[i+1]).addClass("swap_animated");
          var temp = array[i].innerText;
          /*array[i].innerText = array[i+1].innerText;*/
          array[i].innerHTML = "<span class='number'>"+array[i+1].innerText+"</span>";
          /*array[i+1].innerText = temp;*/
          array[i+1].innerHTML = "<span class='number'>"+temp+"</span>";
          /*swapped = true;*/
        } 
  		}, 0 + (750*i))
		}

	Animate.prototype._animateSwamp = function(elem, nextElem) {
		var 
				distance = $(elem).offset().left - $(nextElem).offset().left;

        $.when($(nextElem).animate({
            left: -distance
        }, 1000),
        $(elem).animate({
            left: distance
        }, 1000)).done(function () {
            $(elem).css('left', '0px');
            $(nextElem).css('left', '0px');
            nextElem.parentElement.insertBefore(elem, nextElem);
        });

	}

	Animate.prototype._bubbleSort = function(array) {
		var swapped,
				temp,
				that = this;
    do {
      swapped = false;
      for (var i=0; i < array.length-1; i++) {
      	(function(i){
      		that._swapNumbers.call(that, i, interval);
      		var interval = setInterval(function(){
      			that._swapNumbers.call(that, i, interval);
      		}, 6750)
      		
      	})(i);
      }

      /*for(let i = 0; i < array.length - 1; i++) {
      	(function(i){
	      	let promise = new Promise(function(resolve, reject){
						that._swapNumbers.call(that, i);
						console.log(i)
						resolve(i);
      		});
      		promise.then(that._swapNumbers.call(that, i), null);
	      })(i);
      }*/
    } while (swapped);
	}

	Animate.prototype._compareArrays = function() {
		var numbers = $("[data-num-item]"),
				counter = 0;
		for(var i = 0; i<numbers.length; i++) {
			if(numbers[i].innerText == this._sortedArray[i])
				counter++
		}
		console.log(counter)
		return counter
	}

	Animate.prototype._showResults = function() {
		$(".result-before").clone().appendTo(".body-wrapper");
		$(".result-after").clone().appendTo(".body-wrapper");
		$(".refresh-btn-wrapper").clone().appendTo(".body-wrapper");
		this._refreshTrigger();
		for(let i = 0; i < this._randomArray.length; i++){
			let itemElement = document.createElement("span");
			$(itemElement).text(this._randomArray[i]);
			$(".result-before .items-wrapper").append(itemElement);
			itemElement = null;
		}
		for(let i = 0; i < this._sortedArray.length; i++){
			let itemElement = document.createElement("span");
			$(itemElement).text(this._sortedArray[i]);
			$(".result-after .items-wrapper").append(itemElement);
			itemElement = null;
		}

		setTimeout(function(){
			$(".body-wrapper .result-before").addClass("result_animated");
			$(".body-wrapper .result-after").addClass("result_animated");
		}, 0);
		setTimeout(function(){
			$(".body-wrapper .refresh-btn").addClass("refresh-btn_visible");
		}, 100);
	}

	Animate.prototype._getRandomNumber = function(min, max) {
		min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	Animate.prototype._insertNumbersIntoDOM = function() {
		var that = this;
		this._generateBtn.on("click", function(e){
			//Деляем кнопку генерации отключенной после запуска
			/*$(this).off("click");*/
			$(this).attr("data-disabled", "");
			var button = this;
			setTimeout(function(){
				$(button).addClass("translateLeft");
				$(".sort-btn").addClass("sort-btn_visible");
			}, 2750);
			setTimeout(function(){
				$(".generation-decsription").addClass("generation-decsription_hidden");
			}, 3000);
			setTimeout(function(){
				$(".sorting-decsription").addClass("sorting-decsription_visible");
			}, 3250);
			/*$(this).addClass("disabled");
			//Отменяем обработчик у отключенной кнопки
			$("[data-disabled]").off("click");*/
			e.preventDefault();
			that._setArrayOfRandomNumbers.call(that);
			that._renderNumbers.call(that);
			that._animateNumbersAppearence.call(that, "[data-num-item]", 250, "appear");
		});
	}

	Animate.prototype._sortNumbers = function() {
		var that = this;
		this._sortBtn.on("click", function(){
			$(this).off("click");
			$(this).addClass("disabled");
			this.innerHTML = "Сортируем <span class='sorting-dot'></span> <span class='sorting-dot'></span> <span class='sorting-dot'></span>"
			var numbers = $("[data-num-item]");
			that._bubbleSort(numbers);
		});
	}

	Animate.prototype._setArrayOfRandomNumbers = function() {
		// Генерируем 10 случайных целых чисел от 0 до 100
			for(var i = 0; i < 10; i++) {
				var number = this._getRandomNumber(0,100);
				//Проверяем было ли уже сгенерировано такое число во избежание повторяющихся чисел
				($.inArray(number, this._randomArray) === -1) 
				? //Если число уникально - добавляем в массив
				 this._randomArray.push(number) 
				: //Если нет - проходим итерацию еще раз
						i--					
			}
			//Создаем отсортировааный массив для отображения в конце
			var tempArray = this._randomArray.slice();
			tempArray.sort(function(a,b){
				return a - b;
			});
			this._sortedArray = tempArray;
	}

	Animate.prototype._createNumberItem = function(container) {
		this._randomArray.forEach(function(i){
			var numberContainer = document.createElement("div"),
					numberWrapper = document.createElement("span");
			$(numberContainer).addClass("number-item");
			$(numberWrapper).addClass("number");
			$(numberContainer).attr("data-num-item", "");
			$(numberWrapper).text(i);
			$(numberContainer).append(numberWrapper);
			$(container).append(numberContainer);
			numberContainer = null;
		});
		$(".body-wrapper").append(container);
	}

	Animate.prototype._renderNumbers = function() {
		var numbersContainer = document.createElement("div");
		$(numbersContainer).addClass("number-wrapper");
		$(numbersContainer).attr("data-num-wrapper");
		this._createNumberItem(numbersContainer);
	}

/*	Animate.prototype._renderSortedNumbers = function() {
		var sortedNumbersContainer = document.createElement("div");
		$(sortedNumbersContainer).addClass("numbers-sorted-wrapper");
		$(sortedNumbersContainer).attr("data-sorted-wrapper");
		this._createNumberItem(sortedNumbersContainer);
		var sortedNumbers = sortedNumbersContainer.querySelectorAll("[data-num-item]");
		[].forEach.call(sortedNumbers, function(i){
			$(i).attr("data-sorted-item", "");
			$(i).removeAttr("data-num-item");
		})
	}*/
	Animate.prototype._refresh = function() {
		var that = this;
		$(".body-wrapper .refresh-btn").removeClass("refresh-btn_visible");
		$(".body-wrapper .result").removeClass("result_animated");
		setTimeout(function(){
			$(".body-wrapper .result").removeClass("result_animated");
		}, 100);
		setTimeout(function(){
			that._animateNumbersAppearence.call(that, "[data-num-item]", 250, "disappear");
		}, 200);
		setTimeout(function(){
			$(".sort-btn").removeClass("sort-btn_visible sort-btn_done");
		}, 3000);
		setTimeout(function(){
			$(".sorting-decsription").removeClass("sorting-decsription_visible sorting-description_done");
		}, 3250);
		setTimeout(function(){
			$(".generation-decsription").removeClass("generation-decsription_hidden");
			$(".generate-btn").removeClass("translateLeft");
		}, 3500);
		setTimeout(function(){
			$(".body-wrapper .number-wrapper").remove();
			$(".body-wrapper .result-before").remove();
			$(".body-wrapper .result-after").remove();
			$(".body-wrapper .refresh-btn-wrapper").remove();
		}, 4000)
	}

	Animate.prototype._refreshTrigger = function() {
		var that = this,
				refreshButton = $(".body-wrapper .refresh-btn");
		if(refreshButton) {
			refreshButton.on("click", function(e){
				e.preventDefault();
				that._refresh.call(that);
			});
		}
	}

	Animate.prototype._animateNumbersAppearence = function(selector, time, operation) {
		var numbers = $(selector);
		for (var i = 0; i < numbers.length; i++){
			(function(i){
				if(operation === "appear") {
					setTimeout(function(){
						$(numbers[i]).addClass("number-item_animated");
					}, 0 + (time*i))
				}	else if (operation === "disappear") {
					setTimeout(function(){
						$(numbers[i]).removeClass("number-item_animated");
					}, 0 + (time*i))
				}
				})(i);
		}
	}

	Animate.prototype._initMethods = function() {
		var that = this;
		this._insertNumbersIntoDOM();
		this._sortNumbers();

	}

	var test = new Animate();
	test._initMethods();
})();