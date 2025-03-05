Feature: Action Block

    @AzureID-135960
    @Soft-Assertion-Check
    Scenario Outline: Verify that the user is able to add an action block after filling all requirements
        Given the user opens the application
        And navigates to the Dashboard page
        When the user taps on "Action Blocks" button
        Then the Action Block page displays
        When user tap + button on Action Block page
        # Adding name and description
        And the user enters "<Action Block Name>" as name and "<Action Block Description>" as description of the action block

        # Adding an input variable
        And the user taps on add "input variable" element button on Action Block page
        And the user add a new input variable with the following details on Action Block page
            | name                  | type                  | value                  |
            | <Input Variable Name> | <Input Variable Type> | <Input Variable Value> |

        # Adding an Action
        When the user taps on add "action" element button on Action Block page
        And selects "<Action Category>" from the Action options
        And taps "<Action Type>" button on Action page
        And selects the "<Action Selection>" radio button on Action page and confirms dialog

        # Adding an output variable
        And the user taps on add "output variable" element button on Action Block page
        And the user add a new output variable with the following details on Action Block page
            | name                   | type                   | value                   |
            | <Output Variable Name> | <Output Variable Type> | <Output Variable Value> |

        # Verifying Action Block Details
        Then the action block detail should display the entered information

        # Verifying Action Block Saving process
        When the user taps on the V button to save the action block
        And the newly added action block should be displayed with the correct name and description

        Examples:
            | Action Block Name | Action Block Description | Input Variable Name | Input Variable Type | Input Variable Value | Output Variable Name | Output Variable Type | Output Variable Value    | Action Category | Action Type | Action Selection |
            | Test Action Block | Action block for test    | test input var      | Boolean             | True                 | test output var      | String               | This is a testing string | Logging         | Clear Log   | System Log       |

    @AzureID-135961
    @Soft-Assertion-Check
    Scenario: Verify that the user cannot add an action block without filling requirements and the related error display then
        Given the user opens the application
        And navigates to the Dashboard page
        When the user taps on "Action Blocks" button
        And user tap + button on Action Block page
        And the user enters "" as name and "" as description of the action block
        When the user taps on the V button to save the action block
        Then the action block validation error display with the message "Please set a name"
        When the user cancels the action block validation error dialog
        And the user enters "Test" as name and "" as description of the action block
        And the user taps on the V button to save the action block
        Then the action block validation error display with the message "Please add at least one action"

    @AzureID-135962
    @Soft-Assertion-Check
    Scenario: Verify that the user cannot add variables with duplicated name and the related error display then
        Given the user opens the application
        And navigates to the Dashboard page
        When the user taps on "Action Blocks" button
        And user tap + button on Action Block page

        # Adding an input variable
        And the user taps on add "input variable" element button on Action Block page
        And the user add a new input variable with the following details on Action Block page
            | name            | type    | value |
            | <Variable Name> | Boolean | True  |
        Then the action block variable should display with the entered information

        # Adding a duplicated input variable
        And the user taps on add "input variable" element button on Action Block page
        And the user add a new input variable with the following details on Action Block page
            | name            | type   | value | duplicated |
            | <Variable Name> | String | abc   | true       |
        Then the variable validation error display with the message "<Error Mesage>"

        # Adding a duplicated output variable
        When the user cancels the variable validation error dialog
        And the user cancels the variable creation dialog
        And the user taps on add "output variable" element button on Action Block page
        And the user add a new output variable with the following details on Action Block page
            | name            | type   | value | duplicated |
            | <Variable Name> | String | abc   | true       |
        Then the variable validation error display with the message "<Error Mesage>"

        Examples:
            | Variable Name   | Error Mesage                              |
            | Duplicated name | A variable with this name already exists. |
