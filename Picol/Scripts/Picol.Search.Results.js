$.PageState = {
    // There are dynamically generated members
}

$(window).resize(function () {

});

$(window).load(function () {
    
    
    $("#SaveSearch").click(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Saving search parameters');

        $.ajax({
            type: 'GET',
            url: '/Search/Save',
            data: { parameters: $("#parameters").val() },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.EpaNumbers.length == 0) {
                        // No data in report
                    } else {

                    }
                }
            },
            error: function (response) {
                //alert('An error has occurred communicating with the server!');
            },
            complete: function (response) {
                $('#OverlayDisplay').fadeOut(1000);
            }
        });
    })
});