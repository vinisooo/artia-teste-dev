require "application_system_test_case"

class ActivitiesFiltersTest < ApplicationSystemTestCase
  setup do
    @activities_filter = activities_filters(:one)
  end

  test "visiting the index" do
    visit activities_filters_url
    assert_selector "h1", text: "Activities filters"
  end

  test "should create activities filter" do
    visit activities_filters_url
    click_on "New activities filter"

    click_on "Create Activities filter"

    assert_text "Activities filter was successfully created"
    click_on "Back"
  end

  test "should update Activities filter" do
    visit activities_filter_url(@activities_filter)
    click_on "Edit this activities filter", match: :first

    click_on "Update Activities filter"

    assert_text "Activities filter was successfully updated"
    click_on "Back"
  end

  test "should destroy Activities filter" do
    visit activities_filter_url(@activities_filter)
    click_on "Destroy this activities filter", match: :first

    assert_text "Activities filter was successfully destroyed"
  end
end
