var assert = require('assert');
var physique = require('physique');
var jsdom = require('jsdom').jsdom;

describe('Physique', function() {
    it('validates an element', function() {
        function maybe(validator) {
            return function(form) {
                if (form.elements.name.value == "RJ") {
                    return validator(form);
                }

                return physique.ok('maybe');
            }
        }

        const formHtml = `
<form name="form">
    <input type="text" name="name" value=""/>
</form>
`;
        const form = jsdom(formHtml).querySelector('form');

        physique.make(form, physique.chain([
            physique.form({
                name: physique.minLength(1),
                // password: physique.pipe([
                //     physique.minLength(5),
                //     physique.matchedBy('confirmPassword')
                // ]),
                // confirmPassword: physique.matches('password')
            }),
            maybe(physique.form({
                zip: physique.regex(/\d{5}/),
            })),
        ])).on('form.results', function(results) {
            console.log(results);
        });
        // validateForm.bind(form).on('form.valid');
    })
});
