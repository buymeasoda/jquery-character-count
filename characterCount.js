(function ($) {

    $.characterCount = {
        defaults: {
            alwaysShow: false,
            counterClass: 'counter',
            exceededClass: 'exceeded',
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
            this.initCount();
        }
    }

    $.extend(CharacterCount.prototype, {
        initCount: function () {
            this.message = $(this.settings.countHTML);
            if (this.settings.alwaysShow !== true) {
                this.message.hide();
                this.field.on({
                    'focus': $.proxy(this.showCount, this),
                    'blur': $.proxy(this.hideCount, this)
                });
            }
            this.message.addClass(this.settings.counterClass).insertAfter(this.field);
            this.field.on('input propertychange updateCount.characterCount', $.proxy(this.updateCount, this));
            this.field.removeAttr('maxlength');
            this.updateCount();
        },
        showCount: function () {
            this.message.show();
        },
        hideCount: function () {
            this.message.hide();
        },
        updateCount: function () {
            var count = this.maxLength - this.field.val().length;
            this.message.html(this.settings.renderCount ? this.settings.renderCount(count) : count);
            this.message.toggleClass(this.settings.exceededClass, count < 0);
        }
    });

    $.fn.characterCount = function (options) {
        var settings = $.extend({}, $.characterCount.defaults, options || {});
        return this.each(function () {
            new CharacterCount(this, settings);
        });
    };

}(jQuery));