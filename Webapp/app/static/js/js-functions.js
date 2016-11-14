/* Input: integer kSamples
 * Number of columns (samples) to be made visible
 *
 * Function to unset is-hidden attribute of sample columns of
 * Physical activity form. Checks if value input is in range.
 * If it isn't corrects to closest value in range */

function setNSamplesVisible(e) {

    var status = verifyField(2,10,e);

    addSampleChild('#physicalSample', 'physical', e);
    addSampleChild('#bloodSample', 'blood', e);

    if (!status)
        return;

    /* Keep both values and danger status' the same */
    $("#kSamples").val(e.target.value);
    $('#kSamples').removeClass('is-danger');
    $("#kBloodSamples").val(e.target.value);
    $("#kBloodSamples").removeClass('is-danger');

}

/* Function to hide notification when corner X is clicked */
function hideNotification(parent) {
    $(parent).addClass('is-hidden');
}

/* Individual verification of form fields. If value out of range
 * field box turns red.
 *
 * Note: Just an initial check. If form is submitted, notifications
 * will appear to further inform user of field imput error 				*/

function verifyField(low, high, e) {
    if(parseInt(e.target.value) < low || parseInt(e.target.value) > high || isNaN(e.target.value)) {
        $(e.target).addClass('is-danger');
        return false;
    }

    $(e.target).removeClass('is-danger');
    return true;
}

/* Function for displaying notification error message upon leaving form fields 				*
 *																							*
 * Note: Not being used. To implement use in form fields with onblur(notification #), and 	*
 *notification number as an argument														*/

function showError(low, high, notification, e) {

    var totalCarbs = e.target.verifyField(low, high, e);

    if( isNaN(totalCarbs) || parseInt(totalCarbs) < low || parseInt(totalCarbs) > high  )
        $(notification).removeClass('is-hidden');

}

/* Form submission verification function. 																*
 *																										*
 * Note: Returning false blocks form from actually submitting data. Only submit if all data checks out. */



/* Function for clearing a form. Input is form id. */
function resetform() {
    /* Clears form */
    document.getElementById('myForm').reset();

    /* Remove is-danger class to field element. Removes red border. */
    var len = document.getElementsByClassName("input").length - 1;
    for ( ; len >= 0; len--) {
        document.getElementsByClassName("input")[len].classList.remove("is-danger");
    }
}


/* Function that disables submit button until all data is filled in and within valid range.
 * Checking if a value is within range can be controlled by the is-danger class. If element
 * has this class it means the value contained is out of range. Function verifyField(low, high, e)
 * controls this.
 */
(function() {
    $('input').keyup(function() {
        var isValid = false;

        $('input').each(function() {

            if ($(this).val() === '' || $(this).hasClass("is-danger"))
                isValid = true;
        });

        if (isValid) {
            $('#button').attr('disabled', 'disabled');
        }
        else {
            $('#button').removeAttr('disabled');
        }
    });
})();


/* Function adds or removes form fields according to input. Used in Personal Sensitivity page.
 * Called by setNSamplesVisible(id,e) after checking if value is within range (2-10).
 * Input: id (string) = name of parent div id where children are to be inserted/removed.
 */
function addSampleChild(id, type, e) {

    /* If invalid value - remove all sample fields */
    if($(e.target).hasClass("is-danger") || !parseInt(e.target.value)) {
        /* Get number of children to delete */
        var len = $(id).children().slice(1).length;

        for (; len > 0; len--) {
            $(id).children()[len].remove();
        }

    } else {
        /* Get number of children and compare to input value. If < 0 = remove; If > 0 add. */
        var nChildren = $(id).children().length;
        var toAdd = e.target.value - (nChildren - 1);

        if( toAdd > 0) {
            for(var i = nChildren; i < toAdd + nChildren; i++) {

                /* Create new sample div */
                var div = document.createElement("div");
                div.className = "column is-1";

                var h6 = document.createElement("h6");
                h6.className = "subtitle is-6";
                h6.innerHTML = "Day " + i ;

                var input = document.createElement("input");
                input.className = "input";
                input.setAttribute("autocomplete","off");
                input.setAttribute("type","text");
                
                if(type == 'physical'){
                    input.setAttribute("placeholder","0 - 10");
                    input.setAttribute("onkeyup", "verifyField(0,10, event)");
                    input.setAttribute("name", "physical" + i);
                }

                else{
                    input.setAttribute("placeholder","15 - 100");
                    input.setAttribute("onkeyup", "verifyField(15,100, event)");
                    input.setAttribute("name", "blood" + i);
                }

                /* Append structure */
                div.appendChild(h6);
                div.appendChild(input);
                $(id).append(div);

            }
        }
        else if (toAdd < 0) {

            toAdd = toAdd * -1;
            for (; toAdd > 0; toAdd--, nChildren--) {
                $(id).children()[nChildren-1].remove();
            }
        }

    }
}

function showDetails(){
    $('#details').removeClass('is-hidden');
}

