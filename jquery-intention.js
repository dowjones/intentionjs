(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'intention'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    $.tn = new Intention;
}));