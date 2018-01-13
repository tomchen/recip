/* ===== Top menu ===== */

$(".add-el").addClass("current-topmenubtn").next("ul.submenu").addClass("current-menu");

$(".topmenubtn").click(function(e){
	$(".topmenubtn").removeClass("current-topmenubtn");
	$("ul.submenu").removeClass("current-menu");
	$(this).addClass("current-topmenubtn").next("ul.submenu").addClass("current-menu");
});

$("#menu a, .dialog-btn").click(function(e){
	e.preventDefault();
});




/* ===== File System Methods ===== */

if (typeof process === "object" && process + "" === "[object process]"){//Electron only
	var {dialog} = require("electron").remote;
	var fs = require("fs");
}

function selectFile() {
	try {
		dialog.showOpenDialog(function(fileNames) {
			if (fileNames === undefined) {
				console.log("No file selected");
			} else {
				document.getElementById("file-path").value = fileNames[0];
			}
		});
	} catch (e) {
	}
}

function selectRecipFile() {
	try {
		dialog.showOpenDialog({ filters: [
			{ name: "Recip HTML file", extensions: ["recip.html", "html"] }
		]}, function(fileNames) {
			if (fileNames === undefined) {
				console.log("No file selected");
			} else {
				document.getElementById("file-path").value = fileNames[0];
			}
		});
	} catch (e) {
	}
}

function readFile(filepath) {
	try {
		return new Buffer(fs.readFileSync(filepath)).toString();
	} catch (e) {
	}
}

function readFileBase64Uri(filepath) {
	try {
		var bitmap = fs.readFileSync(filepath);
		var ext = filepath.match(/\.([a-zA-Z0-9]+?)$/)[1];
		var mimeType = "image/";
		if (!ext) {
			mimeType = "text/plain";
		} else {
			mimeType += ext;
		}
		return "data:" + mimeType + ";base64," + new Buffer(bitmap).toString("base64");
	} catch (e) {
	}
}

function saveFile(content) {
	try {
		dialog.showSaveDialog({ filters: [
				{ name: "Recip HTML Presentation file", extensions: ["recip.html", "html"] }
			]}, function (fileName) {
			if (fileName === undefined){
				console.log("You didn't save the file");
				return;
			}
			fs.writeFile(fileName, content, function (err) {
				if(err){
					alert("An error ocurred creating the file "+ err.message);
				}
				
				alert("The file has been succesfully saved");
			});
		});
	} catch (e) {
	}
}




/* ===== File ===== */

