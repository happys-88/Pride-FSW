define(
    ['modules/jquery-mozu'],
    function ($) {
        $(function () {
            $('#global-header-wrapper').each(function (index, globalHeader) {
                globalHeader = $(globalHeader);
                var globalHeaderIncludeClosed = sessionStorage.getItem('globalHeaderIncludeClosed');
                if(!globalHeaderIncludeClosed){
                    globalHeader.slideDown();
                }

                globalHeader.on('click','#globalHeaderIncludeCloseBtn',function(){
                    globalHeader.slideUp();
                    sessionStorage.setItem('globalHeaderIncludeClosed', true);
                });

                $("#btnFindStore").click(function(e) {
                e.preventDefault();
                var zipcode = $.trim($("#footerZipCodeInput").val());
                zipcode = (zipcode.length === 0 ? "Enter+Zip" : zipcode);
                window.location.href = window.location.origin + "/store-locator?zipcode=" + zipcode;
                });

                $("#footerZipCodeInput").keydown(function(e) {
                    if (e.which === 13) {
                        $("#btnFindStore").trigger("click");
                    }
                });
            });
        });
    }
);