$(window).load(function () {
    $('#State').change(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Saving...');

        $.ajax({
            type: 'POST',
            url: '/User/SetPreference',
            data: { Name: "State", Value: $('#State').val(), Id: $('#Id').val() },
            dataType: "json",
            traditional: true,
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    $('#OverlayMessage').text('Saved');
                }
            },
            error: function (response) {
                alert('An error has occurred communicating with the server!');
            },
            complete: function (response) {
                $('#OverlayDisplay').hide();
            }
        });
    });

    $('#Year').change(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Saving...');

        $.ajax({
            type: 'POST',
            url: '/User/SetPreference',
            data: { Name: "Year", Value: $('#Year').val(), Id: $('#Id').val() },
            dataType: "json",
            traditional: true,
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    $('#OverlayMessage').text('Saved');
                }
            },
            error: function (response) {
                alert('An error has occurred communicating with the server!');
            },
            complete: function (response) {
                $('#OverlayDisplay').hide();
            }
        });
    });

    $('#I502').change(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Saving...');

        $.ajax({
            type: 'POST',
            url: '/User/SetPreference',
            data: { Name: "I502", Value: $('#I502').val(), Id: $('#Id').val() },
            dataType: "json",
            traditional: true,
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    
                }
            },
            error: function (response) {
                alert('An error has occurred communicating with the server!');
            },
            complete: function (response) {
                $('#OverlayDisplay').hide();
            }
        });
    });

    $('#Essb').change(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Saving...');

        $.ajax({
            type: 'POST',
            url: '/User/SetPreference',
            data: { Name: "Essb", Value: $('#Essb').val(), Id: $('#Id').val() },
            dataType: "json",
            traditional: true,
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {

                }
            },
            error: function (response) {
                alert('An error has occurred communicating with the server!');
            },
            complete: function (response) {
                $('#OverlayDisplay').hide();
            }
        });
    });

    $('#Organic').change(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Saving...');

        $.ajax({
            type: 'POST',
            url: '/User/SetPreference',
            data: { Name: "Organic", Value: $('#Organic').val(), Id: $('#Id').val() },
            dataType: "json",
            traditional: true,
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {

                }
            },
            error: function (response) {
                alert('An error has occurred communicating with the server!');
            },
            complete: function (response) {
                $('#OverlayDisplay').hide();
            }
        });
    });

    $('#IntendedUser').change(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Saving...');

        $.ajax({
            type: 'POST',
            url: '/User/SetPreference',
            data: { Name: "IntendedUser", Value: $('#IntendedUser').val(), Id: $('#Id').val() },
            dataType: "json",
            traditional: true,
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {

                }
            },
            error: function (response) {
                alert('An error has occurred communicating with the server!');
            },
            complete: function (response) {
                $('#OverlayDisplay').hide();
            }
        });
    });

    $('#Ground').change(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Saving...');

        $.ajax({
            type: 'POST',
            url: '/User/SetPreference',
            data: { Name: "Ground", Value: $('#Ground').val(), Id: $('#Id').val() },
            dataType: "json",
            traditional: true,
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {

                }
            },
            error: function (response) {
                alert('An error has occurred communicating with the server!');
            },
            complete: function (response) {
                $('#OverlayDisplay').hide();
            }
        });
    });

    $('#Spanish').change(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Saving...');

        $.ajax({
            type: 'POST',
            url: '/User/SetPreference',
            data: { Name: "Spanish", Value: $('#Spanish').val(), Id: $('#Id').val() },
            dataType: "json",
            traditional: true,
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {

                }
            },
            error: function (response) {
                alert('An error has occurred communicating with the server!');
            },
            complete: function (response) {
                $('#OverlayDisplay').hide();
            }
        });
    });

    $('#Esa').change(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Saving...');

        $.ajax({
            type: 'POST',
            url: '/User/SetPreference',
            data: { Name: "Esa", Value: $('#Esa').val(), Id: $('#Id').val() },
            dataType: "json",
            traditional: true,
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {

                }
            },
            error: function (response) {
                alert('An error has occurred communicating with the server!');
            },
            complete: function (response) {
                $('#OverlayDisplay').hide();
            }
        });
    });
});