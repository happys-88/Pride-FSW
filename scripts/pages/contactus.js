define(['modules/api',
        'modules/backbone-mozu',
        'underscore',
        'modules/jquery-mozu',
        'hyprlivecontext',
        'hyprlive',
        "modules/block-ui",
        'modules/editable-view'
    ],
    function(api, Backbone, _, $, HyprLiveContext, Hypr, blockUiLoader, EditableView) {

        var ContactUsView = EditableView.extend({
            templateName: 'modules/contact/contact-us',
            autoUpdate: [
                'firstname',
                'lastname',
                'email',
                'message',
                'selectedTopic'
            ],
            setError: function(msg) {
                this.model.set('isLoading', false);
                this.trigger('error', { message: msg || 'Something went wrong!! Please try after sometime!' });
            },
            contactUsSubmit: function() {
                console.log("contactUsSubmit");
                var self = this;
                var firstName = self.model.get('firstname');
                var lastName = self.model.get('lastname');
                var email = self.model.get('email');
                var selectedTopic = self.model.get('selectedTopic');
                var message = self.model.get('message');
                if (!self.model.validate()) {
                    var mail= "mailto:sanjay93rajput8@gmail.com?subject="+ selectedTopic + "&amp;body="+ message;
                    window.open( mail,'_blank'); 
                } else {
                    self.setError("Invalid form submission");
                }
                self.model.set('isLoading', true);
            },
            render: function() {
                Backbone.MozuView.prototype.render.apply(this);
            }
        });

        var validationfields = {
            'email': {
                required: true,
                pattern: 'email',
                msg: Hypr.getLabel('emailMissing')
            },
            'selectedTopic': {
                required: true,
                msg: Hypr.getLabel('selectedMissing')
            },
            'message': {
                required: true,
                msg: Hypr.getLabel('contactUsMessageMissing')
            }
        };
        if (HyprLiveContext.locals.themeSettings.enableCaptcha) {
            _.extend(validationfields, {
                'recaptcha_widget_div': {
                    required: function(val, attr, computed) {
                        return window.recaptchaResponse === undefined;
                    },
                    msg: Hypr.getLabel('captchaStatusMessage')
                }
            });
        }
        var Model = Backbone.MozuModel.extend({
            validation: validationfields
        });
        var $contactUsEl = $('#contactus-container');
        var contactUsView = window.view = new ContactUsView({
            el: $contactUsEl,
            model: new Model({
                "selectTopic": require.mozuData('selectTopic')
            })
        });
        contactUsView.render();
    });