$.PageState = {
    PasswordMeter: null
}

$(window).resize(function () {

});

$(window).load(function () {
    $('#HelpIcon').attr('title', 'To change your password enter in your current password, and type and confirm your new password.  A display will appear helping you ensure that your password selection meets complexity requirements.');
    $('#HelpIcon').tooltip();

    $.PageState.PasswordMeter = $("#PasswordMeter").progressbar({ width: '96%', color: '#0A8F2B', height: '10px', padding: '0px', margin: '0px' });
    $.PageState.PasswordMeter.progress(0);

    $('#NewPassword').keyup(function () {
        PasswordStrength('NewPassword');
        PasswordMatch('NewPassword', 'PasswordConfirmation');
    }).focus(function () {
        $('#PasswordRequirements').show();
        PasswordStrength('NewPassword');
        PasswordMatch('NewPassword', 'PasswordConfirmation');
    });

    $('#PasswordConfirmation').keyup(function () {
        PasswordMatch('NewPassword', 'PasswordConfirmation');
    }).focus(function () {
        $('#PasswordRequirements').show();
        PasswordMatch('NewPassword', 'PasswordConfirmation');
    });
});

function PasswordStrength(field) {
    // set password variable
    var password = $('#' + field).val();
    var cardinality = 0;
    var complexityRequirements = 0;
    var lengthRequirement = false;

    //validate the length
    if (password.length < 10) {
        $('#length').removeClass('valid').addClass('invalid');
    } else {
        $('#length').removeClass('invalid').addClass('valid');
        lengthRequirement = true;
    }

    //validate lower case letter
    if (password.match(/[a-z]/)) {
        $('#letter').removeClass('invalid').addClass('valid');
        complexityRequirements++;
        cardinality += 26;
    } else {
        $('#letter').removeClass('valid').addClass('invalid');
    }

    //validate capital letter
    if (password.match(/[A-Z]/)) {
        $('#capital').removeClass('invalid').addClass('valid');
        complexityRequirements++;
        cardinality += 26;
    } else {
        $('#capital').removeClass('valid').addClass('invalid');
    }

    //validate number
    if (password.match(/\d/)) {
        $('#number').removeClass('invalid').addClass('valid');
        complexityRequirements++;
        cardinality += 10;
    } else {
        $('#number').removeClass('valid').addClass('invalid');
    }
    //validate special character
    if (!password.match(/^[a-z0-9]+$/i) && password.length > 0) {
        $('#special').removeClass('invalid').addClass('valid');
        complexityRequirements++;
        cardinality += 35;
    } else {
        $('#special').removeClass('valid').addClass('invalid');
    }

    $('#InvalidSubstrings li').each(function () {
        if (password.toLowerCase().indexOf($(this).attr("data-invalid").toLowerCase()) > -1) {
            $(this).removeClass('valid').addClass('failed');
            complexityRequirements = 0;
        } else {
            $(this).removeClass('failed').addClass('valid');
        }
    });

    if (complexityRequirements >= 3 && lengthRequirement) {
        $('#status').removeClass('invalid').addClass('valid');
    } else {
        $('#status').removeClass('valid').addClass('invalid');
    }

    $('#status').text("Your password does " + (complexityRequirements >= 3 && lengthRequirement ? "" : "not") + " meet the requirements.");

    var qualitativeRating = '';
    var entropy = Number(password.length * Math.log(cardinality) / Math.log(2) / 1.5).toFixed(2);
    if (isNaN(entropy)) {
        entropy = 0;
    }

    if (entropy > 100) {
        entropy = 100;
    }

    if (entropy < 25) {
        qualitativeRating = 'Very weak';
    } else if (entropy >= 25 && entropy < 35) {
        qualitativeRating = 'Weak';
    } else if (entropy >= 35 && entropy < 45) {
        qualitativeRating = 'Moderate';
    } else if (entropy >= 45 && entropy < 55) {
        qualitativeRating = 'Good';
    } else if (entropy >= 55 && entropy < 65) {
        qualitativeRating = 'Strong';
    } else if (entropy >= 65) {
        qualitativeRating = 'Very Strong';
    }
    $('#QualitativeStrength').text("Your password is: " + qualitativeRating);
    $.PageState.PasswordMeter.progress(entropy);

    $("#FillBar").css({ 'background-color': getColor((100 - entropy) / 100) });
}

function PasswordMatch(field1, field2) {
    if ($('#' + field1).val() == $('#' + field2).val() && $('#' + field1).val().length > 0) {
        $('#confirm').removeClass('invalid').addClass('valid');
    } else {
        $('#confirm').removeClass('valid').addClass('invalid');
    }
}

function getColor(value) {
    //value from 0 to 1
    var hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
}

(function ($) {
    $.fn.progressbar = function (options) {
        var settings = $.extend({
            width: '300px',
            height: '25px',
            color: '#0ba1b5',
            padding: '0px',
            border: '1px solid #ddd'
        }, options);

        //Set css to container
        $(this).css({
            'width': settings.width,
            'height': settings.height,
            'border': settings.border,
            'border-radius': '5px',
            'overflow': 'hidden',
            'display': 'inline-block',
            'padding': settings.padding,
        });

        // add progress bar to container
        var progressbar = $("<div id='FillBar'></div>");
        progressbar.css({
            'height': settings.height,
            'text-align': 'right',
            'vertical-align': 'middle',
            'color': '#fff',
            'width': '0px',
            'border-radius': '3px',
            'background-color': settings.color
        });

        $(this).append(progressbar);

        this.progress = function (value) {
            var width = $(this).width() * value / 100;
            progressbar.width(width);//.html(value + "");
        }
        return this;
    };

}(jQuery));