var userManagementService = {
    getUserList: function () {
        $.ajax({
            type: "GET",
            url: userService.getRootUrl() + "/api/v1.0/User/userList",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                userService.renderUserList(result);
            },
            error: function (xhr, status, exception) {
                console.log(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    }
};