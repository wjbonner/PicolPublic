$(window).load(function () {
    $("input[data-type='string']").change(function () {
        var field = $(this).attr("id");

        $.ajax({
            type: 'POST',
            url: '/Label/UpdateStringField',
            data: { id: $("#Id").val(), field: field, value: $("#" + field).val() },
            dataType: "json",
            success: function (data) {
                if (data.Error) {
                    alert(data.ErrorMessage);
                }
                else {
                    $('#OverlayDisplay').fadeIn();
                    $('#OverlayMessage').text(field + ' updated');
                    $('#OverlayDisplay').fadeOut();
                }
            },
            error: function (data) {
                alert('An error has occurred communicating with the server!');
            }
        });
    });

    $("input[data-type='int']").change(function () {
        var field = $(this).attr("id");

        $.ajax({
            type: 'POST',
            url: '/Label/UpdateIntegerField',
            data: { id: $("#Id").val(), field: field, value: $("#" + field).val() },
            dataType: "json",
            success: function (data) {
                if (data.Error) {
                    alert(data.ErrorMessage);
                }
                else {
                    $('#OverlayDisplay').fadeIn();
                    $('#OverlayMessage').text(field + ' updated');
                    $('#OverlayDisplay').fadeOut();
                }
            },
            error: function (data) {
                alert('An error has occurred communicating with the server!');
            }
        });
    });

    $("select[data-type='string']").change(function () {
        var field = $(this).attr("id");

        $.ajax({
            type: 'POST',
            url: '/Label/UpdateIntegerField',
            data: { id: $("#Id").val(), field: field, value: $("#" + field).val() },
            dataType: "json",
            success: function (data) {
                if (data.Error) {
                    alert(data.ErrorMessage);
                }
                else {
                    $('#OverlayDisplay').fadeIn();
                    $('#OverlayMessage').text(field + ' updated');
                    $('#OverlayDisplay').fadeOut();
                }
            },
            error: function (data) {
                alert('An error has occurred communicating with the server!');
            }
        });
    });

    $("select[data-type='int']").change(function () {
        var field = $(this).attr("id");
        $.ajax({
            type: 'POST',
            url: '/Label/UpdateIntegerField',
            data: { id: $("#Id").val(), field: field, value: $("#" + field).val() },
            dataType: "json",
            success: function (data) {
                if (data.Error) {
                    alert(data.ErrorMessage);
                }
                else {
                    $('#OverlayDisplay').fadeIn();
                    $('#OverlayMessage').text(field + ' updated');
                    $('#OverlayDisplay').fadeOut();
                }
            },
            error: function (data) {
                alert('An error has occurred communicating with the server!');
            }
        });
    });
});