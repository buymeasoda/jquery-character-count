(function ($) {

    $.characterCount = {
        defaults: {
            alwaysShow: false,
            displayThreshold: 0,
            warningPercent: 20,
            countHTML: '<div></div>',
            countClass: 'count',
            warningClass: 'warning',
            exceededClass: 'exceeded'
        },
        updateCount: function (field) {
            $(field).trigger('updateCount.characterCount');
        }
    };

    function CharacterCount(field, settings) {
        this.field = $(field);
        this.settings = settings || {};
        this.maxLength = this.settings.maxLength || this.field.attr('maxlength') || this.field.data('maxlength');
        if (this.maxLength) {
            this.settings.warningThreshold = this.maxLength * this.settings.warningPercent / 100;
            this.initCount();
        }
    }

    $.extend(CharacterCount.prototype, {
        initCount: function () {
            this.message = $(this.settings.countHTML);
            if (this.settings.alwaysShow === false) {
                this.message.hide();
            }
            this.message
                .addClass(this.settings.countClass)
                .insertAfter(this.field);
            this.field.removeAttr('maxlength').on({
                'focus input propertychange updateCount.characterCount': $.proxy(this.showCount, this),
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
                .toggleClass(this.settings.warningClass, count >= 0 && count < this.settings.warningThreshold)
                .html(this.settings.renderCount ? this.settings.renderCount(count) : count);
        },
        hideCount: function () {
            if (this.settings.alwaysShow === false) {
                this.message.hide();    
            }
        }
    });

    $.characterCount.create = function (field, options) {
        return new CharacterCount(field, $.extend({}, $.characterCount.defaults, options || {}));
    };

    $.fn.characterCount = function (options) {
        var settings = $.extend({}, $.characterCount.defaults, options || {});
        return this.each(function () {
            new CharacterCount(this, settings);
        });
    };

}(jQuery));