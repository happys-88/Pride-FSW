define([
    "modules/jquery-mozu",
    "underscore",
    "hyprlive",
    "modules/backbone-mozu",
    "hyprlivecontext",
    "modules/api" 
], 
function ($, _, Hypr, Backbone, HyprLiveContext, api) {
    var dataLayer = window.dataLayer;
    var GTM = {
        productClick: function(product) {
            console.log(product);
            dataLayer.push({
                'event': 'productClick',
                'ecommerce': {
                  'click': {
                    'actionField': {'list': product.cat},
                    'products': [{
                      'name': product.name,                  
                      'id': product.code,
                      'price': product.price,
                      'brand': product.brand,
                      'category': product.cat,
                      'variant': product.variant,
                      'position': product.position
                     }]
                   }
                 }
            });
        },
        productDetail: function(data) {
            dataLayer.push({
              'ecommerce': {
                'detail': {
                  'actionField': {'list': data.cat},
                  'products': [{
                    'name': data.name,
                    'id': data.code,
                    'price': data.price,
                    'brand': data.brand,
                    'category': data.cat,
                    'variant': data.variant
                   }]
                 }
               }
            });
        },
        productAddToCart: function(product) {
            dataLayer.push({
              'event': 'addToCart',
              'ecommerce': {
                'currencyCode': HyprLiveContext.locals.siteContext.currencyInfo.currencyCode,
                'add': {                               
                  'products': [{                        
                    'name': product.name,
                    'id': product.code,
                    'price': product.price.toString(),
                    'brand': product.brand,
                    'category': product.cat,
                    'variant': product.options,
                    'quantity': product.quantity
                   }]
                }
              }
            });
        },
        familyProdAddToCart: function(products) {
            dataLayer.push({
              'event': 'addToCart',
              'ecommerce': {
                'currencyCode': HyprLiveContext.locals.siteContext.currencyInfo.currencyCode,
                'add': {                               
                  'products': products
                }
              }
            });
        },
        productRemoveFromCart: function(product) {
            dataLayer.push({
              'event': 'removeFromCart',
              'ecommerce': {
                'currencyCode': HyprLiveContext.locals.siteContext.currencyInfo.currencyCode,
                'remove': {                               
                  'products': [{                        
                    'name': product.name,
                    'id': product.code,
                    'price': product.price.toString(),
                    'brand': product.brand,
                    'category': product.cat,
                    'variant': product.options,
                    'quantity': product.quantity
                   }]
                }
              }
            });
        },
        onCheckout: function(products) {
            dataLayer.push({
                'event': 'checkout',
                'ecommerce': {
                  'checkout': {
                    'actionField': {'step': 1, 'option': 'Checkout'},
                    'products': products
                 }
               }
            });
        },
        onCheckoutStep: function(stepName, stepValue) {
            dataLayer.push({
                'event': 'checkoutOption',
                'ecommerce': {
                  'checkout_option': {
                    'actionField': {'step': stepName, 'option': stepValue}
                  }
                }
            });
        },
        onOrderConfirmation: function(orderData, products) {
            dataLayer.push({
              'ecommerce': {
                'purchase': {
                  'actionField': {
                    'id': orderData.id,                         // Transaction ID. Required for purchases and refunds.
                    'affiliation': 'Online Store',
                    'revenue': orderData.total,                     // Total transaction value (incl. tax and shipping)
                    'tax':orderData.tax,
                    'shipping': orderData.shipping,
                    'coupon': orderData.coupon
                  },
                  'products': products
                }
              }
            });
        }
    };
 
    return GTM;

});