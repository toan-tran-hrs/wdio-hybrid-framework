@Login
Feature: Homepage

    @AzureID-128574
    @Soft-Assertion-Check
    Scenario Outline: Verify that the google icon displays on home page
        Given I am on the home page
        Then I verify the title of the page is "Google"
        And I verify the google icon displays
