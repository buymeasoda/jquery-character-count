(function ($) {

    $.characterCount = {
        defaults: {
            counterClass: 'counter',
            exceededClass: 'exceeded',
            messageContainer: '<span></span>',
            renderCount: function (count) {
                return count;
            }
        },
        updateCount: function (el) {
            $(el).trigger('updateCount.characterCount');
        }
    };
    
    function CharacterCount(field, settings) {
        this.field = $(field);
        this.maxLength = settings.maxLength || this.field.attr('maxlength') || this.field.data('maxlength');
        if (this.maxLength) {
            this.settings = settings;
            this.message = $(settings.messageContainer);
            this.field.keyup($.proxy(this.updateCount, this));
            this.createMessage();
        }
    }

    $.extend(CharacterCount.prototype, {
        createMessage: function () {
            this.message.addClass(this.settings.counterClass).hide();
            this.field.on({
                'focus': $.proxy(this.showMessage, this),
                'blur': $.proxy(this.hideMessage, this),
                'updateCount.characterCount': $.proxy(this.updateCount, this)
            }).after(this.message);
            this.updateCount();
        },
        showMessage: function () {
            this.updateCount();
            this.message.show();
        },
        hideMessage: function () {
            this.message.hide();
        },
        updateCount: function () {
            var count = this.maxLength - this.field.val().length;
            this.message.text(this.settings.renderCount(count));
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