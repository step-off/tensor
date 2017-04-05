;(function(){
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
  				that._sortBtn.text("Завершено!");
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
          array[i].innerHTML = "<i class='number'>"+array[i+1].innerText+"</i>";
          /*array[i+1].innerText = temp;*/
          array[i+1].innerHTML = "<i class='number'>"+temp+"</i>";
          swapped = true;
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
      		}, 7000)
      	})(i);
      }
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
		var beforeSorting = document.createElement("div"),
				afterSorting = document.createElement("div");
		beforeSorting.className = "result result-before";
		beforeSorting.innerHTML = "<h2>Массив <br> до сортировки</h2><span>"+this._randomArray+"</span>";
		afterSorting.className = "result result-after";
		afterSorting.innerHTML = "<h2>Массив <br> после сортировки</h2><span>"+this._sortedArray+"</span>";
		$(".body-wrapper").append(beforeSorting);
		$(".body-wrapper").append(afterSorting);
		setTimeout(function(){
			$(".result-before").addClass("result_animated");
			$(".result-after").addClass("result_animated");
		}, 0);
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
			$(this).off("click");
			$(this).attr("data-disabled", "");
			var button = this;
			setTimeout(function(){
				$(button).addClass("translateLeft");
				$(".sort-btn").addClass("sort-btn_visible");
			}, 2750);
			/*$(this).addClass("disabled");
			//Отменяем обработчик у отключенной кнопки
			$("[data-disabled]").off("click");*/
			e.preventDefault();
			that._setArrayOfRandomNumbers.call(that);
			that._renderNumbers.call(that);
			that._animateNumbersAppearence.call(that, "[data-num-item]", 250);
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
			var span = document.createElement("span"),
					numberWrapper = document.createElement("i");
			$(span).addClass("number-item");
			$(numberWrapper).addClass("number");
			$(span).attr("data-num-item", "");
			$(numberWrapper).text(i);
			$(span).append(numberWrapper);
			$(container).append(span);
			span = null;
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

	

	Animate.prototype._initMethods = function() {
		var that = this;
		this._insertNumbersIntoDOM();
		this._sortNumbers();
	}
	Animate.prototype._animateNumbersAppearence = function(selector, time) {
		var numbers = $(selector);
		for (var i = 0; i < numbers.length; i++){
			(function(i){
					setTimeout(function(){
						$(numbers[i]).addClass("number-item_animated");
					}, 0 + (time*i))
				})(i);
		}
	}
	var test = new Animate();
	test._initMethods();
})();