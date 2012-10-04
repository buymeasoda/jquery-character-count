(function ($) {

    function CharacterCount(field, settings) {
        this.field = $(field);
        this.settings = settings || {};
        this.maxLength = this.settings.maxLength || this.field.attr('maxlength') || this.field.data('maxlength');
        if (this.maxLength) {
            this.init();
        }
    }

    $.extend(CharacterCount.prototype, {
        init: function () {
            this.message = $(this.settings.countHTML);
            if (this.settings.alwaysShow === false) {
                this.message.hide();
            }
            this.message
                .addClass(this.settings.countClass)
                .insertAfter(this.field);
            this.field.removeAttr('maxlength').on({
                'focus input propertychange': $.proxy(this.showCount, this),
                'blur': $.proxy(this.hideCount, this)
            });
            if (this.settings.alwaysShow) {
                this.showCount();
            }
        },
        showCount: function () {
            var currentLength = this.field.val().length,
                count = this.maxLength - currentLength;
            this.message
                .toggle(currentLength >= this.settings.displayThreshold)
                .toggleClass(this.settings.exceededClass, count < 0)
                .html(this.settings.renderCount ? this.settings.renderCount(count) : count);
        },
        hideCount: function () {
            if (this.settings.alwaysShow === false) {
                this.message.hide();
            }
        }
    });

    $.fn.characterCount = function (options) {
        var settings = $.extend({}, $.fn.characterCount.defaults, options || {});
        return this.each(function () {
            if (!$.data(this, 'sodaCharacterCount')) {
                $.data(this, 'sodaCharacterCount', new CharacterCount(this, settings));
            }
        });
    };

    $.fn.characterCount.defaults = {
        displayThreshold: 0,
        alwaysShow: false,
        countHTML: '<div></div>',
        countClass: 'count',
        exceededClass: 'exceeded'
    };

}(jQuery));