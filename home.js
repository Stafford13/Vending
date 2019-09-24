$(document).ready(function () {

loadItems();

$('.button').on('click', function() {

 var id = this.value;
 alert(id);
 var itemInfo = this.value + ': ' + $('#itemName'+id).text();
 $('#itemDisplay').val(itemInfo);
});

var money = 0.00;

$('#addDollar').on('click', function() {
   money+=1.00;
   updateMoney();
 });
$('#addNickel').on('click', function(event){
    money += 0.05;
    updateMoney();
  });
$('#addQuarter').on('click', function(event){
      money+=0.25;
      updateMoney();
    });
$('#addDime').on('click', function(event){
       money+=0.10;
       updateMoney();
     });

$(document).on('click', '#makePurchase', function (){
  var total = $('#totalMoneyDisplay').val();
  var num = $('#itemDisplay').val().substring(0, 1);
  alert(total+', '+ num);
  $.ajax({
    type: 'GET',
    url: 'http://localhost:8080/money/'+ total +'/item/'+ num,
    success: function(change) {
      money=0;

      $('#changeDisplay').val(change.quarters+' Quarters: '+change.dimes+' Dimes : '+change.nickels+' Nickels');
      $('#totalMoneyDisplay').val(money);
      $('#amountDisplay').val('Thank You!');
      loadItems();
    },
    error: function(jqXHR) {
      $('#amountDisplay').val(JSON.parse(jqXHR.responseText).message);
    },
  });
});

$('#returnChange').on('click', function (event) {
var change = money;
money=0;
$('#itemDisplay').val('');
$('#amountDisplay').val('');
$('#totalMoneyDisplay').val('');

var balance = Math.round((change*100));
quarters = Math.floor(balance/25);
balance %= 25;
dimes = Math.floor(balance/10);
balance %= 10;
nickels = Math.floor(balance/5);
balance = 0;
$('#changeDisplay').val(quarters+' Quarters: '+dimes+' Dimes : '+nickels+' Nickels');
change=0;
});

function updateMoney(){
    $('#totalMoneyDisplay').val( money.toFixed(2));};

});

// validation goes here!
//if
//{total} >= item price === Thank You!
//        -> (& removes quantity: 1 from the item)
//{total} > item price === leftover money (item price - total) in change box

function loadItems() {

  $.ajax ({
    type: 'GET',
    url: 'http://localhost:8080/items',
    success: function(data, status) {
      $.each(data, function (index, item) {
        var id = item.id;
        var name = item.name;
        var price = item.price;
        var quantity = item.quantity;
        $('#itemNumber'+id).text(id);
        $('#itemName'+id).text(name);
        $('#itemPrice'+id).text('$ '+price);
        $('#itemQuantity'+id).text('Quantity Left: '+quantity);
      });
    },
    error: function() {
      alert('Failure');
    },
  });
}
//add money
//onclick (#add-dollar)-> adds $1.00 to {total}
//onclick (#add-quarter)-> adds $.25 to {total}
//onclick (#add-dime)-> adds $.10 to {total}
//onclick (#add-nickel)-> adds $.05 to {total}
//{total} goes into #dollar-amount
//{total} != or < item price (on make-purchase click event) === message

// var quarterChange = item.quarters*0.25;
// var dimeChange = item.dimes*0.10;
// var nickelChange = item.nickels*0.05;
// var change = quarterChange+dimeChange+nickelChange;
