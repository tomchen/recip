/* ===== Top menu ===== */

QUnit.test("Add button active", function(assert) {
	assert.ok( $(".add-el").hasClass("current-topmenubtn"), "Initially, 'Add' button is active" );
	assert.ok( $(".add-el").next("ul.submenu").hasClass("current-menu"), "Initially, 'Add' menu is shown" );

});

QUnit.test("Top menu button functional", function(assert) {
	$("#menu > li:nth-child(4) > a").click();// Theme
	assert.ok( $("#change-theme").parents(".current-menu").length, "Top menu button is functional" );
});



/* ===== File ===== */

QUnit.test("File title button functional", function(assert) {
	$("#file-title").click();
	$("#select-title").val("TEST TEST");
	$("#dialog-ok").click();
	assert.ok($(".slides").data("title") == "TEST TEST", "File title button is functional" );
});



/* ===== Outline view ===== */

QUnit.test("Outline view slide click functional", function(assert) {
	$("#slides-outlineview > section:nth-child(3)").click();
	assert.ok($(".slides section").index($(".slides section.current-slide")) == 2, "Outline view slide click is functional" );
	assert.ok($("#slides-outlineview section").index($("#slides-outlineview section.current-slide")) == 2, "Outline view slide click is functional" );
});



/* ===== Add ===== */

QUnit.test("Add buttons functional", function(assert) {
	$("#add-text").click();
	assert.ok($(".slides section.current-slide").children().last().is("ul"), "Add text button is functional" );

	$("#add-table").click();
	$("#table-row-width").val("3");
	$("#table-column-width").val("3");
	$("#dialog-ok").click();
	assert.ok($(".slides section.current-slide").children().last().is("table"), "Add table button is functional" );

	$("#add-h1").click();
	assert.ok($(".slides section.current-slide").children().last().is("h1"), "Add h1 button is functional" );

	$("#add-h2").click();
	assert.ok($(".slides section.current-slide").children().last().is("h2"), "Add h2 button is functional" );

	$("#delete-last").click();
	assert.ok($(".slides section.current-slide").children().last().is("h1"), "Delete last button is functional" );
});



/* ===== File ===== */

QUnit.test("New file button functional", function(assert) {
	$("#new-file").click();
	assert.ok( $(".slides section").length === 1, "new file button is functional" );
});



/* ===== Theme ===== */

QUnit.test("Theme change functional", function(assert) {
	$("#change-theme").click();
	$("#select-theme option[value=sky]").attr("selected", "selected");
	$("#dialog-ok").click();
	assert.ok($("#theme-css")[0].href.match(/theme\/(.+)\.css/)[1] == "sky", "Theme change is functional" );
});

QUnit.test("Choose transition button functional", function(assert) {
	$("#choose-transition").click();
	$("#select-transition option[value=none]").attr("selected", "selected");
	$("#dialog-ok").click();
	assert.ok($(".slides").data("transition") == "none", "Choose transition button is functional" );
});

QUnit.test("Global script button functional", function(assert) {
	$("#global-script").click();
	$("#custom-script-editor").val("var a=0");
	$("#dialog-ok").click();
	assert.ok($("#custom-script").html() == "var a=0", "Global script button is functional" );
});

QUnit.test("Global style button functional", function(assert) {
	$("#global-style").click();
	$("#custom-style-editor").val("asdfg{color:red;}");
	$("#dialog-ok").click();
	assert.ok($("#custom-style").html() == "asdfg{color:red;}", "Global style button is functional" );
});