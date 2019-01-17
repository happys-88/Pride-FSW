define(['modules/api',
        'modules/backbone-mozu',
        'underscore',
        'modules/jquery-mozu',
        'modules/models-orders',
        'hyprlivecontext',
        'hyprlive',
        'modules/preserve-element-through-render'],
        function (api, Backbone, _, $, OrderModels, HyprLiveContext, Hypr, preserveElement) {
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
            confModel.getLocationData().then(function(response){
              confModel.set('locationDetails', response.data.items);

              var confirmationView = new ConfirmationView({
                  el: $('#confirmation-container'),
                  model: confModel
              });
              confirmationView.render();
              });

            });
        });