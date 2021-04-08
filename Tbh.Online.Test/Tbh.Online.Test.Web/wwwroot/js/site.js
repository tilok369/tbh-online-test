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
        code = code.replace(/[|]/g, '<br />');
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
            '<div class="form-text text-secondary">For MCQ options use [*] along with option and pipe(|) at the end of each option</div>' +
            '<textarea class="answer-area" id="question-code-' + index + '" oninput="questionService.onCodeChange(' + index + ')"></textarea>' +
            '</li>' +
            '<li id="question-code-formatted-' + index + '" style="font-family: monospace;" class="list-group-item">' +
            '</li>' +
            '<li class="list-group-item">' +
            '<div id="question-add-btn-' + index + '" class="float-right">Add new <i style="cursor: pointer;" onclick="questionService.addQuestionGroup(' + (index + 1) + ')" class="fa fa-plus-circle text-success"></i></div>' +
            '</li>' +
            '</ul>');

        console.log($("ul[id^=question-group-]").length);
        $("ul[id^=question-group-]").each(function (index) {
            if ($("ul[id^=question-group-]").length > (index + 1)) {
                $('#question-add-btn-' + (index + 1)).css('display', 'none');
            }
        });
    },

    deleteQuestionGroup: function (index) {
        if (parseInt($('#question-group-' + index).attr('data-id')) > 0) {
            $.ajax({
                type: "DELETE",
                url: questionService.getRootUrl() + "/api/v1.0/Question?id=" + $('#question-group-' + index).attr('data-id'),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    if (result.Success) {
                        $('#question-group-' + index).remove();
                    }
                },
                error: function (xhr, status, exception) {
                    console.log(xhr);
                    console.log("Error: " + exception + ", Status: " + status);
                }
            });
        } else {
            $('#question-group-' + index).remove();
        }        
    },

    saveValidation: function () {
        if (!$('#title').val()) {
            alert('Please enter question set title');
            return false;
        }
        return true;
    },

    formatQuestionsJson: function () {
        var json = [];
        $("ul[id^=question-group-]").each(function (index) {
            var i = index + 1;
            if ($('#question-text-' + i).val()) {
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
            }            
        });
        return json;
    },

    saveQuestions: function () {
        if (!questionService.saveValidation()) {
            return;
        }

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
                if (result.Success) {
                    alert('Question set saved successfully');
                    window.location = questionService.getRootUrl() + '/Admin/Dashboard';
                } else {
                    alert('Error while saving questions, please contact administrator');
                }
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
        $('#exam-created-on').val(data.Exam.CreatedOn);
        $('#exam-created-by').val(data.Exam.CreatedBy);
        $('#title').val(data.Exam.Title);
        $('#duration').val(data.Exam.Duration);
        $('#status').prop('checked', data.Exam.Status);
        var html = '';
        $.each(data.Questions, function (i, value) {
            var index = i + 1;
            html += '<ul id = "question-group-' + index + '"  data-id="' + value.Id + '" class= "list-group list-group-flush" >' +
                '<li class= "list-group-item" >' +
                '<div ' + (index === 1 ? 'style="display:none;"' : '') +' class="float-right">Delete <i style="cursor: pointer;" onclick="questionService.deleteQuestionGroup(' + (index) + ')" class="fa fa-times-circle text-danger"></i></div>' +
                '</li >' +
                '<li class="list-group-item">' +
                '<label for="type-' + index + '" class="form-label text-dark">Question Type</label>' +
                '<select id="type-' + index + '" name="duration" class="form-control" aria-label="Default select example">' +
                '<option value="1" ' + (value.TypeId == 1 ? 'selected="selected"' : '') + '>Explanation</option>' +
                '<option value="2" ' + (value.TypeId == 2 ? 'selected="selected"' : '') + '>Coding Output</option>' +
                '<option value="3" ' + (value.TypeId == 3 ? 'selected="selected"' : '') + '>Code Writing</option>' +
                '<option value="4" ' + (value.TypeId == 4 ? 'selected="selected"' : '') + '>MCQ</option>' +
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
                '<div class="form-text text-secondary">For MCQ options use [*] along with option and pipe(|) at the end of each option</div>' +
                '<textarea class="answer-area" id="question-code-' + index + '" oninput="questionService.onCodeChange(' + index + ')">' + value.SubText + '</textarea>' +
                '</li>' +
                '<li id="question-code-formatted-' + index + '" style="font-family: monospace;" class="list-group-item">' +
                questionService.formatCode(value.SubText) +
                '</li>' +
                '<li class="list-group-item">' +
                '<div id="question-add-btn-' + index + '" ' + (data.Questions.length > index ? 'style="display: none;"' : '') + ' class="float-right">Add new <i style="cursor: pointer;" onclick="questionService.addQuestionGroup(' + (index + 1) + ')" class="fa fa-plus-circle text-success"></i></div>' +
                '</li>' +
                '</ul>';

            //console.log(html);
        });

        $('#questions-container').html(html);
    },

    examineeSaveValidation: function () {
        if (!$('#name').val()) {
            alert('Please enter full name');
            return false;
        }
        if (!$('#email').val()) {
            alert('Please enter email address');
            return false;
        }
        if (!$('#phone').val()) {
            alert('Please enter phone number');
            return false;
        }
        return true;
    },

    saveExaminee: function () {
        if (!questionService.examineeSaveValidation()) {
            return;
        }

        if (confirm('Are you sure you want to start the TEST? Once you start it, you cannot cancel or restart the TEST')) {

            var examinee = {
                Id: 0,
                Name: $('#name').val(),
                Email: $('#email').val(),
                Phone: $('#phone').val(),
            };
            $.ajax({
                type: "POST",
                url: questionService.getRootUrl() + "/api/v1.0/Exam/examinee",
                data: JSON.stringify(examinee),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    if (result.Success) {
                        window.location = questionService.getRootUrl() + '/Test/Start?examineeId=' + result.Id;
                    } else {
                        alert('Error while starting exam, please contact administrator');
                    }
                },
                error: function (xhr, status, exception) {
                    console.log(xhr);
                    console.log("Error: " + exception + ", Status: " + status);
                }
            });

        }        
    },

    getAnswerDetails: function () {
        $.ajax({
            type: "GET",
            url: questionService.getRootUrl() + "/api/v1.0/Question?examId=3",// + $('#exam-id').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                console.log(result);
                questionService.renderExamsData(result);
            },
            error: function (xhr, status, exception) {
                console.log(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    renderExamsData: function (data) {
        $('#title').html('&nbsp;' + data.Exam.Title);
        var html = '';
        $.each(data.Questions, function (i, value) {
            var index = i + 1;
            console.log(value.SubText);
            html += '<ul id="answer-group-' + index + '" class="list-group list-group-flush">' +
                '<li id = "question-text-' + index + '" data - id="' + value.Id + '" class="list-group-item" > ' + index + ') ' + value.Text + '</li>' +
                (value.TypeId < 4
                ?
                ('<li style="font-family: monospace;" class="list-group-item">' +
                questionService.formatCode(value.SubText) +
                '</li>')
                :
                questionService.formatCheckboxQuestions(value.SubText, index)
                ) +
                '<li class="list-group-item">' +
                '<textarea id="q-answer-' + index + '" class="answer-area"></textarea>' +
                '</li>' +
                '<li class="list-group-item">' +
                '<button onclick="questionService.submitAnswer(' + data.Exam.Id +', ' + value.Id +')" class="btn btn-success text-white mt-2 mb-5">SUBMIT</button>' +
                '</li>' +
            '</ul>';
            console.log(html);
        });

        $('#questions-container').html(html);
    },

    formatCheckboxQuestions: function (text, i) {
        var html = '<li class="list-group-item">';
        var options = text.split('|');
        $.each(options, function (index, value) {
            html += '<div class="form-check">' +
                    '<input class="form-check-input" type="radio" name="q-option-' + i + '" id="q-option-' + i + '">' +
                    '<label class="form-check-label" for="q-option-' + i + '">' +
                    value.replace('[*]', '') +
                    '</label>' +
                '</div>';
        });

        html += '</li>';
        return html;
    }
};