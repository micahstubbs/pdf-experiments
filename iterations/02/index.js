// set the pdfjs worker source. not sure if PDFjs uses 'webworkers' API of HTML5
PDFJS.workerSrc = "pdf.worker.js";

$(document).ready(() => {
  // check for necessary features
  featureCheck();

  const // this demo is currently put as gist which does not support directories
    PDF_FILES_DIRECTORY = "";

  const // these files should exist in the given path to display correctly
    PDF_FILES = ["Newton.pdf", "Einstein.pdf", "Faraday.pdf", "Maxwell.pdf"];

  let CURRENT_FILE = {};
  const $info_name = $("#file_name_info");
  const $info_pages = $("#file_pages_info");

  $.each(PDF_FILES, (index, pdf_file) => {
    PDFJS.getDocument(PDF_FILES_DIRECTORY + pdf_file).then(pdf => {
      pdf.getPage(1).then(page => {
        const viewport = page.getViewport(0.5);
        // PDF.js returns a promise when it gets a particular page from the pdf object
        // A canvas element is used to render the page and convert into an image thumbnail
        // if single canvas is used, the content gets overridden when PDF.js promises resolve for subsequent files
        // so a dedicated canvas element is created for rendering a thumbnail for each pdf
        // the canvas element is discarded once the thumbnail is created.
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: ctx,
          viewport
        };

        page.render(renderContext).then(() => {
          // set to draw behind current content
          ctx.globalCompositeOperation = "destination-over";
          // set background color
          ctx.fillStyle = "#fff";
          // draw on entire canvas
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          // create an img from the canvas which contains the page contents
          const img_src = canvas.toDataURL();
          const $img = $("<img>").attr("src", img_src);

          const file_details = {
            name: pdf_file,
            pages: pdf.pdfInfo.numPages
          };

          const $thumb = $("<div>")
            .attr("class", "thumb")
            .attr("data-pdf-details", JSON.stringify(file_details))
            .append(
              $("<span>")
                .attr("class", "close")
                .html("&times;")
                .click(function() {
                  const details = $(this)
                    .parent()
                    .data("pdf-details");
                  alert(`Remove ${details.name} !? `);
                })
            )
            .append(
              $("<div>")
                .attr("class", "info")
                .text(pdf_file)
            )
            .append($img)
            .click(function() {
              CURRENT_FILE = $(this).data("pdf-details");
              $info_name.text(CURRENT_FILE.name);
              $info_pages.text(CURRENT_FILE.pages);
              $(".thumb").removeClass("current");
              $(this).addClass("current");
            });

          $thumb.appendTo("#thumbnail").click();
          // we have created a thumbnail and rendered the img from the canvas
          // discard the temporary canvas created for rendering this thumbnail
          canvas.remove();
          //$(canvas).remove();
        });
      }); // end of getPage
    }); // end of getDocument
  }); // end of each
}); // end of doc ready

function featureCheck() {
  // feature list required for this demo
  const features = ["webworkers", "canvas"];
  let featuresAbsent = false;
  const $list = $("<ul>").attr("id", "feature_list");
  $.each(features, (index, feature) => {
    if (Modernizr[feature]) {
      console.log(`SUCCESS: ${feature} present`);
      var $li = $("<li>")
        .css({
          border: "thin solid black",
          padding: "5px",
          margin: "5px",
          width: "auto",
          background: "lightgreen"
        })
        .text(`SUCCESS: ${feature} present`);
      $list.append($li);
    } else {
      // necessary feature is not present
      featuresAbsent = true;
      console.log(`FAILURE: ${feature} NOT present`);
      var $li = $("<li>")
        .css({
          border: "thin solid black",
          padding: "5px",
          margin: "5px",
          width: "auto",
          background: "red"
        })
        .text(`FAILURE: ${feature} NOT present`);
      $list.append($li);
    }
  });
  // append the feature list if any of the feature is not present
  if (featuresAbsent) {
    $(document.body).append($list);
  }
}
