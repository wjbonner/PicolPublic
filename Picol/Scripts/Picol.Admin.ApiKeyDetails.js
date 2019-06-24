$(window).load(function () {
    $('#Notes').change(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Saving notes...');

        $.ajax({
            type: 'GET',
            url: '/Admin/UpdateApiKeyNotes',
            data: { id: $("#Id").val(), notes: $("#Notes").val() },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    
                }
            },
            error: function (response) {

            },
            complete: function (response) {
                $('#OverlayDisplay').hide();
            }
        });
    });

    $('#Active').change(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Saving active...');

        $.ajax({
            type: 'GET',
            url: '/Admin/ApiKeyActiveToggle',
            data: { id: $("#Id").val() },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    
                }
            },
            error: function (response) {

            },
            complete: function (response) {
                $('#OverlayDisplay').hide();
            }
        });
    });

    $('#Approved').change(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Saving approved...');

        $.ajax({
            type: 'GET',
            url: '/Admin/ApiKeyApprovedToggle',
            data: { id: $("#Id").val() },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    
                }
            },
            error: function (response) {

            },
            complete: function (response) {
                $('#OverlayDisplay').hide();
            }
        });
    });
});