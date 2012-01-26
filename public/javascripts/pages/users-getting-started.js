Diaspora.Pages.UsersGettingStarted = function() {
  var self = this;

  this.subscribe("page/ready", function(evt, body) {
    self.peopleSearch = self.instantiate("Search", body.find("form.people.search_form"));
    self.tagSearch = self.instantiate("Search", body.find("form.tag_input.search_form"));

    $('#edit_profile').bind('ajax:success', function(evt, data, status, xhr){
      $('#gs-name-form-spinner').addClass("hidden");
      $('.profile .saved').show();
      $('.profile .saved').fadeOut(2000);
    });

    // It seems that the default behavior of rails ujs is to clear the remote form
    $('#edit_profile').bind('ajax:complete', function(evt, xhr, status){
      var firstNameField = $("#profile_first_name");
      firstNameField.val(firstNameField.data("cachedValue"));

      /* flash message prompt */
      var message = Diaspora.I18n.t("getting_started.hey", {'name': $("#profile_first_name").val()});
      Diaspora.page.flashMessages.render({success: true, notice: message});
    });

    /*$("#profile_first_name").bind("change", function(){
      $(this).data("cachedValue", $(this).val());
      $('#edit_profile').submit();
      $('#gs-name-form-spinner').removeClass("hidden");
    });*/

    $("#profile_first_name").bind("blur", function(){
      $(this).removeClass("active_input");
    });

    $("#profile_first_name").bind("focus", function(){
      $(this).addClass("active_input");
    });

    $("#awesome_button").bind("click", function(evt){
      evt.preventDefault();
      
      $(this).data("cachedValue", $(this).val());
      
      if( $("#profile_first_name").val() == '' ||
      	  $("#profile_last_name").val() == '' ||
	  	  $("#profile_company").val() == '' ||       
      	  $("#profile_location").val() == '') {
      	
      	var message = "Please provide all required fields."
        Diaspora.page.flashMessages.render({success: false, notice: message});
      	
      	return;
      } 
      
      
      $('#edit_profile').submit();
      
    });

    /* ------ */
    var autocompleteInput = $("#follow_tags");

    autocompleteInput.autoSuggest("/tags", {
      selectedItemProp: "name",
      searchObjProps: "name",
      asHtmlID: "tags",
      neverSubmit: true,
      retriveLimit: 10,
      selectionLimit: false,
      minChars: 2,
      keyDelay: 200,
      startText: "",
      emptyText: "no_results"
      });

    autocompleteInput.bind('keydown', function(evt){
      if(evt.keyCode == 13 || evt.keyCode == 9 || evt.keyCode == 32){
        evt.preventDefault();
        if( $('li.as-result-item.active').length == 0 ){
          $('li.as-result-item').first().click();
        }
      }
    });        
  });
};

function onLinkedInLoad() {
	
	IN.Event.on(IN, "auth", function() {onLinkedInLogin();});
  	IN.Event.on(IN, "logout", function() {onLinkedInLogout();});		
	
}

function onLinkedInLogin(){
	IN.API.Profile("me")
	.fields(["firstName","lastName","summary","positions", "specialties", "location"])
    .result(function(result) { 
    	var profile = result.values[0];
        $("#profile_first_name").val(profile.firstName);
        $("#profile_last_name").val(profile.lastName);
        $("#profile_bio").val(profile.summary + '\n' + profile.specialties);
        $("#profile_location").val(profile.location.name);
        
        $.each(profile.positions.values, function(i, val){
        	if(val.isCurrent){
        		$("#profile_company").val(val.company.name);
        	}
        })
        
        
    });
}

function onLinkedInLogout(){}
