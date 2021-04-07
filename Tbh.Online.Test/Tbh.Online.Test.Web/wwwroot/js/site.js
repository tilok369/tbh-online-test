// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

var questionService = {
    getRootUrl: function () {
        var url = window.location.origin;
        var paths = window.location.pathname.substring(1, window.location.pathname.length).split('/');
        for (var i = 0; i < paths.length - 2; i++) {
            url += '/' + paths[i];
        }
        return url;
    },

    onCodeChange: function (index) {
        if ($('#question-code-' + index).val().startsWith('~') && $('#question-code-' + index).val().endsWith('~')) {
            $('#question-code-formatted-' + index).css('font-family', 'monospace');
            $('#question-code-formatted-' + index).html(questionService.formatCode($('#question-code-' + index).val()));
        }
        else {
            $('#question-code-formatted-' + index).css('font-family', 'Arial');
            $('#question-code-formatted-' + index).html($('#question-code-' + index).val());
        }
    },

    formatCode: function (code) {
        if (!code) return code;
        code = code.replace(/~/g, '&nbsp;');
        code = code.replace(/`/g, '&nbsp;');
        code = code.replace(/\n/g, '<br />');
        return code;
    },

    addQuestionGroup: function (index) {
        $('#question-group-' + (index - 1)).append(
            '<ul id = "question-group-' + index + '"  data-id="0" class= "list-group list-group-flush" >' +
                '<li class= "list-group-item" >' +
            '<div class="float-right">Delete <i style="cursor: pointer;" onclick="questionService.deleteQuestionGroup(' + (index) + ')" class="fa fa-times-circle text-danger"></i></div>' +
                '</li >' +
                '<li class="list-group-item">' +
                    '<label for="type-' + index + '" class="form-label text-dark">Question Type</label>' +
                    '<select id="type-' + index + '" name="duration" class="form-control" aria-label="Default select example">' +
                    '<option value="1">Explanation</option>' +
                    '<option value="2">Coding Output</option>' +
                    '<option value="3">Code Writing</option>' +
                    '<option value="4">MCQ</option>' +
                    '</select>' +
                '</li>' +
                '<li class="list-group-item">' +
                    '<label for="question-text-' + index + '" class="form-label text-dark">Question Text</label>' +
                    '<input type="text" class="form-control" id="question-text-' + index + '" name="question-text">' +
                '</li>' +
                '<li class="list-group-item">' +
                    '<label for="question-code' + index + '" class="form-label text-dark">Question Subtext/Code</label>' +
                    '<div class="form-text text-secondary">Enclose code snippet in tild(~)</div>' +
                    '<div class="form-text text-secondary">For indentation use ( ` ). One ( ` ) means one tab space, ( `` ) means two tab space and so on</div>' +
                    '<div class="form-text text-secondary">For MCQ options use [1], [2].. [n] along with option text per line</div>' +
                    '<textarea class="answer-area" id="question-code-' + index + '" oninput="questionService.onCodeChange(' + index + ')"></textarea>' +
                '</li>' +
                '<li id="question-code-formatted-' + index + '" style="font-family: monospace;" class="list-group-item">' +
                '</li>' +
                '<li class="list-group-item">' +
                    '<div class="float-right">Add new <i style="cursor: pointer;" onclick="questionService.addQuestionGroup(' + (index + 1) + ')" class="fa fa-plus-circle text-success"></i></div>' +
                '</li>' +
            '</ul>')
    },

    deleteQuestionGroup: function (index) {
        $('#question-group-' + index).remove();
    },

    formatQuestionsJson: function () {
        var json = [];
        $("ul[id^=question-group-]").each(function (index) {
            var i = index + 1;
            var item = {
                Id: parseInt($('#question-group-' + i).attr('data-id')),
                ExamId: parseInt($('#exam-id').val()),
                TypeId: parseInt($('#type-' + i).val()),
                Text: $('#question-text-' + i).val(),
                SubText: $('#question-code-' + i).val(),
                Options: '',
                CreatedOn: new Date($('#exam-created-on').val()),
                CreatedBy: $('#exam-created-by').val()
            }
            json.push(item);
        });
        return json;
    },

    saveQuestions: function () {
        var exam = {
            Id: parseInt($('#exam-id').val()),
            Title: $('#title').val(),
            Duration: parseInt($('#duration').val()),
            TotalQuestions: $("ul[id^=question-group-]").length,
            Status: $('#status').is(':checked'),
            CreatedOn: new Date($('#exam-created-on').val()),
            CreatedBy: $('#exam-created-by').val()
        };
        var questions = questionService.formatQuestionsJson();
        console.log(exam);
        console.log(questions);
        $.ajax({
            type: "POST",
            url: questionService.getRootUrl() + "/api/v1.0/Question",
            data: JSON.stringify({ Exam: exam, Questions: questions }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                console.log(result);
            },
            error: function (xhr, status, exception) {
                console.log(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getExams: function () {
        $.ajax({
            type: "GET",
            url: questionService.getRootUrl() + "/api/v1.0/Question/exams",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                questionService.renderExamData(result);
            },
            error: function (xhr, status, exception) {
                console.log(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    renderExamData: function (data) {
        $.each(data, function (index, value) {
            $('table#exam-table tbody').append('<tr>' +
                '<td>' + (index + 1) + '</td>' +
                '<td>' + value.Title + '</td>' +
                '<td>' + value.TotalQuestions + '</td>' +
                '<td>' + value.Duration + '</td>' +
                '<td>' + (value.Status ? 'Active' : 'Inactive') + '</td>' +
                '<td>' +
                    '<a href="javascript:void(0)"><i class="fa fa-list" title="View Details" onclick="questionService.viewDetails(' + value.Id + ')"></i></a>' +
                '</td>' +
             '</tr >');
        });
    },

    viewDetails: function (id) {
        window.location = questionService.getRootUrl() + '/Admin/QuestionView?examId=' + id;
    },

    getQuestionDetails: function () {
        $.ajax({
            type: "GET",
            url: questionService.getRootUrl() + "/api/v1.0/Question?examId=" + $('#exam-id').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                console.log(result);
                questionService.renderQuestionsData(result);
            },
            error: function (xhr, status, exception) {
                console.log(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    renderQuestionsData: function (data) {
        var html = '';
        $.each(data.Questions, function (i, value) {
            var index = i + 1;
            html += '<ul id = "question-group-' + index + '"  data-id="' + value.Id + '" class= "list-group list-group-flush" >' +
                '<li class= "list-group-item" >' +
                '<div class="float-right">Delete <i style="cursor: pointer;" onclick="questionService.deleteQuestionGroup(' + (index) + ')" class="fa fa-times-circle text-danger"></i></div>' +
                '</li >' +
                '<li class="list-group-item">' +
                '<label for="type-' + index + '" class="form-label text-dark">Question Type</label>' +
                '<select id="type-' + index + '" name="duration" class="form-control" aria-label="Default select example">' +
                '<option value="1" ' + (value.Duration == 1 ? 'selected="selected"' : '') + '>Explanation</option>' +
                '<option value="2" ' + (value.Duration == 2 ? 'selected="selected"' : '') + '>Coding Output</option>' +
                '<option value="3" ' + (value.Duration == 3 ? 'selected="selected"' : '') + '>Code Writing</option>' +
                '<option value="4" ' + (value.Duration == 4 ? 'selected="selected"' : '') + '>MCQ</option>' +
                '</select>' +
                '</li>' +
                '<li class="list-group-item">' +
                '<label for="question-text-' + index + '" class="form-label text-dark">Question Text</label>' +
                '<input type="text" class="form-control" id="question-text-' + index + '" value="' + value.Text +'" name="question-text">' +
                '</li>' +
                '<li class="list-group-item">' +
                '<label for="question-code' + index + '" class="form-label text-dark">Question Subtext/Code</label>' +
                '<div class="form-text text-secondary">Enclose code snippet in tild(~)</div>' +
                '<div class="form-text text-secondary">For indentation use ( ` ). One ( ` ) means one tab space, ( `` ) means two tab space and so on</div>' +
                '<div class="form-text text-secondary">For MCQ options use [1], [2].. [n] along with option text per line</div>' +
                '<textarea class="answer-area" id="question-code-' + index + '" oninput="questionService.onCodeChange(' + index + ')">' + value.SubText + '</textarea>' +
                '</li>' +
                '<li id="question-code-formatted-' + index + '" style="font-family: monospace;" class="list-group-item">' +
                questionService.formatCode(value.SubText) +
                '</li>' +
                '<li class="list-group-item">' +
                '<div class="float-right">Add new <i style="cursor: pointer;" onclick="questionService.addQuestionGroup(' + (index + 1) + ')" class="fa fa-plus-circle text-success"></i></div>' +
                '</li>' +
                '</ul>';

            console.log(html);
        });

        $('#questions-container').html(html);
    }
};