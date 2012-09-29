(function ($) {

    $.characterCount = {
        defaults: {
            countClass: 'count',
            overClass: 'over',
            countHTML: '<div></div>'
        },
        updateCount: function (fields) {
            $(fields).trigger('updateCount.characterCount');
        }
    };
    
    function CharacterCount(field, settings) {
        this.field = $(field);
        this.maxLength = settings.maxLength || this.field.attr('maxlength') || this.field.data('maxlength');
        if (this.maxLength) {
            this.settings = settings;
            this.message = $(settings.countHTML);
            this.initCount();
        }
    }

    $.extend(CharacterCount.prototype, {
        initCount: function () {
            this.message.addClass(this.settings.countClass).hide();
            this.field.on({
                'input propertychange updateCount.characterCount': $.proxy(this.updateCount, this),
                'focus': $.proxy(this.showCount, this),
                'blur': $.proxy(this.hideCount, this)
            }).removeAttr('maxlength').after(this.message);
            this.updateCount();
        },
        showCount: function () {
            this.message.show();
        },
        hideCount: function () {
            // this.message.hide();
        },
        updateCount: function () {
            var count = this.maxLength - this.field.val().length;
            this.message.html(this.settings.renderCount ? this.settings.renderCount(count) : count);
            this.message.toggleClass(this.settings.overClass, count < 0);
        }
    });
    
    $.fn.characterCount = function (options) {
        var settings = $.extend({}, $.characterCount.defaults, options || {});
        return this.each(function () {
            new CharacterCount(this, settings);
        });
    };

}(jQuery));