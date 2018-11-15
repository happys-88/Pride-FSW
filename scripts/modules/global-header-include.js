define(
    ['modules/jquery-mozu', 'hyprlive'],
    function ($,Hypr) {
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
                    console.log("btnFindStore");
                e.preventDefault();
                var zipcode = $.trim($("#footerZipCodeInput").val());
                // zipcode = (zipcode.length === 0 ? "Enter+Zip" : zipcode);
                if(zipcode.length > 4) {
                    $('#zipcodeHelpBlock').text('');
                window.location.href = window.location.origin + "/store-locator?zipcode=" + zipcode;
                } else {
                    $('#zipcodeHelpBlock').text(Hypr.getLabel('zipCodeEmpty'));
                }
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