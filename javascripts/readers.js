var choose = document.body;

$(choose).on('click', '#uploadbutton', function () {
    $('#picture').click();
});

$(choose).on('change', '#picture', function () {
    var fileread = this.files[0], readf;

    if (fileread.type.match(/image\/.*/)) {

        readf = new FileReader();
        readf.onload = function () {

            $('.picname').text(fileread.name);
            $('.picdisplay').attr('src', readf.result);
            $('#picture').attr('datapicture', readf.result);
        };

        readf.readAsDataURL(fileread);
    } else {
        alert("Connot load picture");
    }
});