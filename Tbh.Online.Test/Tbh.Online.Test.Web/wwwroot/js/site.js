// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

var questionService = {
    onCodeChange: function (index) {
        console.log($('#question-code-' + index).val());
        if ($('#question-code-' + index).val().startsWith('~') && $('#question-code-' + index).val().endsWith('~')) {
            $('#question-code-formatted-' + index).css('font-family', 'monospace');
            $('#question-code-formatted-' + index).text($('#' + index).val());
        }
        else {
            $('#question-code-formatted-' + index).css('font-family', 'Arial');
            $('#question-code-formatted-' + index).text($('#question-code-' + index).val());
        }
    }
};