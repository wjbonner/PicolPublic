$(window).load(function () {
    $('#froala-editor').froalaEditor({
        // Licensing parameter
        key: '',

        // Image upload parameters
        imageUploadParam: 'file',
        imageUploadURL: '/Admin/UploadFile',
        imageUploadMethod: 'POST',
        imageMaxSize: 5 * 1024 * 1024, // Set max image size to 5MB.
        imageAllowedTypes: ['jpeg', 'jpg', 'png'], // Allow to upload PNG and JPG.

        // Image manager parameters
        imageManagerPreloader: "", // Set a preloader.
        imageManagerPageSize: 20, // Set page size.
        imageManagerScrollOffset: 10, // Set a scroll offset (value in pixels).
        imageManagerLoadURL: "/Admin/LoadImages",  // Set the load images request URL.
        imageManagerLoadMethod: "GET", // Set the load images request type.
        imageManagerLoadParams: {}, // Additional load params.
        imageManagerDeleteURL: "/Admin/DeleteFile", // Set the delete image request URL.
        imageManagerDeleteMethod: "DELETE", // Set the delete image request type.
        imageManagerDeleteParams: {}, // Additional delete params.

        // File upload
        fileUploadParam: 'file', // Set the file upload parameter.
        fileUploadURL: '/Admin/UploadFile', // Set the file upload URL.
        fileUploadParams: { id: 'my_editor' }, // Additional upload params.
        fileUploadMethod: 'POST', // Set request type.
        fileMaxSize: 20 * 1024 * 1024, // Set max file size to 20MB.
        fileAllowedTypes: ['*'] // Allow to upload any file.
    })
    .on('froalaEditor.image.beforeUpload', function (e, editor, images) {
        // Return false if you want to stop the image upload.
        console.log("Return false if you want to stop the image upload.");
    })
    .on('froalaEditor.image.uploaded', function (e, editor, response) {
        // Image was uploaded to the server.
        console.log("Image was uploaded to the server.");
    })
    .on('froalaEditor.image.inserted', function (e, editor, $img, response) {
        // Image was inserted in the editor.
        console.log("Image was inserted in the editor.");
    })
    .on('froalaEditor.image.replaced', function (e, editor, $img, response) {
        // Image was replaced in the editor.
        console.log("Image was replaced in the editor.");
    })
    .on('froalaEditor.image.removed', function (e, editor, $img) {
        //var i = 0;
        //$.ajax({
        //    // Request method.
        //    method: "POST",

        //    // Request URL.
        //    url: "/Admin/DeleteFile",

        //    // Request params.
        //    data: {
        //        // Get the Id from the URL/SRC
        //        id: $img.attr("src").split('/')[3]
        //    }
        //})
        //.done(function (data) {
        //    console.log('image was deleted');
        //})
        //.fail(function () {
        //    console.log('image delete problem');
        //})
    })
    .on('froalaEditor.image.error', function (e, editor, error, response) {
        // Bad link.
        var i = 0;
        if (error.code == 1) { }

            // No link in upload response.
        else if (error.code == 2) { }

            // Error during image upload.
        else if (error.code == 3) { }

            // Parsing response failed.
        else if (error.code == 4) { }

            // Image too text-large.
        else if (error.code == 5) { }

            // Invalid image type.
        else if (error.code == 6) { }

            // Image can be uploaded only to same domain in IE 8 and IE 9.
        else if (error.code == 7) { }

        // Response contains the original server response to the request if available.
    })
    .on('froalaEditor.imageManager.error', function (e, editor, error, response) {
        // Bad link. One of the returned image links cannot be loaded.
        if (error.code == 10) { }

            // Error during request.
        else if (error.code == 11) { }

            // Missing imagesLoadURL option.
        else if (error.code == 12) { }

            // Parsing response failed.
        else if (error.code == 13) { }
    })
    .on('froalaEditor.imageManager.imagesLoaded', function (e, editor, data) {
        // Do something when the request finishes with success.
        console.log('Images have been loaded.');
    })
    .on('froalaEditor.imageManager.imageLoaded', function (e, editor, $img) {
        // Do something when an image is loaded in the image manager
        console.log('Image has been loaded.');
    })
    .on('froalaEditor.imageManager.beforeDeleteImage', function (e, editor, $img) {
        // Do something before deleting an image from the image manager.
        console.log('Image will be deleted.');

        // Update the delete parameters to the data-id of the image
        editor.opts.imageManagerDeleteParams = { id: $img.attr("data-id") };
    })
    .on('froalaEditor.imageManager.imageDeleted', function (e, editor, data) {
        // Do something after the image was deleted from the image manager.
        console.log('Image has been deleted.');
    });

    $('div#froala-editor').froalaEditor('html.set', $('#Source').val());

    $('#preview').html($('#Source').val());

    $('div#froala-editor').froalaEditor()
    .on('froalaEditor.contentChanged', function (e, editor) {
        $('#preview').html(editor.html.get());
    });

    $('#Save').click(function () {
        var value = $('div#froala-editor').froalaEditor('html.get');
        var id = $('#SettingId').val();

        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Saving...');

        $.ajax({
            type: 'POST',
            url: '/Admin/UpdateSetting',
            data: { id: id, value: value},
            dataType: "json",
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