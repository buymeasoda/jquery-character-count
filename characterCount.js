(function ($) {

    $.characterCount = {
        defaults: {
            countClass: 'count',
            overClass: 'over',
            messageHTML: '<div></div>',
            renderCount: function (count) {
                return count;
            }
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
            this.message = $(settings.messageHTML);
            this.field.keyup($.proxy(this.updateCount, this));
            this.createMessage();
        }
    }

    $.extend(CharacterCount.prototype, {
        createMessage: function () {
            this.message.addClass(this.settings.countClass).hide();
            this.field.on({
                'focus': $.proxy(this.showMessage, this),
                'blur': $.proxy(this.hideMessage, this),
                'updateCount.characterCount': $.proxy(this.updateCount, this)
            }).after(this.message);
            this.updateCount();
        },
        showMessage: function () {
            this.message.show();
        },
        hideMessage: function () {
            this.message.hide();
        },
        updateCount: function () {
            var count = this.maxLength - this.field.val().length;
            this.message.html(this.settings.renderCount(count));
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