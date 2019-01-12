$(document).ready(function() {
    //reference to article container div rendering articles inside of
    var articleContainer = $(".article-container");
    // adding event listeners for dynamically generated buttons for deleting articles
    // pulling up article notes, saving article notes, and deleting article notes
    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", "btn.notes", handleArticleNotes);
    $(document).on("click", "btn.save", handleNoteSave);
    $(document).on("click", "btn.note-delete", handleNoteDelete);

    //kicks everything off when page is loaded
    initPage();

    function initPage() {
        //empty article container, run AJAX request for saved headlines
        articleContainer.empty();
        $.get("/api/headlines?saved=true")
          .then(function(data) {
            //if we have headlines render them to the page
            if (data && data.length) {
              renderArticles(data);
            }
            else {
              //otherwise render a message explaining we have no articles
              renderEmpty();
            }
          });
      }

      function renderArticles(articles) {
        //function handles appending HTML containing article data to the page
        var articlePanels = [];
        for (var i = 0; i < articles.length; i++) {
          articlePanels.push(createPanel(articles[i]));
        }
        //append to articles to articlePanels container
        articleContainer.append(articlePanels);
      }

      function createPanel(article) {
        //takes single JSON object for an article/headline, 
        //construcats a jQuery element for the article panel
        var panel =
          $(["<div class='panel panel-default'>",
            "<div class='panel-heading'>",
            "<h3>",
            article.headline,
            "<a class='btn btn-success save'>",
            "Save Article",
            "</a>",
            "</h3>",
            "</div>",
            "<div class='panel-body'>",
            article.summary,
            "</div>",
            "</div>"
          ].join(""));
          //attached article's id to the jQuery element
          //will use this when we figure out which article user wants to save
        panel.data("_id", article._id);
        //return constructed panel jQuery element
        return panel;
      }

      function renderEmpty() {
        //renders some HTML to page explaining why we don't have articles to view
        var emptyAlert =
          $(["<div class='alert alert-warning text-center'>",
            "<h4>Looks like we don't have any new articles.</h4>",
            "</div>",
            "<div class='panel panel-default'>",
            "<div class'panel-heading text-center'>",
            "<h3>What whould you like to do?</h3>",
            "</div>",
            "<div class='panel-body text-center'>",
            "<h4><a class='scrape-new'>Try scraping new articles</a></h4>",
            "<h4><a href='/saved'> Go to saved articles</a></h4>",
            "</div>",
            "</div>"
        ].join(""));
      }

      function renderNotesList(data) {
        //renders note list items to our notes modal
        //sets up array of notes to render after finished
        //sets up a currentNote variable to temp store each note
        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
          //if no notes just display message explaining that
          currentNote = [
            "<li class='list-group-item'>",
            "No notes for this article yet.",
            "</li>"
          ].join("");
          notesToRender.push(currentNote);
        }
        else {
          //if saved notes loop thru each one
          for (var i = 0; i < data.notes.length; i++) {
            //constructs an li element to contain ournoteText and a delete button
            currentNote = $([
              "<li class='list-group-item note'>",
              data.notes[i].noteText,
              "<button class='btn btn-danger note-delete'>x</button>",
              "</li>"
            ].join(""));
            //store the note id on delete button
            currentNote.children("button").data("_id", data.notes[i]._id);
            // add currentNote to the notesTORender array
            notesToRender.push(currentNote);
          }
        }
        //append notesToRender to the note-container inside modal
        $(".note-container").append(notesToRender);
      }

      function handleArticleDelete() {
        //handles deleting articles/handles
        var articleToDelete = $(this).parents(".panel").data();
        //delete method
        $.ajax({
          method: "DELETE",
          url: "/api/headlines/" + articleToDelete._id
        }).then(function(data) {
          // it this wors, run initPage again and render list of saved articls
          if (data.ok) {
            initPage();
          }
        });
      }

      function handleArticleNotes() {
        //opens the notes modal and displays notes
        var currentArticle = $(this).parents(".panel").data();
        //grab any notes with this headline/article id
        $.get("/api/notes/" + currentArticle._id).then(function(data) {
          //constructs our initial HTML to add to the notes modal
          var modalText = [
            "<div class='container-fluid text-center'>",
            "<h4>Notes For Article: ",
            currentArticle._id,
            "</h4>",
            "</hr>",
            "<ul class='list-group note-container'>",
            "</ul>",
            "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
            "<button class='btn btn-success save'>Save Note</button>",
            "</div>"
          ].join("");
          //adding formatted HTML to the note modal          
          bootbox.dialog({
            message: modalText,
            closeButton: true
          });
          var noteData = {
            _id: currentArticle._id,
            notes: data || []
          };
          //adding some info about the article and article notes to the 
          //save button for easy access when trying to add new note
          $(".btn.save").date("article", noteData);
          //renderNotesList will populate actual note HTML inside of modal we created
          renderNotesList(noteData);
        });
      }

      function handleNoteSave() {
        //handles when a user tries to save a new note for an artticle
        // sets a variable to hold formatted data about note
        //grabs the note typed into the input box
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();
        //if have data typed into the note field, format it
        //and post to "/api/notes" route and send formatted noteData as well
        if (newNote) {
          noteData = {
            _id: $(this).data("article")._id,
            noteText: newNote
          };
          $.post("/api/notes", noteData).then(function() {
            //when complete close modal
            bootbox.hideAll();
          });
        }
      }

      function handleNoteDelete() {
        //handles deletion of notes
        //id we are grabbing was stred on the delete button when created
        var noteToDelete = $(this).data("_id");
        //perform delete request to "/api/notes/" with ID of note being deleted
        $.ajax({
          url: "/api/notes/" + noteToDelete,
          method: "DELETE"
        }).then(function() {
          //when done hide modal
          bootbox.hideAll();
        });
      }
});