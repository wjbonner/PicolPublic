$(window).load(function () {
    $('#Email').keyup(function () {
        if ($('#Email').val().toLowerCase().indexOf("@wsu.edu") >= 0) {
            $("[data-password='true']").css('display', 'none');
        } else {
            $("[data-password='true']").css('display', 'unset');
        }
    }).focus(function () {
        if ($('#Email').val().toLowerCase().indexOf("@wsu.edu") >= 0) {
            $("[data-password='true']").css('display', 'none');
        } else {
            $("[data-password='true']").css('display', 'unset');
        }
    });
});