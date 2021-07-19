// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

var questionService = {
    timer: null,
    seconds: 0,
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
            '<ul id = "question-group-' + index + '"  data-id="0" data-created-on="' + $('#question-created-on').val() + '" data-created-by="' + $('#question-created-by').val() + '" class= "list-group list-group-flush" >' +
            '<li class= "list-group-item" >' +
            '<div class="float-right">Delete <i style="cursor: pointer;" onclick="questionService.deleteQuestionGroup(' + (index) + ')" class="fa fa-times-circle text-danger"></i></div>' +
            '</li >' +
            '<li class="list-group-item">' +
            '<label for="question-mark-' + index + '" class="form-label text-dark">Marks</label>' +
            '<input type="number" class="form-control" id="question-mark-' + index + '" name="question-mark-' + index + '">' +
            '</li>' +
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
                    Point: parseFloat($('#question-mark-' + i).val()),
                    CreatedOn: new Date($('#question-group-' + i).attr('data-created-on')),
                    CreatedBy: $('#question-group-' + i).attr('data-created-by')
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
            CreatedBy: $('#exam-created-by').val(),
            ExameCode: $('#exam-code').val()
        };
        var questions = questionService.formatQuestionsJson();

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
                    '<a href="javascript:void(0)"><i class="fa fa-list text-info" title="View Details" onclick="questionService.viewDetails(' + value.Id + ')"></i></a>' +
                '</td>' +
                '<td>' +
                '<a href="javascript:void(0)"><i class="fa fa-graduation-cap text-danger" title="View Result" onclick="questionService.viewExaminees(' + value.Id + ')"></i></a>' +
                '</td>' +
             '</tr >');
        });
    },

    viewDetails: function (id) {
        window.location = questionService.getRootUrl() + '/Admin/QuestionView?examId=' + id;
    },

    viewExaminees: function (id) {
        window.location = questionService.getRootUrl() + '/Admin/Examinees?examId=' + id;
    },

    getQuestionDetails: function () {
        $.ajax({
            type: "GET",
            url: questionService.getRootUrl() + "/api/v1.0/Question?examId=" + $('#exam-id').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                questionService.renderQuestionsData(result);
            },
            error: function (xhr, status, exception) {
                console.log(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    renderQuestionsData: function (data) {
        console.log(data);
        $('#exam-created-on').val(data.Exam.CreatedOn);
        $('#exam-created-by').val(data.Exam.CreatedBy);
        $('#exam-code').val(data.Exam.ExameCode);
        $('#title').val(data.Exam.Title);
        $('#duration').val(data.Exam.Duration);
        $('#status').prop('checked', data.Exam.Status);
        $('#url').val(questionService.getRootUrl() + '/Test/Info?ec=' + data.Exam.ExameCode);
        var html = '';
        $.each(data.Questions, function (i, value) {
            var index = i + 1;
            html += '<ul id = "question-group-' + index + '"  data-id="' + value.Id + '" data-created-on="' + value.CreatedOn + '" data-created-by="' + value.CreatedBy + '" class= "list-group list-group-flush" >' +
                '<li class="list-group-item" >' +
                '<div ' + (index === 1 ? 'style="display:none;"' : '') +' class="float-right">Delete <i style="cursor: pointer;" onclick="questionService.deleteQuestionGroup(' + (index) + ')" class="fa fa-times-circle text-danger"></i></div>' +
                '</li >' +
                '<li class="list-group-item">' +
                '<label for="question-mark-' + index + '" class="form-label text-dark">Marks</label>' +
                '<input type="number" class="form-control" id="question-mark-' + index + '" value="' + value.Point + '" name="question-mark-' + index + '">' +
                '</li>' +
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
                '</ul><br/>';

            //console.log(html);
        });

        $('#questions-container').html(html);
    },

    examineeSaveValidation: function () {
        if (!$('#name').val()) {
            alert('Please enter full name');
            return false;
        }
        if (!$('#email').val() || $('#email').val().indexOf("@") === -1 || $('#email').val().indexOf(".") === -1) {
            alert('Please enter valid email address');
            return false;
        }
        if (!$('#phone').val() || isNaN($('#phone').val())) {
            alert('Please enter valid phone number');
            return false;
        }
        return true;
    },

    saveExaminee: function () {
        if (!questionService.examineeSaveValidation()) {
            return;
        }
        if (!$('#exam-id').val()) {
            alert('Invalid TEST URL! You cannot proceed to test.');
            return;
        }
        if (!$('#exam-status').val()) {
            alert('This TEST is not activated yet! You cannot proceed to test.');
            return;
        }

        if (confirm('Are you sure you want to start the TEST? Once you start it, you cannot cancel or restart the TEST')) {

            var examinee = {
                Id: 0,
                Name: $('#name').val(),
                Email: $('#email').val(),
                Phone: $('#phone').val(),
                ExamId: parseInt($('#exam-id').val())
            };
            $.ajax({
                type: "POST",
                url: questionService.getRootUrl() + "/api/v1.0/Exam/examinee",
                data: JSON.stringify(examinee),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    if (result.Success) {
                        window.location = questionService.getRootUrl() + '/Test/Start?ec=' + $('#ec').val() + '&examineeId=' + result.Id;
                    } else {
                        alert(result.Message + ', please contact administrator');
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
        if (!$('#exam-id').val()) {
            $('#title').html('&nbsp; <strong style="color: red;">Invalid TEST URL!</strong>');
            $('#complete-btn').hide();
            return;
        }
        $.ajax({
            type: "GET",
            url: questionService.getRootUrl() + "/api/v1.0/Question?examId=" + $('#exam-id').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (!result.Exam.Status) {
                    $('#title').html('&nbsp; <strong style="color: red;">This TEST is not activated yet. Please try again later!</strong>');
                    $('#complete-btn').hide();
                    return;
                }
                questionService.renderExamsData(result);
                questionService.startTimer(parseInt(result.Exam.Duration));
            },
            error: function (xhr, status, exception) {
                console.log(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    renderExamsData: function (data) {
        $('#title').html('&nbsp;' + data.Exam.Title);
        $('#exam-duration').text(data.Exam.Duration + ' Minutes')
        var html = '';
        console.log(data);
        $.each(data.Questions, function (i, value) {
            var index = i + 1;
            html += '<ul id="answer-group-' + index + '" class="list-group list-group-flush">' +
                '<li id ="question-text-' + index + '" data-id="' + value.Id + '" data-answer-id="0" class="list-group-item" > ' + index + ') ' + value.Text + '<label class="text-danger point-text">' + value.Point + '</label></li>' +
                (value.TypeId < 4
                ?
                ('<li style="font-family: monospace;" class="list-group-item">' +
                questionService.formatCode(value.SubText) +
                '</li>')
                :
                questionService.formatCheckboxQuestions(value.SubText, index)
                ) +
                (
                    value.TypeId < 4
                ?
                '<li class="list-group-item">' +
                '<textarea id="q-answer-' + index + '" class="answer-area"></textarea>' +
                '</li>'
                :
                ''
                ) +
                '<li class="list-group-item">' +
                '<button onclick="questionService.submitAnswer(' + index + ')" class="btn btn-success text-white mt-2 mb-5">SUBMIT</button>' +
                '</li>' +
                '<li class="list-group-item">' +
                '<label style="margin-top: -50px;" id="q-answer-msg-' + index + '" class="text-danger"></label>' +
                '</li>' +
            '</ul><br/>';
        });

        $('#questions-container').html(html);
    },

    formatCheckboxQuestions: function (text, i) {
        var html = '<li class="list-group-item">';
        var options = text.split('|');
        $.each(options, function (index, value) {
            var opt = index === 0 ? 'A' : index === 1 ? 'B' : index === 2 ? 'C' : index === 3 ? 'D' : index === 4 ? 'E' : 'F';
            html += '<div id="mcq-container-' + i + '" class="form-check">' +
                '<input class="form-check-input" type="radio" name="q-option-' + i + '" value="' + opt + '" id="q-option-' + i + '">' +
                    '<label class="form-check-label" for="q-option-' + i + '">' +
                    opt + ': ' + value.replace('[*]', '') +
                    '</label>' +
                '</div>';
        });

        html += '</li>';
        return html;
    },

    startTimer: function (minutes) {
        questionService.seconds = minutes * 60;
        questionService.timer = setInterval(function () {
            var m = parseInt(questionService.seconds / 60);
            var s = questionService.seconds % 60;
            var time = (m < 1 ? '0' + m : m + '') + ':' + (s < 10 ? '0' + s : s + '');
            $('#exam-timer').text(time);
            questionService.seconds--;
            if (questionService.seconds <= 0) {
                clearInterval(questionService.timer);
                $('#exam-timer').text('00:00');
                questionService.seconds = 0;
                questionService.changeTestStatus(2);
            }
        }, 1000);
    },

    disqualifiyExaminee: function () { questionService.changeTestStatus(-1);},

    preventOutsideClick: function (register) {
        if (register) {
            window.addEventListener('blur', questionService.disqualifiyExaminee);
        } else {
            window.removeEventListener('blur', questionService.disqualifiyExaminee);
        }
        
    },
    preventExamLeave: function () {
        questionService.preventOutsideClick(true);
        //window.onbeforeunload = function () { return "Your work will be lost."; };
    },

    submitAnswer: function (index) {
        var text = $('#mcq-container-' + index).length > 0
            ? $('input[name="q-option-' + index + '"]:checked').val()
            : $('#q-answer-' + index).val(); 
        if (!text) {
            $('#q-answer-msg-' + index).text('Please write your answer first before submitting');
            setTimeout(function () {
                $('#q-answer-msg-' + index).text('');
            }, 3000);
            return;
        }
        var answer = {
            Id: parseInt($('#question-text-' + index).attr('data-answer-id')),
            ExamId: parseInt($('#exam-id').val()),
            ExamineeId: parseInt($('#examinee-id').val()),
            QuestionId: parseInt($('#question-text-' + index).attr('data-id')),
            Text: text,
            Point: 0.0
        };

        $.ajax({
            type: "POST",
            url: questionService.getRootUrl() + "/api/v1.0/Exam/answer",
            data: JSON.stringify(answer),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result.Success) {
                    $('#question-text-' + index).attr('data-answer-id', result.Id);
                    $('#q-answer-msg-' + index).text('Answer submitted successfully!');
                } else {
                    $('#q-answer-msg-' + index).text(result.Message + '. Please try again or contact invigilator');
                    setTimeout(function () {
                        $('#q-answer-msg-' + index).text('');
                    }, 3000);
                }
            },
            error: function (xhr, status, exception) {
                console.log(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    changeTestStatus: function (status) {
        var examStatus = {
            Id: parseInt($('#exam-status-id').val()),
            ExamId: parseInt($('#exam-id').val()),
            ExamineeId: parseInt($('#examinee-id').val()),
            Status: status
        };

        $.ajax({
            type: "POST",
            url: questionService.getRootUrl() + "/api/v1.0/Exam/status",
            data: JSON.stringify(examStatus),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result.Success) {
                    $('#exam-status-id').val(result.Id);
                    if (status === 1) {
                        questionService.getAnswerDetails();
                        questionService.preventExamLeave();
                    } else if (status === 2) {
                        clearInterval(questionService.timer);
                        $('#exam-timer').text('00:00');
                        questionService.seconds = 0;
                        $('#questions-container').hide();
                        $('#complete-btn').hide();
                        $('#complete-msg').text('TEST completed successfully or time elapsed, please close the window. You will be contacted by the invigilator later!');
                        questionService.preventOutsideClick(false);
                    } else if (status === -1) {
                        clearInterval(questionService.timer);
                        $('#exam-timer').text('00:00');
                        questionService.seconds = 0;
                        $('#questions-container').hide();
                        $('#complete-btn').hide();
                        questionService.preventOutsideClick(false);
                        alert('Illegal activity detected, you are disqualified for the exam. Better luck next time.');
                    }
                } else {
                    alert('Error while starting TEST, please contact invigilator!');
                }
            },
            error: function (xhr, status, exception) {
                console.log(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    completeTest: function () {
        //if (confirm('Are you sure, you want to complete the TEST?')) {
        //    questionService.changeTestStatus(2);
        //}
        questionService.changeTestStatus(2);
    },

    toggleFullScreen: function () {
        var elem = document.getElementById('exam-dom');
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem = window.top.document.body; //To break out of frame in IE
            elem.msRequestFullscreen();
        }
    },

    getExaminees: function () {
        $.ajax({
            type: "GET",
            url: questionService.getRootUrl() + "/api/v1.0/Exam/examinee?examId=" + $('#exam-id').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                questionService.renderExamineesData(result);
            },
            error: function (xhr, status, exception) {
                console.log(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    renderExamineesData: function (data) {
        console.log(data);
        if (data.length > 0) {
            $('#exam-title').html('Examinees for <strong class="text-primary">' + data[0].Title + '<strong>');
        }
        $.each(data, function (index, value) {
            $('table#examinee-table tbody').append('<tr style="' + (value.Shortlist == true ? 'background-color:#003300' : '') + '">' +
                '<td>' + (index + 1) + '</td>' +
                '<td>' + value.Title + '</td>' +
                '<td>' + value.Name + '</td>' +
                '<td>' + value.Email + '</td>' +
                '<td>' + value.Phone + '</td>' +
                '<td>' + value.TotalMarks + '</td>' +
                '<td>' + value.ObtainedMarks + '</td>' +
                '<td>' + value.TotalSubmission + '</td>' +
                '<td class="' + (value.Status == 1 ? 'text-info' : value.Status == 2 ? 'text-success' : 'text-danger') +'">' + (value.Status == 1 ? 'Attended' : value.Status == 2 ? 'Completed' : 'Disqualified') + '</td>' +
                '<td>' +
                '<a href="javascript:void(0)"><i class="fa fa-chalkboard-teacher text-info" title="Answer Details" onclick="questionService.viewAnswers(' + value.ExamId + ', ' + value.ExamineeId + ')"></i></a>' +
                '</td>' +
                '<td>' +
                '<input type="file" id="fileUpload" class="fileUpload">'+
             
                '<a href="javascript:void(0)"><i id="files" class= "fas fa-file-upload text-info" title="Upload CV" onclick="questionService.upload()" ></i></a>' +
                '</td>' +
                '<td>' +
                '<a href="javascript:void(0)"><i class= "fa fa-list text-info" title="View Details" onclick="questionService.viewScores(' + value.ExamineeId + ')"></i></a>' +
                '</td>' +
                '<td>' +
                '<a  href="javascript:void(0)"><i id="shortlist" class= "' + (value.Shortlist == false ? 'fa fa-check-circle text-success' : 'fa fa-times-circle text-danger') + '" title = "' + (value.Shortlist == true ? 'Remove' : 'Shortlist') +'" onclick = "questionService.shortlist(this, ' + value.ExamineeId + ') " ></i ></a > ' +
                '</td>' +
                '</tr >');
        });
    },

    viewAnswers: function (examId, examineeId) {
        window.location = questionService.getRootUrl() + '/Admin/Assessment?examId=' + examId + '&examineeId=' + examineeId;
    },

    upload: function () {
        var files = $('#fileUpload').prop("files");
        console.log(files);
        formData = new FormData();
        formData.append("file", files[0]);

        $.ajax({
            type: 'POST',
            url: questionService.getRootUrl() + "/api/v1.0/Exam/cv",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("XSRF-TOKEN",
                    $('input:hidden[name="__RequestVerificationToken"]').val());
            },
            success: function (repo) {
                if (repo.status == "success") {
                    alert("File : " + repo.filename + " is uploaded successfully");
                }
            },
            error: function () {
                alert("Error occurs");
            }
        });
    },

    viewScores: function (examineeId) {
        $("#scoreModal").modal();
        questionService.getExamineeScore(examineeId);             
    },

    shortlist: function (x, examineeId) {
        
      
        var examinee = {
            Id: examineeId,
            Shortlist: !($(x).hasClass('fa-times-circle')),
        }
        $.ajax({
            type: "POST",
            url: questionService.getRootUrl() + "/api/v1.0/Exam/shortlist",
            data: JSON.stringify(examinee),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result.Success) {
                    location.reload(true);
                    $(x).toggleClass("fa-times-circle");
                    $(x).toggleClass("text-danger");
                   
                    if ($(x).hasClass('fa-times-circle')) {
                        $(x).parent().parent().parent().css("background-color", "#003300");
                    }
                    else {
                        $(x).parent().parent().parent().css("background-color", "#505255");
                    }
                    questionService.getRootUrl() + '/Exam/examinee?examId=' + $('#exam-id').val();
                } else {
                    alert('Error while shortlisting examinee');
                }
            },
            error: function (xhr, status, exception) {
                console.log(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }

        });
            
    },

    getQuestionAnswerDetails: function () {
        $.ajax({
            type: "GET",
            url: questionService.getRootUrl() + "/api/v1.0/Exam/answer?examId=" + $('#exam-id').val() + "&examineeId=" + + $('#examinee-id').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                questionService.renderQuestionsAnswerData(result);
            },
            error: function (xhr, status, exception) {
                console.log(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    renderQuestionsAnswerData: function (data) {
        //console.log(data);        
        if (data.length > 0) {
            $('#title').val(data[0].Title);
            $('#duration').val(data[0].Duration);
            $('#name').val(data[0].ExamineeName);
            $('#email').val(data[0].ExamineeEmail);
            $('#phone').val(data[0].ExamineePhone);
        }
        var html = '';
        $.each(data, function (i, value) {
            var index = i + 1;
            html += '<ul id = "question-group-' + index + '"  data-id="' + value.AnswerId + '" data-assessed-by="' + value.AssessedBy + '" class= "list-group list-group-flush" >' +
                '<li class="list-group-item">' +
                '<label for="type-' + index + '" class="form-label text-dark">Question Type</label>' +
                '<select disabled id="type-' + index + '" name="duration" class="form-control" aria-label="Default select example">' +
                '<option value="1" ' + (value.TypeId == 1 ? 'selected="selected"' : '') + '>Explanation</option>' +
                '<option value="2" ' + (value.TypeId == 2 ? 'selected="selected"' : '') + '>Coding Output</option>' +
                '<option value="3" ' + (value.TypeId == 3 ? 'selected="selected"' : '') + '>Code Writing</option>' +
                '<option value="4" ' + (value.TypeId == 4 ? 'selected="selected"' : '') + '>MCQ</option>' +
                '</select>' +
                '</li>' +
                '<li class="list-group-item">' +
                '<label for="question-text-' + index + '" class="form-label text-dark">Question Text</label>' +
                '<input disabled type="text" class="form-control" id="question-text-' + index + '" value="' + value.Text + '" name="question-text">' +
                '</li>' +
                '<li class="list-group-item">' +
                '<label for="question-mark-' + index + '" class="form-label text-dark">Total Marks</label>' +
                '<input type="number" disabled class="form-control" id="question-mark-' + index + '" value="' + value.Point + '" name="question-mark-' + index + '">' +
                '</li>' +
                (value.TypeId < 4
                    ?
                    ('<li style="font-family: monospace;" class="list-group-item">' +
                        questionService.formatCode(value.SubText) +
                        '</li>')
                    :
                    questionService.formatCheckboxQuestions(value.SubText, index)
                ) +
                '<li class="list-group-item">' +
                '<label for="q-answer-' + index + '" class="form-label text-primary">Given Answer</label>' +
                '<textarea disabled id="q-answer-' + index + '" class="answer-area">' + value.AnswerText + '</textarea>' +
                '</li>' +
                '<li class="list-group-item">' +
                '<label for="answer-mark-' + index + '" class="form-label text-primary">Given Marks</label>' +
                '<input onchange="questionService.isEdited(' + index + ')" data-edited-' + index + '="0" type="number" class="form-control" id="answer-mark-' + index + '" value="' + value.AnswerPoint + '" name="question-mark-' + index + '">' +
                '</li>' +
                '</ul><br/>';

            //console.log(html);
        });

        $('#questions-container').html(html);
    },

    validateAssessment: function () {
        var validate = true;
        $("ul[id^=question-group-]").each(function (i) {
            var index = i + 1;
            if (isNaN($('#answer-mark-' + index).val()) ||
                parseFloat($('#answer-mark-' + index).val()) > parseFloat($('#question-mark-' + index).val()))
                validate = false;
        });
        return validate;
    },

    formatAssessmentJson: function () {
        var json = [];
        $("ul[id^=question-group-]").each(function (i) {
            var index = i + 1;
            var item = {
                Id: parseInt($('#question-group-' + index).attr('data-id')),
                Point: parseFloat($('#answer-mark-' + index).val()),
                ActualPoint: parseFloat($('#question-mark-' + index).val()),
                AssessedBy: $('#answer-mark-' + index).attr('data-edited-' + index) == "0" && $('#question-group-' + index).attr('data-assessed-by') ? $('#question-group-' + index).attr('data-assessed-by') : $('#assessed-by').val(),
                ExamId: parseInt($('#exam-id').val()),
                ExamineeId: parseInt($('#examinee-id').val())
            }
            json.push(item);
        });
        return json;
    },

    assessQuestions: function () {
        if (!questionService.validateAssessment()) {
            alert('One more marking have invalid value, please check again');
            return;
        }
        var assessJosn = questionService.formatAssessmentJson();
        $.ajax({
            type: "POST",
            url: questionService.getRootUrl() + "/api/v1.0/Exam/assess",
            data: JSON.stringify(assessJosn),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result.Success) {
                    alert('Assessment set saved successfully');
                    window.location = questionService.getRootUrl() + '/Admin/Examinees?examId=' + $('#exam-id').val();
                } else {
                    alert('Error while saving assessment, please contact administrator');
                }
            },
            error: function (xhr, status, exception) {
                console.log(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    proceedToTest: function () {
        if (!$('#code').val()) {
            alert('Please provide the test code first!');
            return;
        }

        window.location = questionService.getRootUrl() + '/Test/Info?ec=' + $('#code').val();
    },

    isEdited: function (index) {
        $('#answer-mark-' + index).attr('data-edited-' + index, '1');
    },

    breadCrumbClick: function (controller, action, param) {
        window.location = questionService.getRootUrl() + '/' + controller + '/' + action +
            (param ? '?' + param : '');
    },
    getExamineeScore: function (examineeId) {
        $.ajax({
            type: "GET",
            url: questionService.getRootUrl() + "/api/v1.0/Exam/examineeScore?examineeId=" + examineeId + '&examId=' + $('#exam-id').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                
                $('#examinee-id').val(examineeId);
                questionService.renderExamineeScoreData(result);
                
            },
            error: function (xhr, status, exception) {
                console.log(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },
    renderExamineeScoreData: function (data) {
        console.log(data);
        $('table#examiner-score-table').empty();
        $('table#examiner-score-table').html('<tr>' +
            '<th>' + "#" + '</th>' +
            '<th>' + "Examiner" + '</th>' +
            '<th>' + "Score" + '</th>' +
            '</tr >');
        $.each(data, function (index, value) {
            console.log($('#user-email').val() === value.Examiner);
            $('table#examiner-score-table').append('<tr>' +
                    '<td>' + (index + 1) + '</td>' +
                '<td>' + value.Examiner + '</td>' +
                '<td>' + '<input id="score-input-' + (index+1) + '" type="number"' + ($('#user-email').val() !== value.Examiner ? "disabled" : "") + ' value=' + value.Score + '>' + '</td>' +
                '<td>' +
                '<a href="javascript:void(0)"><i class= "fas fa-save text-info" title="Save"' + ($('#user-email').val() !== value.Examiner ? '' : 'onclick="questionService.save(' + (index + 1)+ ',' + value.ExaminerId + ', ' + value.Score + ',' + value.ExamineeId + ',' + value.ExamId + ',' + value.Id +')"') + '></i></a>' +
                '</td>' +
                    '</tr >');
                
        });
      
    },
    save: function (index, examinerId, scores, examineeId, examId, id) {
      
        questionService.saveScore(index, examinerId, scores, examineeId, examId, id);
    },
    saveScore: function (index, examinerId, scores, examineeId, examId, id) {
       
        var score = {

            Id: id,
            ExamId: examId,
            ExamineeId: examineeId,
            ExaminerId: examinerId,
            Score: parseInt($('#score-input-' + index).val()),
           
        };
        $.ajax({
            type: "POST",
            url: questionService.getRootUrl() + "/api/v1.0/Exam/saveScore",
            data: JSON.stringify(score),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result.Success) {
                    alert('Score have been saved successfully');
                    questionService.getRootUrl() + '/Exam/examinee?examId=' + $('#exam-id').val();
                } else {
                    alert('Error while saving score');
                }
            },
            error: function (xhr, status, exception) {
                console.log(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }

        });
    },
};