$("#open-file").click(function(e){
	openDialogBox("Open a Recip HTML Presentation file from your computer:<br><input type='text' placeholder='Select a file' id='file-path'><input type='button' value='Browse' id='select-file'>", function(e){
		var cont = readFile(document.getElementById("file-path").value);
		var m = cont.match(/(\<div class\=\"reveal\"\>\s*?\<div class\=\"slides\")([\s\S]+?\<style id\=\"custom-style\" type\=\"text\/css\"\>.*?\<\/style\>\s*?\<\/div\>)\s*?\<\/div\>/m);
		$(".reveal").html(m[1]+" contenteditable='true'"+m[2]);
		document.title = $(".slides").data("title") + " - Recip Editor";
		var themeName = $("#theme-css")[0].href.match(/theme\/(.+)\.css/)[1];
		$("#theme-css")[0].href = $("#theme-css")[0].href.replace(/theme\/.+\.css/, "theme/"+themeName+".css");
		jumpToSlideNumber(0);
		updateSlidesOutlineview();
	}, function(){
		document.getElementById("select-file").addEventListener("click", selectRecipFile, false);
		document.getElementById("file-path").addEventListener("click", selectRecipFile, false);
	});
});

$("#save-file").click(function(e){
	openDialogBox("Save file with title: <input type='text' id='select-title' value='"+$(".slides").data("title")+"'>", function(e){
		$(".slides").data("title", $("#select-title").val());
		document.title = $("#select-title").val() + " - Recip Editor";
		var currentThemeName = $("#theme-css")[0].href.match(/theme\/(.+)\.css/)[1];
		var content = `<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
		<title>` + $("#select-title").val() + `</title>
		<style type="text/css">
` + readFile(__dirname + "\\min-resources\\reveal.css") + `
` + readFile(__dirname + "\\min-resources\\theme-css\\" + currentThemeName + ".css") + `
		</style>
	</head>
	<body>
		<div class="reveal">
` + $(".reveal").html().replace(' contenteditable="true"', '') + `
		</div>
		<script>
` + readFile(__dirname + "\\min-resources\\head.min.js") + `
` + readFile(__dirname + "\\min-resources\\reveal.js") + `
			Reveal.initialize({
				transition: "` + $(".slides").data("transition") + `"
			});

			var socket  = new WebSocket("` + $(".slides").data("server") + `");

			socket.onopen = function(e) {
				window.addEventListener('beforeunload', function(e) {
					WebSocket.close();
				});
			};

			socket.onmessage = function(e) {
				if (e.data === '1') {
					Reveal.right();
				} else if (e.data === '-1') {
					Reveal.left();
				}
			}
		</script>
	</body>
</html>`;
		saveFile(content);
	});
});

$("#file-info").click(function(e){
	openDialogBox("Choose a title: <input type='text' id='select-title' value='"+$(".slides").data("title")+"'>", function(e){
		$(".slides").data("title", $("#select-title").val());
		document.title = $("#select-title").val() + " - Recip Editor";
	});
});

$("#new-file").click(function(e){
	$(".reveal").html(`			<div class="slides" contenteditable="true" data-transition="convex" data-title="Presetation title">

				<section>
					<h1>Title</h1>
				</section>

				<script id="custom-script"></script>

				<style id="custom-style" type="text/css"></style>

			</div>`);
		document.title = "Presetation title - Recip Editor";
		jumpToSlideNumber(0);
		updateSlidesOutlineview();
});

$("#set-server").click(function(e){
	openDialogBox("Set server URL: <input type='text' id='set-server-input' value='"+$(".slides").data("server")+"'>", function(e){
		$(".slides").data("server", $("#set-server-input").val());
	});
});

/* ===== Add ===== */

$("#add-text").click(function(e){
	var currentSlide = $(".slides section.current-slide");
	var lastEl = currentSlide.children().last();
	if (lastEl.is("ul")) {
		lastEl.append("<li>Text</li>");
	} else {
		currentSlide.append("<ul><li>Text</li></ul>");
	}
});

$("#add-image").click(function(e){
	openDialogBox("Choose an image from your computer:<br><input type='text' placeholder='Select a file' id='file-path'><input type='button' value='Browse' id='select-file'>", function(e){
		var currentSlide = $(".slides section.current-slide");
		currentSlide.append("<br><img src='"+readFileBase64Uri(document.getElementById("file-path").value)+"'>");
	}, function(){
		document.getElementById("select-file").addEventListener("click", selectFile, false);
		document.getElementById("file-path").addEventListener("click", selectFile, false);
	});
});

$("#add-table").click(function(e){
	openDialogBox("Enter the number of cells in a ROW x in a COLUMN: <input type='text' id='table-row-width' class='table-width'> x <input type='text' id='table-column-width' class='table-width'>", function(e){
		try {
			var rowW = parseInt($("#table-row-width").val());
			var colW = parseInt($("#table-column-width").val());
			var tableHtml = "<table>";
			for (var i = 0; i < rowW; i++) {
				tableHtml += "<tr>";
				for (var j = 0; j < colW; j++) {
					tableHtml += "<td>"+(i+1)+"."+(j+1)+"</td>";
				}
				tableHtml += "</tr>";
			}
			tableHtml += "</table>";
			var currentSlide = $(".slides section.current-slide");
			currentSlide.append(tableHtml);
		} catch (e) {
		}
	});
});

$("#add-h1").click(function(e){
	var currentSlide = $(".slides section.current-slide");
	currentSlide.append("<h1>Text</h1>");
});

$("#add-h2").click(function(e){
	var currentSlide = $(".slides section.current-slide");
	currentSlide.append("<h2>Text</h2>");
});

$("#delete-last").click(function(e){
	var currentSlide = $(".slides section.current-slide");
	var lastEl = currentSlide.children().last();
	lastEl.remove();
});


/* ===== Slide ===== */

function updateSlidesOutlineview() {
	$("#slides-outlineview").html($(".slides").html());
	outlineviewSectionClickBind();
}
updateSlidesOutlineview();
$($(".slides section")[0]).addClass("current-slide");
$($("#slides-outlineview section")[0]).addClass("current-slide");

function jumpToSlideNumber(number) {//0-based
	$(".slides section").removeClass("current-slide");
	$($(".slides section")[number]).addClass("current-slide");
}

function outlineviewSectionClickBind() {
	$("#slides-outlineview section").click(function(e){
		jumpToSlideNumber($("#slides-outlineview section").index(this));
		updateSlidesOutlineview();
	})
}

$("#new-title").click(function(e){
	$(".slides").append("<section><h1>Title</h1></section>");
	updateSlidesOutlineview();
	jumpToSlideNumber($(".slides section").length-1);
	$("#slides-outlineview")[0].scrollTop = $("#slides-outlineview")[0].scrollHeight;
});

$("#new-content").click(function(e){
	$(".slides").append("<section><h2>Title</h2><ul><li>Text</li></ul></section>");
	updateSlidesOutlineview();
	jumpToSlideNumber($(".slides section").length-1);
	$("#slides-outlineview")[0].scrollTop = $("#slides-outlineview")[0].scrollHeight;
});

$("#delete-slide").click(function(e){
	var backToSlideNumber = $(".slides section").index($(".slides section.current-slide"));
	console.log(backToSlideNumber);
	if (backToSlideNumber > 0) {
		backToSlideNumber -= 1;
	} else {
		backToSlideNumber = 0;
	}
	$(".slides section.current-slide").remove();
	jumpToSlideNumber(backToSlideNumber);
	updateSlidesOutlineview();
});

$("#current-slide-order").click(function(e){
	var pageNumbers = $(".slides section").length;
	var htmlText = "Insert the current slide after the slide number <select id='select-order'>";
	for (var i = 0; i <= pageNumbers; i++) {
		htmlText += "<option value='"+i+"'>"+i+"</option>";
	}
	htmlText += "</select>";
	openDialogBox(htmlText, function(e){
		var targetPageNumber = $("#select-order option:selected").val();
		if (targetPageNumber !== "0") {
			$(".slides section.current-slide").insertAfter(".slides section:nth-child("+targetPageNumber+")");
		} else {
			$(".slides section.current-slide").insertBefore(".slides section:first-child");
		}
		updateSlidesOutlineview();
	});
	$("#select-order option:nth-child(" + ($(".slides section").index($(".slides section.current-slide")) + 2) + ")" ).attr("selected", "selected");
});

$("#edit-html").click(function(e){
	openDialogBox("Edit HTML code of the current slide:<br><textarea rows='10' cols='60' id='custom-html-editor'>"+$(".slides section.current-slide").html()+"</textarea>", function(e){
		$(".slides section.current-slide").html($("#custom-html-editor").val());
	});
});




/* ===== Theme ===== */

var themesList = ["Beige","Black","Blood","League","Moon","Night","Serif","Simple","Sky","Solarized","White"];

$("#change-theme").click(function(e){
	var htmlText = "Choose a theme: <select id='select-theme'>";
	var tl = themesList.length;
	for (var i = 0; i < tl; i++) {
		htmlText += "<option value='"+themesList[i].toLowerCase()+"'>"+themesList[i]+"</option>";
	}
	htmlText += "</select>";

	openDialogBox(htmlText, function(e){
		var chosenThemeName = $("#select-theme option:selected").val();
		$("#theme-css")[0].href = $("#theme-css")[0].href.replace(/theme\/.+\.css/, "theme/"+chosenThemeName+".css");
	});
	var currentThemeName = $("#theme-css")[0].href.match(/theme\/(.+)\.css/)[1];
	$("#select-theme option[value="+currentThemeName+"]" ).attr("selected", "selected");
});


var transitionList = ["Default", "Fade", "Slide", "Convex", "Concave", "Zoom", "None"];

$("#choose-transition").click(function(e){

	var htmlText = "Choose an effect of transition between slides: <select id='select-transition'>";
	var tl = transitionList.length;
	for (var i = 0; i < tl; i++) {
		htmlText += "<option value='"+transitionList[i].toLowerCase()+"'>"+transitionList[i]+"</option>";
	}
	htmlText += "</select>";

	openDialogBox(htmlText, function(e){
		var chosenTransitionName = $("#select-transition option:selected").val();
		$(".slides").data("transition", chosenTransitionName);
	});

	var currentTransitionName = $(".slides").data("transition");
	$("#select-transition option[value="+currentTransitionName+"]" ).attr("selected", "selected");

	// $(".slides").data("transition") will eventually be put into the following code in the Recip file of the standalone version
	// Reveal.initialize({
	// 	transition: 'convex'
	// });

});

$("#global-script").click(function(e){
	openDialogBox("Custom global JavaScript:<br><textarea rows='10' cols='60' id='custom-script-editor'>"+$("#custom-script").html()+"</textarea>", function(e){
		$("#custom-script")[0].text = $("#custom-script-editor").val();
	});
});

$("#global-style").click(function(e){
	openDialogBox("Custom global CSS style:<br><textarea rows='10' cols='60' id='custom-style-editor'>"+$("#custom-style").html()+"</textarea>", function(e){
		$("#custom-style").html("")[0].appendChild(document.createTextNode($("#custom-style-editor").val()));
	});
});



/* ===== Current selected ===== */

$("#edit-style").click(function(e){
	try {
		var currentEl = $(window.getSelection().getRangeAt(0).startContainer.parentNode);
		var currentElStyle = currentEl.attr("style");
		if (!currentElStyle) {
			currentElStyle = "";
		}
		openDialogBox("Custom CSS style for the currently selected element:<br><textarea rows='10' cols='60' id='custom-style-editor'>"+currentElStyle+"</textarea>", function(e){
			currentEl.attr("style", $("#custom-style-editor").val());
		});
	} catch (e) {
	}
});

$("#delete-element").click(function(e){
	try {
		var currentEl = $(window.getSelection().getRangeAt(0).startContainer.parentNode);
		if (currentEl.parents(".slides").length > 0) {
			if (currentEl.is("td")) {
				currentEl = currentEl.closest("tr");
			}
			currentEl.remove();
		}
	} catch (e) {
	}
});




/* ===== Dialog box ===== */

function openDialogBox(text, okButtonCallBack, callback) {
	$("#dialog-box").addClass("dialog-box-open");
	$("#dialog-text").html(text);
	$("#dialog-btn-bar").html("<a href='#' class='dialog-btn' id='dialog-ok'>OK</a><a href='#' class='dialog-btn' id='dialog-cancel'>Cancel</a>");

	$("#dialog-ok").click(function(e){
		closeDialogBox(okButtonCallBack);
	});

	$("#dialog-cancel").click(function(e){
		closeDialogBox();
	});

	if (callback !== undefined) {
		callback();
	}
}

function closeDialogBox(callback) {
	if (callback !== undefined) {
		callback();
	}
	$("#dialog-box").removeClass("dialog-box-open");
	$("#dialog-text").html("");
	$("#dialog-btn-bar").html("");
}

