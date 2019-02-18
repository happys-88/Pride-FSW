define(['modules/api',
        'modules/backbone-mozu',
        'underscore',
        'modules/jquery-mozu',
        'modules/models-orders',
        'hyprlivecontext',
        'hyprlive',
        'modules/preserve-element-through-render',
        'gtm'],
        function (api, Backbone, _, $, OrderModels, HyprLiveContext, Hypr, preserveElement, gtm) {
          /*
          Our Order Confirmation page doesn't involve too much logic, but our
          order model doesn't include enough details about pickup locations.
          We are running an api call with the fulfillmentLocationCodes of the
          items in the order. The model on the confirmation page will then
          include an array of locationDetails.
          */

          var SignupGuest = Backbone.MozuView.extend({
            templateName: "modules/checkout/confirmation-signup",
            additionalEvents: {
              "click [data-mz-value=submitAccount]":"signup"
          },
          validate: function (payload) {
            var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if(!filter.test(payload.account.emailAddress)) return this.displayMessage(Hypr.getLabel('emailMissing')), false;
            if (!payload.account.emailAddress) return this.displayMessage(Hypr.getLabel('emailMissing')), false;
                  if (!payload.password) return this.displayMessage(Hypr.getLabel('passwordMissing')), false;
                  if (payload.password !== $('#confirmPasswordSignUp').val()) return this.displayMessage(Hypr.getLabel('passwordsDoNotMatch')), false;
                  return true;
              },
                displayMessage: function (msg) {
                  // this.setLoading("false");
                    $('#errorMessageSignUp').html('<span class="mz-validationmessage">' + msg + '</span>');
              },
                displayApiMessage: function (xhr) {
                    if(typeof xhr.message !== 'undefined' && xhr.message !== '') {
                        var errorMsg = xhr.message;
                        if(errorMsg.toLowerCase().indexOf('missing') > -1 ) {
                            var val = errorMsg.split(':');
                            errorMsg = val[1].trim();
                            errorMsg = errorMsg.substr(errorMsg.indexOf(' ')+1, errorMsg.length);
                        }
                        $('#errorMessageSignUp').html('<span class="mz-validationmessage">' + errorMsg + '</span>');
                    }
                },
            showForm: function(e) {
                  var event = e.target.checked;
                  if(event) {
                      $('#signupform').show();
                      $('#emailAddressSignup').val(this.model.attributes.email);
                  } else {
                      $('#signupform').hide();
                  }                  
            },
            signup: function () {
                  var self = this,
                      email = $('#emailAddressSignup').val(),
                      firstName = '',
                      lastName = '',
                      password = $('#passwordSignup').val(),
                      payload = {
                          account: {
                              emailAddress: email,
                              userName: email,
                              firstName: firstName,
                              lastName: lastName,
                              contacts: [{
                                  email: email,
                                  firstName: firstName,
                                  lastNameOrSurname: lastName
                              }]
                          },
                          password: $('#passwordSignup').val()
                      };
                  if (this.validate(payload)) {   
                    //var user = api.createSync('user', payload);
                      // this.setLoading(true);
                      return api.action('customer', 'createStorefront', payload).then(function () {
                          $('#createAccountSignUp').hide();
                          $('#accountCreatedSignUp').show();
                      }, self.displayApiMessage);
                  }
              } 
          });

          var ConfirmationView = Backbone.MozuView.extend({
            templateName: 'modules/confirmation/confirmation-detail',
            events: {
              'click [data-mz-print-order]' : 'printOrder'
            },
            printOrder: function(){
              window.print();
            },
            render: function() {
              Backbone.MozuView.prototype.render.apply(this);
            }
          });

          var ConfirmationModel = OrderModels.Order.extend({
          getLocationData: function(){
            var codes = [];
            var items = this.get('items');

            items.forEach(function(item){
              if (codes.indexOf(item.get('fulfillmentLocationCode'))==-1)
              codes.push(item.get('fulfillmentLocationCode'));
            });

            var queryString = "";
            codes.forEach(function(code, index){
              if (index != codes.length-1){
                queryString += "code eq "+code+" or ";
              } else {
                queryString += "code eq "+code;
              }
            });
            return api.get('locations', {filter: queryString});
          }
        });

          $(document).ready(function(){

            var orderData = require.mozuData('order');
            var orderModel = Backbone.Model.extend(); 
            var order = new orderModel(orderData);
            var view = new SignupGuest({
              model: order,
              el: $('#guestUserSignUp')
            });
            view.render();
            
            var confModel = ConfirmationModel.fromCurrent();
            var items = confModel.get("items").models;
            var str = "";
            for (var i = 0; i < items.length; i++) {
              var product = items[i].get("product");
              if (i == items.length - 1) {
                  str += "productCode eq "+ "'" + product.get("productCode") + "'";
              } else {
                  str += "productCode eq "+ "'" + product.get("productCode") + "'"+ " or ";
              }
              
            }
            var products = [];

            api.request("GET", "/api/commerce/catalog/storefront/products/?filter=(" + str + ")&pageSize="+items.length ).then(function(response){
              var itemsArr = response.items;
              for (var i = 0; i < items.length; i++) {
                  var product = items[i].get("product");
                  var pCode = product.get("variationProductCode") ? product.get("variationProductCode") : product.get("productCode");
                  var pricevalue = items[i].get("unitPrice").saleAmount ? items[i].get("unitPrice").saleAmount : items[i].get("unitPrice").listAmount;
                  var properties = product.get("properties");
                  var brandAttr = _.filter(properties, function(prop) { return prop.attributeFQN == 'tenant~brand' ;  });
                  var brand = '';
                  if(brandAttr.length) {
                      brand = brandAttr[0].values[0].value;
                  }
                  var optionsData = product.get("options").models;
                  var options = '';
                  if (optionsData) {
                    for (var j = 0; j < optionsData.length; j++) {
                        options = options + optionsData[j].get("stringValue");
                        if(j + 1 < optionsData.length) {
                            options = options + ",";
                        }
                    }
                  }
                  var productDiscounts = items[i].get("productDiscounts");
                  var couponCodes = [];
                  var count = 0;
                  count = parseFloat(count);
                  if (productDiscounts && productDiscounts.length > 0) {
                    for (var k = 0; k < productDiscounts.length; k++) {
                      var productDiscount = productDiscounts[k];
                      if (productDiscount.couponCode) {
                        couponCodes[count] = productDiscount.couponCode;
                        count++;
                      }
                    }
                  }
                  var coupon = '';
                  if (couponCodes && couponCodes.length) {
                    for (var l = 0; l < couponCodes.length; l++) {
                      coupon = coupon + couponCodes[l];
                      if (l + 1 < couponCodes.length) {
                        coupon = coupon + ",";
                      }
                    }
                  }
                  var prodObj = findElement(itemsArr, product.get("productCode"));
                  var data = {name: product.get("name"), id: pCode, price: pricevalue, brand: brand, category: prodObj.categories[0].content.name, variant: options, quantity: items[i].get("quantity"), coupon: coupon};
                  products.push(data);
              }
              var transactionId = '';
              var billingInfo = confModel.get("billingInfo");
              if (billingInfo.card) {
                transactionId = billingInfo.card.paymentServiceCardId;
              }
              var shippingDiscounts = confModel.get("shippingDiscounts");
              var orderCoupon = '';
              for (var m = 0; m < shippingDiscounts.length; m++) {
                var shippingDiscount = shippingDiscounts[m];
                if (shippingDiscount.discount && shippingDiscount.discount.couponCode) {
                  orderCoupon = orderCoupon + shippingDiscount.discount.couponCode + ",";
                }
              }
              var orderDiscounts = confModel.get("orderDiscounts");
              for (var s = 0; s < orderDiscounts.length; s++) {
                var orderDiscount = orderDiscounts[s];
                if (orderDiscount.couponCode) {
                  orderCoupon = orderCoupon + orderDiscount.couponCode + ",";
                }
              }

              if (orderCoupon && orderCoupon.length > 0) {
                orderCoupon = orderCoupon.substring(0, orderCoupon.length - 1);
              }
              var orderData = {id:transactionId, total: confModel.get("total"), tax: confModel.get("taxTotal"), shipping: confModel.get("shippingTotal"), coupon: orderCoupon};
              gtm.onOrderConfirmation(orderData, products);
          });
            confModel.getLocationData().then(function(response){
              confModel.set('locationDetails', response.data.items);

              var confirmationView = new ConfirmationView({
                  el: $('#confirmation-container'),
                  model: confModel
              });
              confirmationView.render();
              });

            });
            function findElement (arr, element) {
                var product = _.find(arr, function(el) {
                    return el.productCode == element; 
                });
                return product;
            }
        });