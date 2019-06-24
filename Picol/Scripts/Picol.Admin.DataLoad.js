$(window).load(function () {
    GetLoadState();
    setInterval(GetLoadState, 5000);

    $("#StartLoad").click(function () {
        if (confirm('Are you sure you want to start a data transfer, which will halt search capabilities for 5-10 minutes?')) {
            $.ajax({
                type: 'POST',
                url: '/Admin/StartDatabaseLoad',
                data: {},
                dataType: "json",
                cache: false,
                success: function (response) {
                    if (response.Error) {
                        alert(response.ErrorMessage)
                    }

                    GetLoadState();
                },
                error: function (response) {
                    alert('An error has occurred communicating with the server!');
                },
                complete: function (response) {
                    $("#StartLoad").attr('disabled', 'disabled');
                }
            });
        }
    });
});

function GetLoadState() {
    $.ajax({
        type: 'POST',
        url: '/Admin/GetLoadState',
        data: {},
        dataType: "json",
        cache: false,
        success: function (response) {
            if (response.LoadState == "Complete" || response.LoadState == '') {
                $("#LoadStatus").text("The last data load completed successfully, no tasks currently in process.");
                $("#LoadIndicator").css('background-color', 'green');
                $("#StartLoad").removeAttr('disabled');
            } else if (response.LoadState == "InProgress") {
                $("#LoadStatus").text("There is a data load in process.");
                $("#LoadIndicator").css('background-color', 'orange');
                $("#StartLoad").attr('disabled', 'disabled');
            } else if (response.LoadState == "Failed") {
                $("#LoadStatus").text("The last data load failed, and left the data base unusable by the website.  Please notify support.");
                $("#LoadIndicator").css('background-color', 'red');
                $("#StartLoad").removeAttr('disabled');
            }
        },
        error: function (response) {
            //alert('An error has occurred communicating with the server!');
        },
        complete: function (response) {

        }
    });
}