var userManagementService = {
    getUserList: function () {
        $.ajax({
            type: "GET",
            url: questionService.getRootUrl() + "/api/v1.0/User/userList",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                userManagementService.renderUserList(result);
                console.log(result);
            },
            error: function (xhr, status, exception) {
                console.log(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    renderUserList: function (data) {
        $.each(data, function (index, value) {
            $('table#user-table tbody').append('<tr>' +
                '<td>' + (index + 1) + '</td>' +
                '<td>' + value.Email + '</td>' +
                '<td>' + value.Role + '</td>' +
                '<td>' + value.Status + '</td>' +
                '<td>' +
                '<a href="javascript:void(0)"><i class="fa fa-edit text-info" title="View/Edit Details" onclick="userManagementService.editDetails(' + value.UserId + ')"></i></a>' +
                '</td>' +
                '</tr >');
        });
    },

    editDetails: function (userId) {
        window.location = questionService.getRootUrl() + '/User/Edit?userId=' + userId;
    },

    getUserDetails: function () {
        $.ajax({
            type: "GET",
            url: questionService.getRootUrl() + "/api/v1.0/User/user?id=" + $('#user-id').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                userManagementService.renderUserData(result);

            },
            error: function (xhr, status, exception) {
                console.log(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    renderUserData: function (data) {
        console.log(data);
        $('#email').val(data.Email);
        $('#created-on').val(data.CreatedOn);
        $('#created-by').val(data.CreatedBy);
        $('#updated-on').val(data.UpdatedOn);
        $('#updated-by').val(data.UpdatedBy);
        $('#password').val(data.Password);
        $('#confirmPassword').val(data.Password);
        $('#role').val(data.Role.Name);
        $('#status').prop('checked', data.status);
    },

    saveValidations: function () {
        if ($('#confirmPassword').val() != $('#password').val()) {
            alert('Passwords do not match!');
            return false;
        }
        return true;
    },

    saveUser: function () {
        if (!userManagementService.saveValidations()) {
            return;
        }
        var user = {
            Id: parseInt($('#user-id').val()),
            Email: $('#email').val(),
            Password: $('#password').val(),
            RoleId: parseInt($('#role').val()),
            Status: $('#status').is(':checked'),
            CreatedOn: new Date($('#created-on').val()),
            CreatedBy: $('#created-by').val(),

        };
        $.ajax({
            type: "POST",
            url: questionService.getRootUrl() + "/api/v1.0/User",
            data: JSON.stringify( user ),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result.Success) {
                    alert('User have been saved successfully');
                    window.location = questionService.getRootUrl() + '/User/UserList';
                } else {
                    alert('Error while saving user, please contact administrator');
                }
            },
            error: function (xhr, status, exception) {
                console.log(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
           
        });
    }

};