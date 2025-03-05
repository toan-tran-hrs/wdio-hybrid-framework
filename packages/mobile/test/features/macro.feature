Feature: Macro

    @AzureID-135959
    @Soft-Assertion-Check
    Scenario Outline: Verify that a macro can be added with different configurations
        Given the user opens the application
        And navigates to the Dashboard page
        When the user taps on "Add Macro" button
        Then the Macro page displays
        And the Macro name input box on Macro page is blank

        # Adding a Trigger
        When the user taps on add "trigger" element button on Macro page
        And selects "<Trigger Category>" from the Trigger options
        And taps "<Trigger Type>" button on Trigger page
        And selects the "<Trigger Selection>" radio button on Trigger page and confirms dialog
        And chooses "<Trigger Option>" on Trigger page and confirms dialog
        Then the first item in the trigger list displays "<Trigger Selection>" as the type and "<Trigger Option>" as the selected option

        # Adding an Action
        When the user taps on add "action" element button on Macro page
        And selects "<Action Category>" from the Action options
        And taps "<Action Type>" button on Action page
        And selects the "<Action Selection>" radio button on Action page and confirms dialog
        Then the first item in the action list displays "<Action Type>" as the type and "<Action Selection>" as the selected option

        # Adding a Constraint
        When the user taps on add "constraint" element button on Macro page
        And selects "<Constraint Category>" from the Constraint options
        And taps "<Constraint Type>" button on Constraint page
        And selects the "<Constraint Selection>" radio button on Constraint page and confirms dialog
        Then the first item in the constraint list displays "<Constraint Selection>" as the selected option

        # Adding a Local Variable
        When the user adds a local variable with the following information
            | name                  | type                  | value                  |
            | <Local Variable Name> | <Local Variable Type> | <Local Variable Value> |
        Then the first item in the variable list displays with the selected information

        Examples:
            | Trigger Category | Trigger Type              | Trigger Selection   | Trigger Option  | Action Category | Action Type | Action Selection | Constraint Category | Constraint Type | Constraint Selection   | Local Variable Name | Local Variable Type | Local Variable Value |
            | Applications     | App Install/Remove/Update | Application Removed | Any Application | Logging         | Clear Log   | System Log       | Device State        | Airplane Mode   | Airplane Mode Disabled | Test Case           | Integer             | 1                    |
