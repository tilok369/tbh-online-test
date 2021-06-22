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
    },
};