//FIRST MODULE
var budgetController = (function() {
  
  var Expense = function(id,description,value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
     
    if (totalIncome > 0) {
       this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
   
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
      var sum = 0;
      data.allItems[type].forEach( (cur) => {
        sum += cur.value;
      });
      data.totals[type] = sum;
  };

  var data = {
       allItems: {
         exp: [],
         inc: []
       },

       totals: {
         exp:0,
         inc:0
       },
       budget: 0,
       Percentage: -1
  };

  return {
    addItem: function(type, des, val) {
      var newItem,ID;
 

      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      data.allItems[type].push(newItem);
      return newItem;
    },

    deleteItem: function(type, id) {
      var ids, index;

     ids = data.allItems[type].map(function(curr) {return curr.id});
      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      } 

     },

      calculateBudget: function() {
      calculateTotal('inc');
      calculateTotal('exp');

      data.budget = data.totals.inc - data.totals.exp;

      data.Percentage = Math.round((data.totals.exp / data.totals.inc ) * 100);

    },
 
     calculatePercentages: function() {
      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc);
        //data.totals.inc
      });
    },

    getPercentages: function() {
      var allPerc = data.allItems.exp.map(function(curr) {
        return curr.getPercentage();
      });
      return allPerc; 
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.Percentage

      }
    },

    testing: function() {
      console.log(data);
    }
  };
})();

//SECOND MODULE
var UIController = (function() {

  var DOMstrings = {
    InputType: '.add__type',
    InputDescription: '.add__description',
    InputValue: '.add__value',
    InputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel:  '.budget__title--month'

  };

  var formatNumber = function(num, type) {
    var num, numSplit, int, dec, type;

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');
    int = numSplit[0];

    if (int > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    } 

    dec = numSplit[1];
    return (type === 'exp' ? '-' : '+') + '' + int + '.' + dec;  
  };

  var nodeListForEach = function(list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };


  return {
    getInput: function() {

      return {
        type: document.querySelector(DOMstrings.InputType).value,
        description: document.querySelector(DOMstrings.InputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.InputValue).value)
      };  
    },


      addListItem: function(obj,type) {
       var html, newHtml, Node;

       if (type === "inc") {

        Node = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn">x</button></div></div></div>';
       } else if (type === "exp") {

        Node = DOMstrings.expenseContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">x</button></div></div></div>';     
       }

       newHtml = html.replace( "%id%", obj.id);
       newHtml = newHtml.replace( "%description%", obj.description);
       newHtml = newHtml.replace( "%value%", formatNumber(obj.value, type));


       document.querySelector(Node).insertAdjacentHTML('beforeend', newHtml); 
      },

      deleteListItem: function(selectorID) {
      var el = document.getElementById(selectorID);
        el.parentNode.removeChild(el);

      },

      clearFields: function() {
        var fields, fieldsarr;

        fields = document.querySelectorAll(DOMstrings.InputDescription + ',' + DOMstrings.InputValue);

        fieldsarr = Array.prototype.slice.call(fields);
        fieldsarr.forEach( (current, index, array) => {
          current.value = "";
        });
        fieldsarr[0].focus();
      },

      displayBudget: function(obj) {
        var type; 
        
        obj.budget > 0 ? type = 'inc' : type = 'exp';

        document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
        document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
        document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
       
       if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = `${obj.percentage}%`;
       } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '--';
       } 
      },

     displayPercentages: function(percentages) {
        var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
       
         nodeListForEach(fields, function(current, index) {
          if (percentages[index] > 0) {
            current.textContent = `${percentages[index]}%`;
          } else {
            current.textContent = `--`;
          } 
         });
      },

      displayMonth: function() {
        var now, year,month;
         now = new Date();


         months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
         month = now.getMonth();



         year = now.getFullYear();
         document.querySelector(DOMstrings.dateLabel).textContent = `${months[month]} ${year}`;
        
      },
  
      changedType: function() {
          var fields = document.querySelectorAll(
            DOMstrings.InputType + ',' +
            DOMstrings.InputDescription + ',' +
            DOMstrings.InputValue);

            nodeListForEach(fields, function(cur) {
              cur.classList.toggle('red-focus'); 
            })

            document.querySelector(DOMstrings.InputBtn).classList.toggle('.red');
       
       
      },
    getDOMstrings: function() {
      return DOMstrings;
    }
  }
})();


//THIRD MODULES
var controller = (function(budgetCtrl, UICtrl) {
  
  var setUpEventListeners = function() {

  var DOM = UICtrl.getDOMstrings();

      document.querySelector(DOM.InputBtn).addEventListener('click', ctrlAddItem);

      document.addEventListener('keypress', function(event) {
        if (event.keycode === 13 || event.which === 13) {
          ctrlAddItem();
        } 
      })

     
      document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
      document.querySelector(DOM.InputType).addEventListener('change', UICtrl.changedType);
  };


   var updateBudget = function() {
       budgetCtrl.calculateBudget();
       var budget = budgetCtrl.getBudget();
     UICtrl.displayBudget(budget);
   };   

   var updatePercentages = function() {
    budgetCtrl.calculatePercentages();
    var percentages =  budgetCtrl.getPercentages();
    UICtrl.displayPercentages(percentages);
    console.log(percentages);

 
   };

   var ctrlAddItem = function() {
     var input, newItem;

    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      UICtrl.addListItem(newItem, input.type);
      UICtrl.clearFields();
      updateBudget();

      updatePercentages();
  
    } 
   };

   var ctrlDeleteItem = function(event) {
     var itemID, splitID, type, ID;
     itemID = event.target.parentNode.parentNode.parentNode.id;
     
     if (itemID) {
        splitID = itemID.split('-');
        type = splitID[0];
        ID = parseInt(splitID[1]);
        budgetCtrl.deleteItem(type, ID);
        UICtrl.deleteListItem(itemID);
        updateBudget();
        updatePercentages();
     } 
   
    }
 
   return {
     init: function() {
       console.log("App has started");
      setUpEventListeners();
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalExp: 0,
        totalInc: 0,
        percentage: -1
      })
     }
   }

})(budgetController, UIController);

controller.init();                          