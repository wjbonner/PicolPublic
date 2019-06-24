$(window).load(function () {
    $('#FirstName').change(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Saving...');

        $.ajax({
            type: 'POST',
            url: '/Account/UpdateFirstName',
            data: { Value: $("#FirstName").val() },
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

    $('#LastName').change(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Saving...');

        $.ajax({
            type: 'POST',
            url: '/Account/UpdateLastName',
            data: { Value: $("#LastName").val() },
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

    $('#State').change(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Saving...');

        $.ajax({
            type: 'POST',
            url: '/Account/SetPreference',
            data: { Name: "State", Value: $('#State').val() },
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
            url: '/Account/SetPreference',
            data: { Name: "Year", Value: $('#Year').val() },
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
            url: '/Account/SetPreference',
            data: { Name: "I502", Value: $('#I502').val() },
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
            url: '/Account/SetPreference',
            data: { Name: "Essb", Value: $('#Essb').val() },
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
            url: '/Account/SetPreference',
            data: { Name: "Organic", Value: $('#Organic').val() },
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
            url: '/Account/SetPreference',
            data: { Name: "IntendedUser", Value: $('#IntendedUser').val() },
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
            url: '/Account/SetPreference',
            data: { Name: "Ground", Value: $('#Ground').val() },
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
            url: '/Account/SetPreference',
            data: { Name: "Spanish", Value: $('#Spanish').val() },
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
            url: '/Account/SetPreference',
            data: { Name: "Esa", Value: $('#Esa').val() },
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

    $('[id^="Search_"]').change(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Saving...');

        $.ajax({
            type: 'POST',
            url: '/Account/UpdateSearchName',
            data: { Id: $(this).attr("data-id"), Name: $(this).val() },
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