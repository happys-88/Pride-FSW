define(['modules/jquery-mozu', "modules/views-collections", "gtm"], function($, CollectionViewFactory, gtm) {
    $(document).ready(function() {
        window.facetingViews = CollectionViewFactory.createFacetedCollectionViews({
            $body: $('[data-mz-category]'),
            template: "category-interior"
        });
    });
    $(document).on("click",".product-link", function (event) {
        var $thisElem = $(event.currentTarget);
        var produrl = $thisElem.attr("data-mz-produrl");
        var prodcode = $thisElem.attr("data-mz-prodcode");
        var cat = $thisElem.attr("data-mz-cat");
        var prodname = $thisElem.attr("data-mz-prodname");
        var prodbrand = $thisElem.attr("data-mz-prodbrand");
        var price = $thisElem.attr("data-mz-price");
        var position = $thisElem.attr("data-mz-position");
        var product = {name: prodname, code: prodcode, price: price, brand: prodbrand, cat: cat, variant: '', position: position, url: produrl};
        gtm.productClick(product);
    });
});