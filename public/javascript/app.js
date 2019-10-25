$(document).ready(function() {

    $('#scrape').on('click', function() {
        $.ajax({
            method: 'GET',
            url: '/',
        });
    });

    $('.addArticle').on('click', function() {
        let articleID = $(this).attr('data-id');
        $(this).parent().hide();
        $.ajax({
            method: 'PUT',
            url: '/articles/' + articleID + '/save'
        });
    });

    $('.deleteArticle').on('click', function() {
        let articleID = $(this).attr('data-id');
        $(this).parent().hide();
        $.ajax({
            method: 'DELETE',
            url: '/articles/' + articleID + '/delete'
        });
    });

    $('.remarkArticle').on('click', function() {
        let articleID = $(this).attr('data-id');
        let articleTitle = $(this).parent().find('p.articleHead').text();
        $('#modalHeader').text(articleTitle);
        $('#remarkModal').attr('data-id', articleID);
        refreshModal();
    });

    $('#sendRemark').on('click', function() {
        event.preventDefault();

        let remark = {
            body: $("#body").val().trim()
        }

        $.ajax({
            method: 'POST',
            url: '/articles/' + $('#remarkModal').attr('data-id'),
            data: remark,
            success: function () {
                refreshModal();
            }
        });

        $('#body').val('');
    });

    const refreshModal = () => {
        $('#remarkModal').show();
        $.ajax({
            method: 'GET',
            url: '/articles/' + $('#remarkModal').attr('data-id'),
            success: function(data) {
                showRemarks(data)
            }
        });
    };

    const showRemarks = (data) => {
        $('#allRemarks').empty();
        data.remark.forEach(remark => {
            let remarkLI = $('<li>').addClass('listRemark');
            remarkLI.text(remark.body);
            let deleteRemark = $('<button>').addClass('deleteRemark');
            deleteRemark.attr('data-id', remark._id);
            deleteRemark.text('X');
            remarkLI.append(deleteRemark);
            $('#allRemarks').append(remarkLI);
        });
    };

    $(document).on('click', '.deleteRemark', function() {
        $(this).hide();
        $.ajax({
            method: 'DELETE',
            url: '/articles/deleteremark/' + $(this).attr('data-id'),
            success: function () {
                refreshModal();
            }
        });
    });

    $('.close').on('click', function() {
        $('#remarkModal').hide();
    });

    $('#clearSaved').on('click', function() {
        $.ajax({
            method: 'DELETE',
            url: '/articles/saved'
        });
    });

    $('#clear').on('click', function() {
        $.ajax({
            method: 'DELETE',
            url: '/articles'
        });
    });

});