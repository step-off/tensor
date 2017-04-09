;(function(){
  "use strict";
  //Создаем класс
  function Animate() {
    
    //==== Пишем свойства экземпляру ====
    this._randomArray = [];//Массив, который заполнится сгенерированными числами
    this._generateBtn = $("[data-generate]");//Кнопка "Сгенерировать"
    this._sortBtn = $("[data-sort]");//Кнопка "Сортировать"
    this._statusBtn = $("[data-status]");//Кнопка статуса сортировки 
  }
  
    //==== Пишем методы и свойства в прототип ====
  
  //Метод получения случайного числа от min до max включительно
  Animate.prototype._getRandomNumber = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //Заполняем массив сгенерированными числами
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
      //Создаем отсортировааный массив
      var tempArray = this._randomArray.slice();
      tempArray.sort(function(a,b){
        return a - b;
      });
      //Записываем в свойство отсортированный массив
      this._sortedArray = tempArray;
  }

 //Создаем число для отображения на странице
  Animate.prototype._createNumberItem = function(container) {
    //Проходимся по сформированному массиву сгенерированных чисел
    this._randomArray.forEach(function(i){
      var
        //Создаем обертку числа
         numberContainer = document.createElement("div"),
         //Создаем элемент, который заполним числом
          numberElement = document.createElement("span");
      
      //Присваиваем соответствующие классы и атрибуты
      $(numberContainer).addClass("number-item");
      $(numberElement).addClass("number");
      $(numberContainer).attr("data-num-item", "");
      
      //Вставляем число
      $(numberElement).text(i);
      
      //Вставляем элемент с числом в обертку элемента
      $(numberContainer).append(numberElement);

      //Вставляем обертку элемента с числом в общий контейнер, который принимается в качестве аргумента при вызове метода
      $(container).append(numberContainer);
      numberContainer = null;
    }); 
  }

  //Метод для вставки обертки с числами в DOM
  Animate.prototype._renderNumbers = function() {
    var 
      //Создаем общую обертку для всех чисел
      numbersContainer = document.createElement("div");
    
    $(numbersContainer).addClass("number-wrapper");
    $(numbersContainer).attr("data-num-wrapper");
    
    //Вызываем метод создания числа с общей оберткой в качестве аргумента
    this._createNumberItem(numbersContainer);
    //Вставляем обертку с числами в DOM
    $(".body-wrapper").append(numbersContainer);
  }

  //Анимированное появление чисел
  Animate.prototype._animateNumbersAppearence = function(selector, time, operation) {
    var 
        //Выбираем коллекцию элементов
        numbers = $(selector);
    for (var i = 0; i < numbers.length; i++){
      (function(i){

        if(operation === "appear") {
          //Устанавливаем таймаут для каждой итерации
          setTimeout(function(){
            //Добавляем модификатор появления
            $(numbers[i]).addClass("number-item_animated");
          }, 0 + (time*i))
        } else if (operation === "disappear") {
          setTimeout(function(){
            //Удаляем модификатор появления при операции исчезновения
            $(numbers[i]).removeClass("number-item_animated");
          }, 0 + (time*i))
        }
        })(i);
    }
  }

  //Метод обработки нажатия на кнопку "Сгенерировать"
  Animate.prototype._generateNumbersOnClick = function() {
    var that = this;
    this._generateBtn.on("click", function(e){
      e.preventDefault();
      //Кнопка "Сгенерировать" уезжает влево
      $(this).addClass("translateLeft");
      //Описание для генерации чисел уезжает
      $(".generation-description").addClass("generation-description_hidden");
      
      //Ждем пока завершится анимация появления чисел и меням кнопки и описания
      setTimeout(function(){
        //Приезжает кнопка "Сортировать"
        $(that._sortBtn).addClass("sort-btn_visible");
      }, 2750);
      setTimeout(function(){
        //Приезжает описание сортировки чисел 
        $(".sorting-description").addClass("sorting-description_visible");
      }, 3000);

      //Вызываем методы для формирования и отображения чисел
      that._setArrayOfRandomNumbers.call(that);
      that._renderNumbers.call(that);
      that._animateNumbersAppearence.call(that, "[data-num-item]", 250, "appear");
    });
  }

  //Метод сравнения чисел на странице с отсортированным массивом
  Animate.prototype._compareArrays = function() {
    var numbers = $("[data-num-item]"),
        //Создаем счетчик
        counter = 0;
    for(var i = 0; i < numbers.length; i++) {
      if(numbers[i].innerText == this._sortedArray[i])
        //При совпадении элемента на странице с элементом отсортированного массива, увеличиваем счетчик
        counter++
    }
    //Возвращенный счетчик используем в методе _swapNumbers
    return counter
  }

 //Метод сравнения соседних чисел и смены их значений
  Animate.prototype._swapNumbers = function(i, interval) {
    var that = this;
    //Ставим таймаут на каждую итерацию
    var timeout = setTimeout(function(){
        var 
            //Текущая коллекция элементов с числами
            array = $("[data-num-item]");
        //Убираем анимационные модификаторы в начале каждой итерации
        $(array).each(function(index, elem){
          $(elem).removeClass("item_active");
          $(elem).removeClass("swap_animated");
        });

        //Убираем таймаут и интервал если сортировка окончена
        if(that._stopSort) {
          clearTimeout(timeout);
          clearInterval(interval);
          return
        }

        //Проверяем не окончена ли сортировка вызовом соответствующего метода
        var check = that._compareArrays.call(that);
        if(check === array.length){
          clearInterval(interval);
          clearTimeout(timeout);
          if(that._stopSort) return
          //По окончании сортировки меняем текст описания и кнопки
          setTimeout(function(){
            that._statusBtn.removeClass("disabled");
            that._statusBtn.text("Завершено!");
            $(".status-description").addClass("status-description_done");
            $(".status-description").html("Ура!<br> Мы сделали это!<br> Смотрим результаты.")
            //Вызываем метод показа результатов
            that._showResults.call(that);
          }, 1000);

          //Устанавливаем свойство, показывающее, что сортировка завершена
          that._stopSort = true;
        }
        //В каждой итерации добавляем соседним элементам модификаторы активности
        $(array[i]).addClass("item_active");
        $(array[i+1]).addClass("item_active");
        
        //Сравниваем значения соседних элементов
        var number = parseInt(array[i].innerText),
            nextNumber = parseInt(array[i+1].innerText)
        if (number > nextNumber) {
          //Добавляем анимационные модификаторы
          $(array[i]).addClass("swap_animated");
          $(array[i+1]).addClass("swap_animated");
          //Меняем числовые значения элементов
          var temp = array[i].innerText;
          array[i].innerHTML = "<span class='number'>"+array[i+1].innerText+"</span>";
          array[i+1].innerHTML = "<span class='number'>"+temp+"</span>";
        } 
      }, 0 + (650*i))
    }

  //
  Animate.prototype._bubbleSort = function(array) {
    var that = this;
    for (var i=0; i < array.length-1; i++) {
      (function(i){
        var checker = that.stopSort;
        that._swapNumbers.call(that, i, interval);
        //Ставим интервал со временем каждой итерации
        var interval = setInterval(function(){
          //Вызываем метод сравнения чисел
          that._swapNumbers.call(that, i, interval);
          //Очищаем интервал при окончании сортировки
          if(checker) clearInterval(interval);
        }, 5850);
      })(i);
    }
  }

  //Метод обработки нажатия на кнопку "Сортировать"
  Animate.prototype._sortNumbersOnClick = function() {
    var that = this;
    this._sortBtn.on("click", function(){
      var numbers = $("[data-num-item]");
      //Добавляем модификаторы кнопкам и описаниям
      $(this).addClass("translateLeft");
      $(".sorting-description").addClass("sorting-description_hidden");
      $(that._statusBtn).addClass("status-btn_visible");
      $(".status-description").addClass("status-description_visible");

      //Инициализируем сортировку с коллекцией элементов с числами в кач-ве аргумента
      that._bubbleSort(numbers);
    });
  }

  //Метод показа результата сортировки
  Animate.prototype._showResults = function() {
    //Вставляем клонированные из шаблонов элементы
    $(".result-before").clone().appendTo(".body-wrapper");
    $(".result-after").clone().appendTo(".body-wrapper");
    $(".refresh-btn-wrapper").clone().appendTo(".body-wrapper");
    //Инициализируем метод обработчика нажатия на кнопку "Очистить"
    this._refreshTrigger();

    //Заполняем результаты до сортировки данными из соответствующего массива
    for(let i = 0; i < this._randomArray.length; i++){
      let itemElement = document.createElement("span");
      $(itemElement).text(this._randomArray[i]);
      $(".result-before .items-wrapper").append(itemElement);
      itemElement = null;
    }
    //Заполняем результаты после сортировки данными из соответствующего массива
    for(let i = 0; i < this._sortedArray.length; i++){
      let itemElement = document.createElement("span");
      $(itemElement).text(this._sortedArray[i]);
      $(".result-after .items-wrapper").append(itemElement);
      itemElement = null;
    }
    //Вставляем анимированно результаты сортировки на страницу
    setTimeout(function(){
      $(".body-wrapper .result-before").addClass("result_animated");
      $(".body-wrapper .result-after").addClass("result_animated");
    }, 500);
    //Вставляем кнопку "Очистить"
    setTimeout(function(){
      $(".body-wrapper .refresh-btn").addClass("refresh-btn_visible");
    }, 750);
  }

  //Метод возврата страницы к первоначальному состоянию
  Animate.prototype._refresh = function() {
    var that = this,
        numbersWrapper = $(".items-wrapper");
    //Возвращаем свойства объекта к начальному значению
    this._sortedArray = [];
    this._randomArray = [];
    this._stopSort = false;
    $(".body-wrapper .refresh-btn").removeClass("refresh-btn_visible");
    $(".body-wrapper .result").removeClass("result_animated");

    //Убираем добавленные динамически анимационные модификаторы с элементов
    //Добавляем удаленные модификаторы первоначального состояния элементов
    //Для каждой операции последовательно ставим таймаут для анимационнго эффекта
    setTimeout(function(){
      $(".body-wrapper .result").removeClass("result_animated");
    }, 100);
    setTimeout(function(){
      that._animateNumbersAppearence.call(that, "[data-num-item]", 250, "disappear");
      numbersWrapper.each(function(index, elem){
        $(elem).html("");
      });
    }, 200);
    setTimeout(function(){
      $(that._sortBtn).css("display", "none");
      $(that._sortBtn).removeClass("translateLeft sort-btn_visible");
      $(that._statusBtn).removeClass("status-btn_visible");
    }, 2500);
    setTimeout(function(){
      $(".sorting-description").css("display", "none")
      $(".sorting-description").removeClass("sorting-description_visible sorting-description_hidden");
      $(".status-description").removeClass("status-description_visible");
    }, 2750);
    setTimeout(function(){
      $(".generation-description").removeClass("generation-description_hidden");
      $(".generate-btn").removeClass("translateLeft");
    }, 3000);
    setTimeout(function(){
      $(that._sortBtn).css("display", "inline-block");
      $(".sorting-description").css("display", "block");
      $(that._statusBtn).addClass("disabled");
      $(".status-description").html("Процесс пошел! <br> Ждем...");
      $(that._statusBtn).html(
        "Сортируем <span class='sorting-dot'></span> <span class='sorting-dot'></span> <span class='sorting-dot'></span>"
        );
      $(".status-description").removeClass("status-description_done");
      //Удаляем элементы, вставленные в DOM динамически 
      $(".body-wrapper .number-wrapper").remove();
      $(".body-wrapper .result-before").remove();
      $(".body-wrapper .result-after").remove();
      $(".body-wrapper .refresh-btn-wrapper").remove();
    }, 3500)
  }

 //Метод обработчик вызова очистки страницы по нажатию на кнопку "Очистить"
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
  
  //Инициализация методов
  Animate.prototype._initMethods = function() {
    this._generateNumbersOnClick();
    this._sortNumbersOnClick();
  }
  //Создаем новый объект, инициализируем
  var bubbleSorting = new Animate();
  bubbleSorting._initMethods();
})();