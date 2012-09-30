(function ($) {

    $.characterCount = {
        defaults: {
            displayThreshold: 0,
            alwaysShow: false,
            countHTML: '<div></div>',
            countClass: 'count',
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
            this.initCount();
        }
    }

    $.extend(CharacterCount.prototype, {
        initCount: function () {
            this.message = $(this.settings.countHTML);
            if (this.settings.alwaysShow === false) {
                this.message.hide();
                this.field.on({
                    'focus': $.proxy(this.showCount, this),
                    'blur': $.proxy(this.hideCount, this)
                });
            }
            this.field.on('input propertychange updateCount.characterCount', $.proxy(this.updateCount, this));
            this.field.removeAttr('maxlength');
            this.updateCount(true);
            this.message
                .addClass(this.settings.countClass)
                .insertAfter(this.field);
        },
        showCount: function () {
            if (this.currentLength >= this.settings.displayThreshold) {
                this.message.show();
            }
        },
        hideCount: function () {
            this.message.hide();
        },
        updateCount: function (init) {
            var count;
            this.currentLength = this.field.val().length;
            count = this.maxLength - this.currentLength;
            this.message.toggleClass(this.settings.exceededClass, count < 0)
            this.message.html(this.settings.renderCount ? this.settings.renderCount(count) : count);
            if (init !== true) {
                this.message.toggle(this.currentLength >= this.settings.displayThreshold)
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