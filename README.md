# Physique (Form) Validation

Functional style front-end form validation designed with CommonJS.

## Installation

Install with npm at `physique`

## Usage

```js
var physique = require('physique');
var form = document.forms['form_name'];

var validator = physique.make(form, physique.form({
    firstName: physique.notEmpty(),
    lastName: physique.notEmpty(),
    email: physique.pipe([
        physique.regex(/.+@.+/),
        function(el) {
            return new physique.Promise(function(resolve, reject) {
                $.get('/validate_email/' + el.value, function(res) {
                    if (res.success) {
                        resolve(physique.ok('invalid_email'));
                    } else {
                        resolve(physique.error('invalid_email'));
                    }
                });
            });
        }
    ]),
    state: physique.notEmpty(),
    check: physique.checked(),
    radio: physique.some(physique.checked()),
    password: physique.minLength(4),
    confirmPassword: physique.matches('password')
}))
.configure({
    rolling: true
})
.on('form.valid', function() {
    console.log('Submitted and Valid!')
})
.run();
```

## Packages

A package is a function that accepts the WrappedValidator instance and configures it in any way. These are great ways to add bundled features or configuration to your physique validators.

Packages can listen for events, configure the validator, set a reporter, or add bootstraps. A lot of the functionality in physique is built from packages.

Creating a package is very simple:

```js
function myPackage() {
    return function(validator) {
        validator.on('form.valid', function() {});
        validator.configure({
            someConfig: 'value'
        });
        validator.bootstraps.push(function(validator) {
            // this code will be executed once run is called
        });
    }
}
```

Then to register a package, you call:

```js
validator.with(myPackage())
```

## Configuration

| name                     | default              | definition                                                                                                                                                                                                                                                                                                                                                          |
|--------------------------|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `rolling`                | `true`               | Allows validation on field events causing a validation that is constantly happening. You can configure the events listened on with `eventTypes`.                                                                                                                                                                                                                    |
| `tillSubmit`             | `false`              | If true, then reporting won't occur until after the submit button is pressed. Default behavior will report validation results always.                                                                                                                                                                                                                               |
| `postValidateEventTypes` | `[]`                 | These event types will not be reported until the given field has already been validated. This is useful with a value like `["input"]`. This means no validation is reported until after the change event or submit occurs. Then once the field has been validated, any input event will be reported.                                                                |
| `eventTypes`             | `["input","change"]` | The event types that will trigger rolling validations and will invalidate the form validation result cache.                                                                                                                                                                                                                                                         |
| `wait`                   | `250`                | The amount of time to wait for debounced rolling events before running a full form validation. There can be validators that look at multiple fields. So when one field changes, we eventually need to run validation on the full form to maintain consistency. This variable determines the time to wait for no new events before running the full form validation. |
| `syncMatches`            | `true`               | This enables the matchesSyncPackage. The matchesSyncPackage will make sure that the `matches` validator stays in sync with the other element at all times. So if your confirmPassword element was set to match the password element. Changes to password could then invalidate the confirmPassword field.                                                           |
| `disableSubmit`          | `false`              | This enables the disableSubmitPackage. The disableSubmitPackage will disable the submit button until the form is validated. It listens for the form.validate event and then checks if the validationResult is valid.                                                                                                                                                |
| `submitOnValid`          | `true`               | Due to the async nature of physique, the raw form submit event is prevented from actually submitting the form. This config var enables the submitOnValidPackage which will call `form.submit()` on the `form.valid` event.                                                                                                                                          |
| `runValidate`            | `true`               | If the disableSubmitPackage is enabled, this will run a full form validation right at bootstrap time to see if the form may already be valid from inputs that may have already had values.                                                                                                                                                                          |

## Events

### form.submit

- parameters: ValidateFormResult, WrappedValidator

Fired when the form is submitted.

### form.validate

- parameters: ValidateFormResult, WrappedValidator

Fired when the form validator has been run on the form.

### form.valid

- parameters: ValidateFormResult, WrappedValidator

Fired when the form has been submitted *and* is valid.

### form.results

- parameters: ValidationResultCollection, WrappedValidator, UIEvent

Fired for every element validator on form submit or on rolling events.

## Validators

### chain(validators)

Chains an array of validators together and groups all of the result collections into one promise to be resolved.

### pipe(validators)

Similar to chain, except it stops at the first error validation result. Returns the last successful validation result or the first error result.

### form(validators)

Validates a form with a map of element validators.

Each key in the validators map/object will be run on the corresponding element in the form with the same name field. Each validator will be run against the given element.

### matches(otherName)

Ensures that the element matches another element in the form.

### some(validator)

Ensures that any element in a node collection passes the validator.

### checked()

Validates that the element.checked property is true.

### minLength(min)

Checks the length of the element.value field and verifies the length greater or equal to `min`.

### maxLength(max)

Checks the length of the element.value field and verifies the length less than or equal to `max`.

### regex(re)

Matches the element.value against the the given regular expression. If the re tests true, then it passes.

### notEmpty()

Verifies that the element is not empty.

## API

### ok(code)

Returns a resolved promise of a ValidationResult marked as valid.

### error(code, params)

Returns a resolved promise of a ValidationResult with the given params marked as invalid.

### make(form, validateForm)

Creates a new WrappedValidator with the form and validator and then registers the stdPackage.

### WrappedValidator(form, validateForm, config, bootstraps, reporter)

The WrappedValidator is the main physique class/instance which manages the form validation for a given form.

#### isValid()

Returns true if form has been validated and is valid.

#### validate(ctx, shouldEmit = false)

Validates the form and returns a promise of the validated form. The Promise will resolve to a ValidateFormResult.

#### with(package)

Registers the package with the wrapped validator.

#### configure(config)

Registers the config for the validator.

#### setReport(reporter)

Sets the reporter and returns the same WrappedValidator instance.

#### run()

Runs all of the bootstraps which initialized the form for validation.


### ValidationResult

A result of the validation.

#### Properties

- code: string
- isValid: bool
- params: object
- elements: array

### ValidationResultCollection

Represents a collection of ValidationResult instances for a specific element. The ValidationResult can affect multiple elements. The ValidationResultCollection is a mapped collection of one element to all of its results.

#### Properties

- results: array
- element: HTMLElement

### ValidateFormResult

#### Properties

- resultCollections: array - Array of result collections
- isValid: bool - whether or not the form is valid.
