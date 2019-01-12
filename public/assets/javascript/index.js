$(document).ready(function() {
  // sets a reference to article-container div where dynamic content will go
  // add event listeners to any dynamically generated "save article"
  // and "scrape new article" button
  var articleContainer = $(".article-container");
  $(document).on("click", ".btn-save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);

  //once page is ready, run the initPage function to kick things off
  initPage();

  function initPage() {
    //empty article container, run AJAX request for any unsaved data
    articleContainer.empty();
    $.get("/api/headlines?saved=false")
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
  
  function handleArticleSave() {
    //triggered when user wants to save an article
    var articleToSave = $(this).parents(".panel").data();
    articleToSave.saved = true;

    $.ajax({
      method: "PATCH",
      url: "/api/headlines",
      data: articleToSave
    })
    .then(function(data) {
      //if successfull, mongoose will send back an objectcontainiing a key, 
      //of "ok w value of 1 which casts to 'true"
      if (data.ok) {
        initPage();
      }
    });
  }

  function handleArticleScrape() {
    //handles user clicking any "scrape new article" button
    $.get("/api/fetch")
      .then(function(data) {
        initPage();
        bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "</h3>");
      });
  }
});


 //make container shake when hover on image
    /*
    $(".card-img").hover(function(){
      $("#wrapper").addClass("shake");
      }, function(){
      $("#wrapper").removeClass("shake");
    });
    
    //on click function for ngannu img
    $("#ngannu").on("click", function () {
      $("#ngannu").removeClass("img-display");
      $("#ngannu").addClass("img-hidden");
      $("#wandy").removeClass("img-hidden");
      $("#wandy").addClass("img-display");
      $("body").removeClass("backgroundNgannu");
      $("body").addClass("backgroundWandy");
  });
    //on click function for wandy img
    $("#wandy").on("click", function () {
      $("#wandy").removeClass("img-display");
      $("#wandy").addClass("img-hidden");
      $("#gracie").removeClass("img-hidden");
      $("#gracie").addClass("img-display");
      $("body").removeClass("backgroundWandy");
      $("body").addClass("backgroundGracie");
    });
    //on click function for gracie img
    $("#gracie").on("click", function () {
      $("#gracie").removeClass("img-display");
      $("#gracie").addClass("img-hidden");
      $("#m-page").removeClass("img-hidden");
      $("#m-page").addClass("img-display");
      $("body").removeClass("backgroundGracie");
      $("body").addClass("backgroundMpage");
    });
    //on click function for michael page img
    $("#m-page").on("click", function () {
      $("#m-page").removeClass("img-display");
      $("#m-page").addClass("img-hidden");
      $("#cro-cop").removeClass("img-hidden");
      $("#cro-cop").addClass("img-display");
      $("body").removeClass("backgroundMpage");
      $("body").addClass("backgroundCro-cop");
    }); 
    */