$(window).load(function () {
    $('#froala-editor').froalaEditor({ key: '' });
    $('div#froala-editor').froalaEditor('html.set', $('#Source').val());
    $('div#froala-editor').froalaEditor()
    .on('froalaEditor.contentChanged', function (e, editor) {
        $('#preview').html(editor.html.get());
    });

    $('#Submit').click(function () {
        var value = $('div#froala-editor').froalaEditor('html.get');
        var acceptedTos = $("#AcceptTos").is(':checked');
        var name = $("#KeyName").val();

        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Submitting...');

        $.ajax({
            type: 'POST',
            url: '/Account/SubmitApiKeyRequest',
            data: { name: name, acceptedTos: acceptedTos, intendedUse: value },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    $('#RequestContainer').empty();
                    $('#RequestContainer').html("<h2>Your request was received.  You are being redirected to the account details page where you can see the status of your request.</h2>");
                    var delay = 8000;
                    setTimeout(function () { window.location = "/Account/Details"; }, delay);

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