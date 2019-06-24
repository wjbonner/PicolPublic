$(window).load(function () {
    CheckDatabaseState();
    setInterval(CheckDatabaseState, 30000);
});

function CheckDatabaseState() {
    $.ajax({
        type: 'POST',
        url: '/Home/GetDatabaseState',
        data: { },
        dataType: "json",
        cache: false,
        success: function (response) {
            if (response.Online) {
                $("#MessageBar").hide();
                console.log("Database is online.")
            }
            else {
                $("#MessageBar").show();
                console.log("Database is offline.")
            }
        },
        error: function (response) {
            //alert('An error has occurred communicating with the server!');
        },
        complete: function (response) {
            
        }
    });
}