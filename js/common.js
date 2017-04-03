;(function(){
	function Animate() {
		this._randomArray = [];
		this._generateBtn = $("[data-generate]");
		this._sortBtn = $("[data-sort]");
	}

	Animate.prototype._bubbleSort = function(array) {
		var swapped;
    do {
      swapped = false;
      for (var i=0; i < array.length-1; i++) {
        if (array[i] > array[i+1]) {
            var temp = array[i];
            array[i] = array[i+1];
            array[i+1] = temp;
            swapped = true;
        }
      }
    } while (swapped);
	}

	Animate.prototype._getRandomNumber = function(min, max) {
		min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	Animate.prototype._setArrayOfRandomNumbers = function() {
		var that = this;
		this._generateBtn.on("click", function(e){
			//Деляем кнопку генерации отключенной после запуска
			$(this).attr("data-disabled", "");
			$(this).addClass("disabled");
			//Отменяем обработчик у отключенной кнопки
			$("[data-disabled]").off("click");
			e.preventDefault();
			// Генерируем 10 случайных целых чисел от 0 до 100
			for(var i = 0; i < 10; i++) {
				var number = that._getRandomNumber(0,100);
				//Проверяем было ли уже сгенерировано такое число во избежание повторяющихся чисел
				($.inArray(number, that._randomArray) === -1) 
				? //Если число уникально - добавляем в массив
				 that._randomArray.push(number) 
				: //Если нет - проходим итерацию еще раз
						i--
					
					
						
			}
			that._renderNumbers.call(that);
			that._animateNumbersAppearence.call(that);
		});
	}

	Animate.prototype._renderNumbers = function() {
		var that = this,
				numbersContainer = document.createElement("div");
		$(numbersContainer).addClass("number-wrapper");
		$(numbersContainer).attr("data-num-wrapper");
		this._randomArray.forEach(function(i){
			var span = document.createElement("span");
			$(span).addClass("number-item");
			$(span).attr("data-num-item", "");
			$(span).text(i);
			$(numbersContainer).append(span);
			span = null;
		});
		$(".body-wrapper").append(numbersContainer);
	}

	Animate.prototype._swapNumbers = function() {
		var numbersInDOM = $("[data-num-item]");
		//console.log(numbersInDOM)
		for (var i = 0; i < numbersInDOM.length; i++) {
			//console.log(numbersInDOM);
			(function(i){
				setTimeout(function(){
					//console.log(i);
					$(numbersInDOM[i]).css("backgroundColor", "yellow");
				}, 1000 + (1000*i))
			})(i);
		}
	}

	Animate.prototype._initMethods = function() {
		var that = this;
		this._setArrayOfRandomNumbers();
		this._renderNumbers();
		this._sortBtn.on("click", function(){
			that._swapNumbers();
		})
	}
	Animate.prototype._animateNumbersAppearence = function() {
		var numbers = $("[data-num-item]");
		for (var i = 0; i < numbers.length; i++){
			(function(i){
					setTimeout(function(){
						//console.log(i);
						$(numbers[i]).addClass("number-item_animated");
					}, 0 + (500*i))
				})(i);
		}
	}
	var test = new Animate();
	test._initMethods();
})();