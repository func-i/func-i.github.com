function QuickChange(appId, jsKey, options) {
  return this.init(appId, jsKey, options);
}

(function (window, document) {

  QuickChange.prototype = {

    ////////// defaults

    urlTriggerRes: {
      signup: /#qcsignup/,
      login: /#qclogin/,
      logout: /#qclogout/
    },

    elems: {
      $head: $('head'),
      $body: $('body'),
      $modal: $("<div href='#' class='cms-signup cms-modal' style='display: none;'>" +
        "<form>" +
          "<input name='username' type='text' placeholder='username' />" +
          "<input name='password' type='password' placeholder='password' />" +
          "<input name='owner-code' type='password' placeholder='owner-code' />" +
          "<a class='submit' href='#'>submit</a>" +
        "</form>" +
      "</div>"),
      $editable: $('[data-cms]'),
    },

    ////////// init

    init: function(appId, jsKey, options) {
      Parse.initialize(appId, jsKey);
      this.insertStyleTag();
      this.activateElems();
      if (Parse.User.current()) {
        this.makeElemsEditable();
        this.setupLogout();
      } else {
        this.setupSignupOrLogin();
      }
    },

    ////////// methods

    activateElems: function() {
      var qc = this;
      this.elems.$editable.each(function() {
        var content = new Content({
          qc: qc,
          elem: $(this)
        });

        content.elem.blur(function() {
          content.saveToDB();
        });

        content.findFromDB().then(function(dbObject) {
          content.syncFromDB(dbObject);
        });
      });
    },

    addModal: function() {
      this.findModalElems();
      this.elems.$body.append(this.elems.$modal);
      this.elems.$modal.fadeIn();
      this.setupBodyClickHandler();
    },

    clearUrlTrigger: function() {
      var url = document.URL;
      var trigger = url.match(this.urlTriggerRes.login) || url.match(this.urlTriggerRes.signup) || url.match(this.urlTriggerRes.logout);
      var cleanUrl = url.replace(trigger[0], '');
      return window.location.replace(cleanUrl);
    },

    handleBodyClick: function(ev) {
      this.elems.$modal.fadeOut(this.clearUrlTrigger.bind(this));
    },

    findModalElems: function() {
      this.elems.$modal.$username  = this.elems.$modal.find('[name=username]');
      this.elems.$modal.$password  = this.elems.$modal.find('[name=password]');
      this.elems.$modal.$ownerCode = this.elems.$modal.find('[name=owner-code]');
      this.elems.$modal.$submit    = this.elems.$modal.find('.submit');
    },

    handleLoginError: function(user, error) {
      this.elems.$modal.$username.val(''); this.elems.$modal.$password.val('');
      alert(error.message);
    },

    handleLoginSubmit: function(ev) {
      ev.preventDefault();

      Parse.User.logIn(this.elems.$modal.$username.val(), this.elems.$modal.$password.val(), {
        success: this.handleLoginOrSignupSuccess.bind(this),
        error: this.handleLoginError.bind(this)
      });
    },

    handleLoginOrSignupSuccess: function(user) {
      this.currentUser = user;
      this.elems.$modal.fadeOut(this.elems.$modal.remove);
      this.makeElemsEditable();
      this.clearUrlTrigger();
    },

    handleSignupError: function(user, error) {
      this.elems.$modal.$username.val(''); this.elems.$modal.$password.val(''); this.elems.$modal.$ownerCode.val('');
      alert(error.message);
    },

    handleSignupSubmit: function(ev) {
      ev.preventDefault();

      var user = new Parse.User();
      user.set("username", this.elems.$modal.$username.val());
      user.set("password", this.elems.$modal.$password.val());
      user.set("ownerCode", this.elems.$modal.$ownerCode.val());

      user.signUp(null, {
        success: this.handleLoginOrSignupSuccess.bind(this),
        error: this.handleSignupError.bind(this)
      });
    },

    insertStyleTag: function() {
      this.elems.$head.append(this.$style());
    },

    loginOrSignupTriggered: function() {
      return (this.signupTriggered()) || (this.loginTriggered());
    },

    loginTriggered: function() {
      return this.urlTriggerRes.login.test(document.URL);
    },

    logoutTriggered: function() {
      return this.urlTriggerRes.logout.test(document.URL);
    },

    makeElemsEditable: function() {
      this.elems.$editable.attr('contentEditable', true);
    },

    makeElemsUneditable: function() {
      this.elems.$editable.attr('contentEditable', false);
    },

    setupBodyClickHandler: function() {
      this.elems.$body.click(this.handleBodyClick.bind(this));
      this.elems.$modal.click(function(ev) {
        ev.stopPropagation();
      });
    },

    setupLogin: function() {
      this.elems.$modal.$ownerCode.remove();
      this.elems.$modal.$submit.click(this.handleLoginSubmit.bind(this));
    },

    setupLogout: function() {
      if (this.logoutTriggered()) {
        Parse.User.logOut();
        this.makeElemsUneditable();
        setTimeout(this.clearUrlTrigger.bind(this), 2000);
      }
    },

    setupSignup: function() {
      this.elems.$modal.$submit.click(this.handleSignupSubmit.bind(this));
    },

    setupSignupOrLogin: function() {
      if (this.loginOrSignupTriggered()) {
        this.addModal();
        if (this.signupTriggered())
          this.setupSignup();
        else if (this.loginTriggered())
          this.setupLogin();
      }
    },

    signupTriggered: function() {
      return this.urlTriggerRes.signup.test(document.URL);
    },

    ////////// style tag

    $style: function() {
      var styleTag = "<style> " +
        "[data-cms] { outline: 0 solid transparent !important } " +
        "[data-cms]:focus {" + 
          "outline: 0 solid transparent !important;" +
          "background-color: #c4ffcc !important;" +
          "color: rgb(45,45,45) !important;" +
        "}" +
        "div.cms-modal {" +
          "position: fixed !important;" +
          "left: 50% !important;" +
          "top: 50% !important;" +
          "height: 200px !important;" +
          "width: 300px !important;" +
          "margin-top: -100px !important;" +
          "margin-left: -150px !important;" +
          "background-color: rgb(45,45,45) !important;" +
          "padding: 1em !important;" +
          "box-sizing: border-box !important;" +
          "color: rgb(45,45,45) !important;" +
          "font-family: Helvetica, Arial !important;" +
          "font-size: .75rem !important" +
        "}" +
        "div.cms-modal input {" +
          "width: 100% !important;" +
          "display: block !important;" +
          "padding: .75em !important;" +
          "margin-bottom: 1em !important;" +
          "box-sizing: border-box !important;" +
          "outline: 0 !important;" +
          "border: 0 !important;" +
        "}" +
        "div.cms-modal input:focus {" +
          "outline: 0 !important;" +
          "background-color: #c4ffcc !important;" +
        "}" +
        "div.cms-modal a {" +
          "display: inline-block !important;" +
          "text-decoration: none !important;" +
          "color: #c4ffcc !important;" +
          "padding: .5em !important;" +
          "border: solid 2px #c4ffcc !important;" +
          "border-radius: 6px !important;" +
        "}" +
        "div.cms-modal a:hover {" +
          "color: rgb(45,45,45) !important;" +
          "background-color: #c4ffcc !important;" +
        "}" +
      "</style>";

      return $(styleTag);
    }

  }

  // represent single editable elems

  function Content(args) {
    this.qc = args.qc;
    this.elem = args.elem;
    this.initCss();
    this.setId();
    this.setQuery();
  }

  Content.prototype = {

    ////////// defaults

    DBContent: Parse.Object.extend("Content"),

    ////////// methods

    createDBobject: function() {
      this.dbObject = new this.DBContent();
      this.dbObject.save({
        contentId: this.id,
        html: this.elem.html()
      });
    },

    findFromDB: function() {
      return this.query.first();
    },

    initCss: function() {
      this.elem.css({
        display: 'none',
      });
    },

    loadFromDB: function(dbObject) {
      this.dbObject = dbObject;
      this.elem.html(dbObject.get('html'));
    },

    saveToDB: function() {
      if (!!this.dbObject && Parse.User.current()) {
        this.dbObject.save({
          html: this.elem.html()
        });
      }
    },

    setId: function() {
      this.id = this.elem.data('cms');
    },

    setQuery: function() {
      this.query = new Parse.Query(this.DBContent);
      this.query.equalTo('contentId', this.id);
    },

    syncFromDB: function(dbObject) {
      if (!!dbObject) {
        // load already-saved content into appropriate place
        this.loadFromDB(dbObject);
      } else {
        // first instance of the content. save it to the DB
        this.createDBobject();
      }
      this.elem.css('display', '');
    },

  }

}(window, document));
