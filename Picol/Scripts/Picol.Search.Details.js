$(window).load(function () {
    $('.wrapper').find('a[href="javascript:void(0)"]').on('click', function (e) {
        e.preventDefault();
        this.expand = !this.expand;
        $(this).text(this.expand ? "Click to collapse" : "Click to read more");
        $(this).closest('.wrapper').find('.small, .big').toggleClass('small big');
    });
});