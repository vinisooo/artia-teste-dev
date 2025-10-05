require "test_helper"

class ActivitiesFiltersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @activities_filter = activities_filters(:one)
  end

  test "should get index" do
    get activities_filters_url
    assert_response :success
  end

  test "should get new" do
    get new_activities_filter_url
    assert_response :success
  end

  test "should create activities_filter" do
    assert_difference("ActivitiesFilter.count") do
      post activities_filters_url, params: { activities_filter: {} }
    end

    assert_redirected_to activities_filter_url(ActivitiesFilter.last)
  end

  test "should show activities_filter" do
    get activities_filter_url(@activities_filter)
    assert_response :success
  end

  test "should get edit" do
    get edit_activities_filter_url(@activities_filter)
    assert_response :success
  end

  test "should update activities_filter" do
    patch activities_filter_url(@activities_filter), params: { activities_filter: {} }
    assert_redirected_to activities_filter_url(@activities_filter)
  end

  test "should destroy activities_filter" do
    assert_difference("ActivitiesFilter.count", -1) do
      delete activities_filter_url(@activities_filter)
    end

    assert_redirected_to activities_filters_url
  end
end
