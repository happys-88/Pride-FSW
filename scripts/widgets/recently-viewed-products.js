define(['modules/jquery-mozu', 'underscore', "modules/api", "modules/backbone-mozu", "modules/models-product", "hyprlivecontext", "bxslider", 'slick'],
    function ($, _, api, Backbone, ProductModels, HyprLiveContext, bxslider, slick) {
        var sitecontext = HyprLiveContext.locals.siteContext;
        var cdn = sitecontext.cdnPrefix;
        var siteID = cdn.substring(cdn.lastIndexOf('-') + 1);
        var imagefilepath = cdn + '/cms/' + siteID + '/files';
        var pageContext = require.mozuData('pagecontext');
        $(document).ready(function () {
            var productCollection = [];
            $('[data-mz-recently-viewed-products]').each(function (index, rp) {
                rp = $(rp);
                if (pageContext.isEditMode) {
                    rp.html('<b>Here Goes your Recently Viewed Products</b>');
                    return;
                }
                var config = rp.data('mzRecentlyViewedProducts');
                var template = 'modules/product/recent/recent-products';
                var title = config.title || '';
                var numberToDisplay = HyprLiveContext.locals.themeSettings.maxRecentlyViewedItems || 5;
                var productCodes = []; // = _.pluck(currentProduct.properties[0].values, "value");
                var RecentlyViewedProductsView = Backbone.MozuView.extend({
                    templateName: template
                    /*
                    ,events: {
                        'mouseover [data-mz-swatch-color]': 'selectSwatchOption'
                    },
                    selectSwatchOption: function(e) {
                        var colorCode = $(e.currentTarget).data('mz-swatch-color').toLowerCase();
                        var productCode = $(e.currentTarget).data('mz-product-code');
                        var width = HyprLiveContext.locals.themeSettings.listProductImageWidth;
                        var height = HyprLiveContext.locals.themeSettings.listProductImageHeight;
                        var imagepath = imagefilepath + '/' + productCode + '_' + colorCode + '.jpg?maxWidth=' + width;
                        $(e.target).parents('.product-code').find('.image').attr('src', imagepath);
                    }
                    */
                });

                var existingProducts = $.cookie('recentProducts'),
                    recentProducts = existingProducts ? $.parseJSON(existingProducts) : [];
                var filter = '';
                if (recentProducts.length > 0) {
                    var itemAddedYet = false;
                    for (var prdind = 0; prdind < recentProducts.length; prdind++) {

                        var currentProduct = require.mozuData('product'),
                            currentProductCode = currentProduct ? currentProduct.productCode : 0;
                        if (pageContext.pageType == "product" && currentProductCode === recentProducts[prdind].code) {
                            continue;
                        } else {
                            if (itemAddedYet) filter += ' or ';
                            filter += 'productCode eq ' + recentProducts[prdind].code;
                            itemAddedYet = true;
                        }
                    }
                } else {
                    return;
                }
                if (filter !== "" && filter !== undefined) {
                    var serviceurl = '/api/commerce/catalog/storefront/productsearch/search/?startIndex=0&pageSize=' + HyprLiveContext.locals.themeSettings.maxRecentlyViewedItems + '&filter=' + filter;
                    api.request('GET', serviceurl).then(function (productslist) {
                        var orderedProductList = [];
                        for (var prdind = 0; prdind < recentProducts.length; prdind++) {
                            var productFound = _.findWhere(productslist.items, {
                                productCode: recentProducts[prdind].code
                            });
                            if (productFound)
                                orderedProductList.push(productFound);
                        }
                        var recentProductsCollection = new ProductModels.ProductCollection({
                            items: orderedProductList
                        });
                        var recentProductsView = new RecentlyViewedProductsView({
                            model: recentProductsCollection,
                            el: rp
                        });
                        window.recentProductsView = recentProductsView;
                        recentProductsView.render();
                        if (productslist.items.length > 1) {
                           
                            $('.mz-recently-viewed-products .mz-productlist-list').slick({
                                infinite: false,
                                slidesToShow: 6,
                                dots: true,
                                arrows: false,
                                prevArrow: '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                                nextArrow: '<i class="fa fa-angle-right" aria-hidden="true"></i>',
                                responsive: [{
                                        breakpoint: 1024,
                                        settings: {
                                            slidesToShow: 6
                                        }
                                    },
                                    {
                                        breakpoint: 992,
                                        settings: {
                                            slidesToShow: 4
                                        }
                                    },
                                    {
                                        breakpoint: 768,
                                        settings: {
                                            arrows: true,
                                            dots: false,
                                            slidesToShow: 3
                                        }
                                    },
                                    {
                                        breakpoint: 460,
                                        settings: {
                                            arrows: true,
                                            dots: false,
                                            slidesToShow: 2
                                        }
                                    }

                                ]
                            });
                        }
                        if (productslist.items.length > 0) {
                            rp.prepend('<div class="mz-related-products"> <h3 class="heading-2"><span>' + 'Recently Viewed' + '</span></h3> </div>');
                        }
                    });
                }
            });
        });
    });