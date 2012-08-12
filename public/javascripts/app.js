(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"config": function(exports, require, module) {
  var config, production;

  config = {
    api: {}
  };

  production = true;

  config.api.root = production ? 'http://secret-hamlet-7793.herokuapp.com' : 'http://192.168.1.35:8080';

  config.root = production ? '/' : '/';

  config.api.versionRoot = config.api.root + '/v1';

  module.exports = config;
  
}});

window.require.define({"application": function(exports, require, module) {
  var Application, Chaplin, HeaderController, Layout, SessionController, config, mediator, routes,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  mediator = require('mediator');

  routes = require('routes');

  SessionController = require('controllers/session_controller');

  HeaderController = require('controllers/header_controller');

  Layout = require('views/layout');

  config = require('config');

  module.exports = Application = (function(_super) {

    __extends(Application, _super);

    function Application() {
      return Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.title = 'Brunch example application';

    Application.prototype.initialize = function() {
      Application.__super__.initialize.apply(this, arguments);
      this.initDispatcher();
      this.initLayout();
      this.initMediator();
      this.initControllers();
      this.initRouter(routes, {
        root: config.root
      });
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    Application.prototype.initLayout = function() {
      return this.layout = new Layout({
        title: this.title
      });
    };

    Application.prototype.initControllers = function() {
      new SessionController();
      return new HeaderController();
    };

    Application.prototype.initMediator = function() {
      Chaplin.mediator.user = null;
      return Chaplin.mediator.seal();
    };

    return Application;

  })(Chaplin.Application);
  
}});

window.require.define({"controllers/base/controller": function(exports, require, module) {
  var Chaplin, Controller,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Controller = (function(_super) {

    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    return Controller;

  })(Chaplin.Controller);
  
}});

window.require.define({"controllers/boards_controller": function(exports, require, module) {
  var Boards, BoardsController, BoardsView, Controller, Threads, ThreadsView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  Boards = require('models/boards');

  Threads = require('models/threads');

  BoardsView = require('views/boards_view');

  ThreadsView = require('views/threads_view');

  module.exports = BoardsController = (function(_super) {

    __extends(BoardsController, _super);

    function BoardsController() {
      return BoardsController.__super__.constructor.apply(this, arguments);
    }

    BoardsController.prototype.initialize = function() {
      console.log('BoardsController - initialize');
      return BoardsController.__super__.initialize.apply(this, arguments);
    };

    BoardsController.prototype.index = function(params) {
      console.log('BoardsController - index - params: ', params);
      this.collection = new Boards();
      console.log('collection: ', this.collection);
      this.view = new BoardsView({
        collection: this.collection
      });
      return this.collection.fetch();
    };

    BoardsController.prototype.show = function(params) {
      this.currentId = params.boardId;
      console.log('BoardsController - show - params: ', params);
      this.collection = new Boards({
        boardId: this.currentId
      });
      console.log('collection: ', this.collection);
      this.view = new BoardsView({
        collection: this.collection
      });
      this.collection.fetch({
        url: this.collection.url() + '/' + this.currentId
      });
      this.threadsCollection = new Threads({
        boardId: this.currentId
      });
      console.log('threadsCollection: ', this.threadsCollection);
      this.threadsView = new ThreadsView({
        collection: this.threadsCollection
      });
      return this.threadsCollection.fetch();
    };

    return BoardsController;

  })(Controller);
  
}});

window.require.define({"controllers/header_controller": function(exports, require, module) {
  var Controller, Header, HeaderController, HeaderView, mediator,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  mediator = require('mediator');

  Header = require('models/header');

  HeaderView = require('views/header_view');

  module.exports = HeaderController = (function(_super) {

    __extends(HeaderController, _super);

    function HeaderController() {
      return HeaderController.__super__.constructor.apply(this, arguments);
    }

    HeaderController.prototype.initialize = function() {
      HeaderController.__super__.initialize.apply(this, arguments);
      this.model = new Header();
      return this.view = new HeaderView({
        model: this.model
      });
    };

    return HeaderController;

  })(Controller);
  
}});

window.require.define({"controllers/home_controller": function(exports, require, module) {
  var Controller, HomeController, HomePageView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  HomePageView = require('views/home_page_view');

  module.exports = HomeController = (function(_super) {

    __extends(HomeController, _super);

    function HomeController() {
      return HomeController.__super__.constructor.apply(this, arguments);
    }

    HomeController.prototype.historyURL = 'home';

    HomeController.prototype.index = function() {
      return this.view = new HomePageView();
    };

    return HomeController;

  })(Controller);
  
}});

window.require.define({"controllers/posts_controller": function(exports, require, module) {
  var Controller, PostsController,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  module.exports = PostsController = (function(_super) {

    __extends(PostsController, _super);

    function PostsController() {
      return PostsController.__super__.constructor.apply(this, arguments);
    }

    return PostsController;

  })(Controller);
  
}});

window.require.define({"controllers/session_controller": function(exports, require, module) {
  var Controller, LoginView, SessionController, User, mediator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  Controller = require('controllers/base/controller');

  User = require('models/user');

  LoginView = require('views/login_view');

  module.exports = SessionController = (function(_super) {

    __extends(SessionController, _super);

    function SessionController() {
      this.logout = __bind(this.logout, this);

      this.serviceProviderSession = __bind(this.serviceProviderSession, this);

      this.triggerLogin = __bind(this.triggerLogin, this);
      return SessionController.__super__.constructor.apply(this, arguments);
    }

    SessionController.serviceProviders = {};

    SessionController.prototype.loginStatusDetermined = false;

    SessionController.prototype.loginView = null;

    SessionController.prototype.serviceProviderName = null;

    SessionController.prototype.initialize = function() {
      this.subscribeEvent('serviceProviderSession', this.serviceProviderSession);
      this.subscribeEvent('logout', this.logout);
      this.subscribeEvent('userData', this.userData);
      this.subscribeEvent('!showLogin', this.showLoginView);
      this.subscribeEvent('!login', this.triggerLogin);
      this.subscribeEvent('!logout', this.triggerLogout);
      return this.getSession();
    };

    SessionController.prototype.loadServiceProviders = function() {
      var name, serviceProvider, _ref, _results;
      _ref = SessionController.serviceProviders;
      _results = [];
      for (name in _ref) {
        serviceProvider = _ref[name];
        _results.push(serviceProvider.load());
      }
      return _results;
    };

    SessionController.prototype.createUser = function(userData) {
      return mediator.user = new User(userData);
    };

    SessionController.prototype.getSession = function() {
      var name, serviceProvider, _ref, _results;
      this.loadServiceProviders();
      _ref = SessionController.serviceProviders;
      _results = [];
      for (name in _ref) {
        serviceProvider = _ref[name];
        _results.push(serviceProvider.done(serviceProvider.getLoginStatus));
      }
      return _results;
    };

    SessionController.prototype.showLoginView = function() {
      if (this.loginView) {
        return;
      }
      this.loadServiceProviders();
      return this.loginView = new LoginView({
        serviceProviders: SessionController.serviceProviders
      });
    };

    SessionController.prototype.triggerLogin = function(serviceProviderName) {
      var serviceProvider;
      serviceProvider = SessionController.serviceProviders[serviceProviderName];
      if (!serviceProvider.isLoaded()) {
        mediator.publish('serviceProviderMissing', serviceProviderName);
        return;
      }
      mediator.publish('loginAttempt', serviceProviderName);
      return serviceProvider.triggerLogin();
    };

    SessionController.prototype.serviceProviderSession = function(session) {
      this.serviceProviderName = session.provider.name;
      this.disposeLoginView();
      session.id = session.userId;
      delete session.userId;
      this.createUser(session);
      return this.publishLogin();
    };

    SessionController.prototype.publishLogin = function() {
      this.loginStatusDetermined = true;
      mediator.publish('login', mediator.user);
      return mediator.publish('loginStatus', true);
    };

    SessionController.prototype.triggerLogout = function() {
      return mediator.publish('logout');
    };

    SessionController.prototype.logout = function() {
      this.loginStatusDetermined = true;
      this.disposeUser();
      this.serviceProviderName = null;
      this.showLoginView();
      return mediator.publish('loginStatus', false);
    };

    SessionController.prototype.userData = function(data) {
      return mediator.user.set(data);
    };

    SessionController.prototype.disposeLoginView = function() {
      if (!this.loginView) {
        return;
      }
      this.loginView.dispose();
      return this.loginView = null;
    };

    SessionController.prototype.disposeUser = function() {
      if (!mediator.user) {
        return;
      }
      mediator.user.dispose();
      return mediator.user = null;
    };

    return SessionController;

  })(Controller);
  
}});

window.require.define({"controllers/threads_controller": function(exports, require, module) {
  var Controller, Threads, ThreadsController, ThreadsView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  Threads = require('models/threads');

  ThreadsView = require('views/threads_view');

  module.exports = ThreadsController = (function(_super) {

    __extends(ThreadsController, _super);

    function ThreadsController() {
      return ThreadsController.__super__.constructor.apply(this, arguments);
    }

    ThreadsController.prototype.initialize = function() {
      console.log('ThreadsController - initialize');
      return ThreadsController.__super__.initialize.apply(this, arguments);
    };

    ThreadsController.prototype.index = function(params) {
      console.log('ThreadsController - index - params: ', params);
      this.collection = new Threads({
        boardId: params.boardId
      });
      console.log('collection: ', this.collection);
      this.view = new ThreadsView({
        collection: this.collection,
        boardId: params.boardId
      });
      return this.collection.fetch();
    };

    ThreadsController.prototype.show = function(params) {
      console.log('ThreadsController - show - params: ', params);
      this.collection = new Threads({
        boardId: params.boardId,
        threadId: params.threadId
      });
      console.log('collection: ', this.collection);
      this.view = new ThreadsView({
        collection: this.collection,
        boardId: params.boardId
      });
      return this.collection.fetch();
    };

    return ThreadsController;

  })(Controller);
  
}});

window.require.define({"initialize": function(exports, require, module) {
  var Application;

  Application = require('application');

  $(function() {
    var app;
    app = new Application();
    return app.initialize();
  });
  
}});

window.require.define({"lib/services/service_provider": function(exports, require, module) {
  var Chaplin, ServiceProvider, utils;

  utils = require('lib/utils');

  Chaplin = require('chaplin');

  module.exports = ServiceProvider = (function() {

    _(ServiceProvider.prototype).extend(Chaplin.Subscriber);

    ServiceProvider.prototype.loading = false;

    function ServiceProvider() {
      _(this).extend($.Deferred());
      utils.deferMethods({
        deferred: this,
        methods: ['triggerLogin', 'getLoginStatus'],
        onDeferral: this.load
      });
    }

    ServiceProvider.prototype.disposed = false;

    ServiceProvider.prototype.dispose = function() {
      if (this.disposed) {
        return;
      }
      this.unsubscribeAllEvents();
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return ServiceProvider;

  })();

  /*

    Standard methods and their signatures:

    load: ->
      # Load a script like this:
      utils.loadLib 'http://example.org/foo.js', @loadHandler, @reject

    loadHandler: =>
      # Init the library, then resolve
      ServiceProviderLibrary.init(foo: 'bar')
      @resolve()

    isLoaded: ->
      # Return a Boolean
      Boolean window.ServiceProviderLibrary and ServiceProviderLibrary.login

    # Trigger login popup
    triggerLogin: (loginContext) ->
      callback = _(@loginHandler).bind(this, loginContext)
      ServiceProviderLibrary.login callback

    # Callback for the login popup
    loginHandler: (loginContext, response) =>

      eventPayload = {provider: this, loginContext}
      if response
        # Publish successful login
        mediator.publish 'loginSuccessful', eventPayload

        # Publish the session
        mediator.publish 'serviceProviderSession',
          provider: this
          userId: response.userId
          accessToken: response.accessToken
          # etc.

      else
        mediator.publish 'loginFail', eventPayload

    getLoginStatus: (callback = @loginStatusHandler, force = false) ->
      ServiceProviderLibrary.getLoginStatus callback, force

    loginStatusHandler: (response) =>
      return unless response
      mediator.publish 'serviceProviderSession',
        provider: this
        userId: response.userId
        accessToken: response.accessToken
        # etc.
  */

  
}});

window.require.define({"lib/support": function(exports, require, module) {
  var Chaplin, support, utils;

  Chaplin = require('chaplin');

  utils = require('lib/utils');

  support = utils.beget(Chaplin.support);

  module.exports = support;
  
}});

window.require.define({"lib/utils": function(exports, require, module) {
  var Chaplin, mediator, utils,
    __hasProp = {}.hasOwnProperty;

  Chaplin = require('chaplin');

  mediator = require('mediator');

  utils = Chaplin.utils.beget(Chaplin.utils);

  _(utils).extend({
    /*
      Wrap methods so they can be called before a deferred is resolved.
      The actual methods are called once the deferred is resolved.
    
      Parameters:
    
      Expects an options hash with the following properties:
    
      deferred
        The Deferred object to wait for.
    
      methods
        Either:
        - A string with a method name e.g. 'method'
        - An array of strings e.g. ['method1', 'method2']
        - An object with methods e.g. {method: -> alert('resolved!')}
    
      host (optional)
        If you pass an array of strings in the `methods` parameter the methods
        are fetched from this object. Defaults to `deferred`.
    
      target (optional)
        The target object the new wrapper methods are created at.
        Defaults to host if host is given, otherwise it defaults to deferred.
    
      onDeferral (optional)
        An additional callback function which is invoked when the method is called
        and the Deferred isn't resolved yet.
        After the method is registered as a done handler on the Deferred,
        this callback is invoked. This can be used to trigger the resolving
        of the Deferred.
    
      Examples:
    
      deferMethods(deferred: def, methods: 'foo')
        Wrap the method named foo of the given deferred def and
        postpone all calls until the deferred is resolved.
    
      deferMethods(deferred: def, methods: def.specialMethods)
        Read all methods from the hash def.specialMethods and
        create wrapped methods with the same names at def.
    
      deferMethods(
        deferred: def, methods: def.specialMethods, target: def.specialMethods
      )
        Read all methods from the object def.specialMethods and
        create wrapped methods at def.specialMethods,
        overwriting the existing ones.
    
      deferMethods(deferred: def, host: obj, methods: ['foo', 'bar'])
        Wrap the methods obj.foo and obj.bar so all calls to them are postponed
        until def is resolved. obj.foo and obj.bar are overwritten
        with their wrappers.
    */

    deferMethods: function(options) {
      var deferred, func, host, methods, methodsHash, name, onDeferral, target, _i, _len, _results;
      deferred = options.deferred;
      methods = options.methods;
      host = options.host || deferred;
      target = options.target || host;
      onDeferral = options.onDeferral;
      methodsHash = {};
      if (typeof methods === 'string') {
        methodsHash[methods] = host[methods];
      } else if (methods.length && methods[0]) {
        for (_i = 0, _len = methods.length; _i < _len; _i++) {
          name = methods[_i];
          func = host[name];
          if (typeof func !== 'function') {
            throw new TypeError("utils.deferMethods: method " + name + " notfound on host " + host);
          }
          methodsHash[name] = func;
        }
      } else {
        methodsHash = methods;
      }
      _results = [];
      for (name in methodsHash) {
        if (!__hasProp.call(methodsHash, name)) continue;
        func = methodsHash[name];
        if (typeof func !== 'function') {
          continue;
        }
        _results.push(target[name] = utils.createDeferredFunction(deferred, func, target, onDeferral));
      }
      return _results;
    },
    createDeferredFunction: function(deferred, func, context, onDeferral) {
      if (context == null) {
        context = deferred;
      }
      return function() {
        var args;
        args = arguments;
        if (deferred.state() === 'resolved') {
          return func.apply(context, args);
        } else {
          deferred.done(function() {
            return func.apply(context, args);
          });
          if (typeof onDeferral === 'function') {
            return onDeferral.apply(context);
          }
        }
      };
    }
  });

  module.exports = utils;
  
}});

window.require.define({"lib/view_helper": function(exports, require, module) {
  var mediator, utils;

  mediator = require('mediator');

  utils = require('chaplin/lib/utils');

  Handlebars.registerHelper('if_logged_in', function(options) {
    if (mediator.user) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper('with', function(context, options) {
    if (!context || Handlebars.Utils.isEmpty(context)) {
      return options.inverse(this);
    } else {
      return options.fn(context);
    }
  });

  Handlebars.registerHelper('without', function(context, options) {
    var inverse;
    inverse = options.inverse;
    options.inverse = options.fn;
    options.fn = inverse;
    return Handlebars.helpers["with"].call(this, context, options);
  });

  Handlebars.registerHelper('with_user', function(options) {
    var context;
    context = mediator.user || {};
    return Handlebars.helpers["with"].call(this, context, options);
  });
  
}});

window.require.define({"mediator": function(exports, require, module) {
  
  module.exports = require('chaplin').mediator;
  
}});

window.require.define({"models/base/collection": function(exports, require, module) {
  var Chaplin, Collection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Collection = (function(_super) {

    __extends(Collection, _super);

    function Collection() {
      return Collection.__super__.constructor.apply(this, arguments);
    }

    return Collection;

  })(Chaplin.Collection);
  
}});

window.require.define({"models/base/model": function(exports, require, module) {
  var Chaplin, Model,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Model = (function(_super) {

    __extends(Model, _super);

    function Model() {
      return Model.__super__.constructor.apply(this, arguments);
    }

    return Model;

  })(Chaplin.Model);
  
}});

window.require.define({"models/board": function(exports, require, module) {
  var Board, Model,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  module.exports = Board = (function(_super) {

    __extends(Board, _super);

    function Board() {
      return Board.__super__.constructor.apply(this, arguments);
    }

    Board.prototype.parse = function(response) {
      var _ref;
      console.log('Board - parse - response', response);
      if ((response != null ? (_ref = response.response) != null ? _ref.boards : void 0 : void 0) != null) {
        return response.response.boards[0];
      } else {
        return response;
      }
    };

    return Board;

  })(Model);
  
}});

window.require.define({"models/boards": function(exports, require, module) {
  var Board, Boards, Collection, config,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Collection = require('models/base/collection');

  Board = require('models/board');

  config = require('config');

  module.exports = Boards = (function(_super) {

    __extends(Boards, _super);

    function Boards() {
      return Boards.__super__.constructor.apply(this, arguments);
    }

    Boards.prototype.model = Board;

    Boards.prototype.initialize = function(attributes, options) {
      console.debug('Boards#initialize - attributes', attributes);
      if ((attributes != null ? attributes.boardId : void 0) != null) {
        console.debug('attributes.boardId', attributes.boardId);
        this.boardId = attributes.boardId;
      }
      return Boards.__super__.initialize.apply(this, arguments);
    };

    Boards.prototype.url = function(method) {
      var url;
      url = config.api.root + '/boards';
      console.debug('Boards - url - @boardId ', this.boardId);
      console.debug('Boards - url - @boardId? ', this.boardId != null);
      console.debug('Boards - url - method ', method);
      console.debug('Boards - url - url ', url);
      return url;
    };

    Boards.prototype.parse = function(response) {
      console.log('Boards - parse - response', response);
      return response.response.boards;
    };

    return Boards;

  })(Collection);
  
}});

window.require.define({"models/header": function(exports, require, module) {
  var Header, Model,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  module.exports = Header = (function(_super) {

    __extends(Header, _super);

    function Header() {
      return Header.__super__.constructor.apply(this, arguments);
    }

    Header.prototype.defaults = {
      items: [
        {
          href: 'http://brunch.readthedocs.org/',
          title: 'Documentation'
        }, {
          href: 'https://github.com/brunch/brunch/issues',
          title: 'Github Issues'
        }, {
          href: 'https://github.com/paulmillr/ostio',
          title: 'Ost.io Example App'
        }
      ]
    };

    return Header;

  })(Model);
  
}});

window.require.define({"models/post": function(exports, require, module) {
  var Model, Post,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  module.exports = Post = (function(_super) {

    __extends(Post, _super);

    function Post() {
      return Post.__super__.constructor.apply(this, arguments);
    }

    return Post;

  })(Model);
  
}});

window.require.define({"models/posts": function(exports, require, module) {
  var Collection, Post, Posts,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Collection = require('models/base/collection');

  Post = require('models/post');

  module.exports = Posts = (function(_super) {

    __extends(Posts, _super);

    function Posts() {
      return Posts.__super__.constructor.apply(this, arguments);
    }

    Posts.prototype.model = Post;

    return Posts;

  })(Collection);
  
}});

window.require.define({"models/thread": function(exports, require, module) {
  var Model, Thread,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  module.exports = Thread = (function(_super) {

    __extends(Thread, _super);

    function Thread() {
      return Thread.__super__.constructor.apply(this, arguments);
    }

    Thread.prototype.parse = function(response) {
      var _ref;
      console.log('Thread - parse - response', response);
      if ((response != null ? (_ref = response.response) != null ? _ref.threads : void 0 : void 0) != null) {
        return response.response.threads[0];
      } else {
        return response;
      }
    };

    return Thread;

  })(Model);
  
}});

window.require.define({"models/threads": function(exports, require, module) {
  var Collection, Thread, Threads, config,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Collection = require('models/base/collection');

  Thread = require('models/thread');

  config = require('config');

  module.exports = Threads = (function(_super) {

    __extends(Threads, _super);

    function Threads() {
      return Threads.__super__.constructor.apply(this, arguments);
    }

    Threads.prototype.model = Thread;

    Threads.prototype.initialize = function(attributes, options) {
      Threads.__super__.initialize.apply(this, arguments);
      console.debug('Threads#initialize - attributes', attributes);
      if ((attributes != null ? attributes.boardId : void 0) != null) {
        console.debug('attributes.boardId', attributes.boardId);
        console.debug('attributes.threadId', attributes.threadId);
        this.boardId = attributes.boardId;
        if (attributes.threadId != null) {
          return this.threadId = attributes.threadId;
        }
      }
    };

    Threads.prototype.url = function() {
      var url;
      console.debug('Threads - url - @boardId ', this.boardId);
      url = config.api.root + '/boards/' + this.boardId + '/threads';
      if (this.threadId != null) {
        url = url + '/' + this.threadId;
      }
      return url;
    };

    Threads.prototype.parse = function(response) {
      console.log('Threads - parse - response', response);
      return response.response.threads;
    };

    return Threads;

  })(Collection);
  
}});

window.require.define({"models/user": function(exports, require, module) {
  var Model, User,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  module.exports = User = (function(_super) {

    __extends(User, _super);

    function User() {
      return User.__super__.constructor.apply(this, arguments);
    }

    return User;

  })(Model);
  
}});

window.require.define({"routes": function(exports, require, module) {
  
  module.exports = function(match) {
    match('', 'boards#index');
    match('boards', 'boards#index');
    match('boards/:boardId', 'boards#show');
    match('boards/:boardId/threads', 'threads#index');
    match('boards/:boardId/threads/:threadId', 'threads#show');
    match('boards/:boardId/threads/:threadId/posts', 'posts#index');
    return match('boards/:boardId/threads/:threadId/posts/:postId', 'posts#show');
  };
  
}});

window.require.define({"views/base/collection_view": function(exports, require, module) {
  var Chaplin, CollectionView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  View = require('views/base/view');

  module.exports = CollectionView = (function(_super) {

    __extends(CollectionView, _super);

    function CollectionView() {
      return CollectionView.__super__.constructor.apply(this, arguments);
    }

    CollectionView.prototype.getTemplateFunction = View.prototype.getTemplateFunction;

    return CollectionView;

  })(Chaplin.CollectionView);
  
}});

window.require.define({"views/base/page_view": function(exports, require, module) {
  var PageView, View, mediator,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  View = require('views/base/view');

  module.exports = PageView = (function(_super) {

    __extends(PageView, _super);

    function PageView() {
      return PageView.__super__.constructor.apply(this, arguments);
    }

    PageView.prototype.container = '#page-container';

    PageView.prototype.autoRender = true;

    PageView.prototype.renderedSubviews = false;

    PageView.prototype.initialize = function() {
      var rendered,
        _this = this;
      PageView.__super__.initialize.apply(this, arguments);
      if (this.model || this.collection) {
        rendered = false;
        return this.modelBind('change', function() {
          if (!rendered) {
            _this.render();
          }
          return rendered = true;
        });
      }
    };

    PageView.prototype.renderSubviews = function() {};

    PageView.prototype.render = function() {
      PageView.__super__.render.apply(this, arguments);
      if (!this.renderedSubviews) {
        this.renderSubviews();
        return this.renderedSubviews = true;
      }
    };

    return PageView;

  })(View);
  
}});

window.require.define({"views/base/view": function(exports, require, module) {
  var Chaplin, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  require('lib/view_helper');

  module.exports = View = (function(_super) {

    __extends(View, _super);

    function View() {
      return View.__super__.constructor.apply(this, arguments);
    }

    View.prototype.getTemplateFunction = function() {
      var template, templateFunc;
      template = this.template;
      if (typeof template === 'string') {
        templateFunc = Handlebars.compile(template);
        this.constructor.prototype.template = templateFunc;
      } else {
        templateFunc = template;
      }
      return templateFunc;
    };

    return View;

  })(Chaplin.View);
  
}});

window.require.define({"views/board_view": function(exports, require, module) {
  var BoardView, View, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/board');

  module.exports = BoardView = (function(_super) {

    __extends(BoardView, _super);

    function BoardView() {
      return BoardView.__super__.constructor.apply(this, arguments);
    }

    BoardView.prototype.template = template;

    BoardView.prototype.initialize = function(atributes) {
      console.debug('BoardView - initialize - arguments ', arguments);
      return console.debug('BoardView - initialize - atributes ', atributes);
    };

    BoardView.prototype.getTemplateData = function() {
      var tojsonModel;
      console.log('BoardView - @model - ', this.model);
      tojsonModel = this.model.toJSON();
      console.log('BoardView - @model - json', tojsonModel);
      return {
        board: this.model
      };
    };

    return BoardView;

  })(View);
  
}});

window.require.define({"views/boards_view": function(exports, require, module) {
  var Board, BoardView, BoardsView, CollectionView, template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CollectionView = require('views/base/collection_view');

  template = require('views/templates/boards');

  BoardView = require('views/board_view');

  Board = require('models/board');

  module.exports = BoardsView = (function(_super) {

    __extends(BoardsView, _super);

    function BoardsView() {
      this.edit = __bind(this.edit, this);

      this.toggleEdit = __bind(this.toggleEdit, this);

      this["delete"] = __bind(this["delete"], this);

      this.create = __bind(this.create, this);
      return BoardsView.__super__.constructor.apply(this, arguments);
    }

    BoardsView.prototype.template = template;

    BoardsView.prototype.itemView = BoardView;

    BoardsView.prototype.listSelector = 'div.boards';

    BoardsView.prototype.container = '#page-container';

    BoardsView.prototype.autoRender = true;

    BoardsView.prototype.initialize = function(options) {
      BoardsView.__super__.initialize.apply(this, arguments);
      console.debug('BoardsView#initialize', this.el, this.$el, options);
      this.delegate('submit', 'form.board-create', this.create);
      this.delegate('click', 'button.board-delete', this["delete"]);
      this.delegate('click', 'button.item-edit', this.toggleEdit);
      return this.delegate('submit', 'form.board-edit', this.edit);
    };

    BoardsView.prototype.create = function(event) {
      var result;
      event.preventDefault();
      console.debug('BoardsView#create', event);
      result = this.collection.create({
        'alias': $('input#board-alias').val(),
        'title': $('input#board-title').val(),
        'description': $('input#board-description').val()
      }, {
        'wait': true
      });
      if (result != null) {
        return $('input.board-create-reset').trigger('click');
      }
    };

    BoardsView.prototype["delete"] = function(event) {
      var board, cid, result;
      event.preventDefault();
      console.debug('BoardsView#delete', event);
      cid = $(event.target).parents('div.board').data('cid');
      console.debug('BoardsView#delete - alias ', cid);
      board = this.collection.getByCid(cid);
      console.debug('BoardsView#delete - board before', board);
      result = board.destroy({
        success: function(model, response) {
          console.debug('BoardsView#delete - board desctroy success model', model);
          return console.debug('BoardsView#delete - board desctroy success response', response);
        },
        error: function(model, response) {
          console.debug('BoardsView#delete - board desctroy error model', model);
          return console.debug('BoardsView#delete - board desctroy error response', response);
        }
      });
      console.debug('BoardsView#delete - result', result);
      return console.debug('BoardsView#delete - board after', board);
    };

    BoardsView.prototype.toggleEdit = function(event) {
      console.debug('BoardsView#toggleEdit', event);
      return $(event.target).closest('div.container').find('div.view').toggleClass('hidden').end().find('div.edit-view').toggleClass('hidden');
    };

    BoardsView.prototype.edit = function(edit) {
      var board, boardContainer, cid,
        _this = this;
      event.preventDefault();
      console.debug('BoardsView#edit', event);
      boardContainer = $(event.target).parents('div.board');
      cid = boardContainer.data('cid');
      console.debug('BoardsView#edit - cid ', cid);
      board = this.collection.getByCid(cid);
      console.debug('BoardsView#edit - board before', board);
      board.set({
        title: boardContainer.find('input.title').val(),
        description: boardContainer.find('input.description').val()
      });
      console.debug('BoardsView#edit - board before', board);
      board.save().done(function(response) {
        return _this.collection.fetch({
          url: _this.collection.url() + '/' + board.get('id')
        });
      });
      return console.debug('BoardsView#edit - board after', board);
    };

    BoardsView.prototype.getView = function(item) {
      return new BoardView({
        model: item
      });
    };

    return BoardsView;

  })(CollectionView);
  
}});

window.require.define({"views/header_view": function(exports, require, module) {
  var HeaderView, View, mediator, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  View = require('views/base/view');

  template = require('views/templates/header');

  module.exports = HeaderView = (function(_super) {

    __extends(HeaderView, _super);

    function HeaderView() {
      return HeaderView.__super__.constructor.apply(this, arguments);
    }

    HeaderView.prototype.template = template;

    HeaderView.prototype.id = 'header';

    HeaderView.prototype.className = 'header';

    HeaderView.prototype.container = '#header-container';

    HeaderView.prototype.autoRender = true;

    HeaderView.prototype.initialize = function() {
      HeaderView.__super__.initialize.apply(this, arguments);
      this.subscribeEvent('loginStatus', this.render);
      return this.subscribeEvent('startupController', this.render);
    };

    return HeaderView;

  })(View);
  
}});

window.require.define({"views/home_page_view": function(exports, require, module) {
  var HomePageView, PageView, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  template = require('views/templates/home');

  PageView = require('views/base/page_view');

  module.exports = HomePageView = (function(_super) {

    __extends(HomePageView, _super);

    function HomePageView() {
      return HomePageView.__super__.constructor.apply(this, arguments);
    }

    HomePageView.prototype.template = template;

    HomePageView.prototype.className = 'home-page';

    return HomePageView;

  })(PageView);
  
}});

window.require.define({"views/layout": function(exports, require, module) {
  var Chaplin, Layout,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Layout = (function(_super) {

    __extends(Layout, _super);

    function Layout() {
      return Layout.__super__.constructor.apply(this, arguments);
    }

    Layout.prototype.initialize = function() {
      return Layout.__super__.initialize.apply(this, arguments);
    };

    return Layout;

  })(Chaplin.Layout);
  
}});

window.require.define({"views/login_view": function(exports, require, module) {
  var LoginView, View, mediator, template, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  utils = require('lib/utils');

  View = require('views/base/view');

  template = require('views/templates/login');

  module.exports = LoginView = (function(_super) {

    __extends(LoginView, _super);

    function LoginView() {
      return LoginView.__super__.constructor.apply(this, arguments);
    }

    LoginView.prototype.template = template;

    LoginView.prototype.id = 'login';

    LoginView.prototype.container = '#content-container';

    LoginView.prototype.autoRender = true;

    LoginView.prototype.initialize = function(options) {
      LoginView.__super__.initialize.apply(this, arguments);
      return this.initButtons(options.serviceProviders);
    };

    LoginView.prototype.initButtons = function(serviceProviders) {
      var buttonSelector, failed, loaded, loginHandler, serviceProvider, serviceProviderName, _results;
      _results = [];
      for (serviceProviderName in serviceProviders) {
        serviceProvider = serviceProviders[serviceProviderName];
        buttonSelector = "." + serviceProviderName;
        this.$(buttonSelector).addClass('service-loading');
        loginHandler = _(this.loginWith).bind(this, serviceProviderName, serviceProvider);
        this.delegate('click', buttonSelector, loginHandler);
        loaded = _(this.serviceProviderLoaded).bind(this, serviceProviderName, serviceProvider);
        serviceProvider.done(loaded);
        failed = _(this.serviceProviderFailed).bind(this, serviceProviderName, serviceProvider);
        _results.push(serviceProvider.fail(failed));
      }
      return _results;
    };

    LoginView.prototype.loginWith = function(serviceProviderName, serviceProvider, e) {
      e.preventDefault();
      if (!serviceProvider.isLoaded()) {
        return;
      }
      mediator.publish('login:pickService', serviceProviderName);
      return mediator.publish('!login', serviceProviderName);
    };

    LoginView.prototype.serviceProviderLoaded = function(serviceProviderName) {
      return this.$("." + serviceProviderName).removeClass('service-loading');
    };

    LoginView.prototype.serviceProviderFailed = function(serviceProviderName) {
      return this.$("." + serviceProviderName).removeClass('service-loading').addClass('service-unavailable').attr('disabled', true).attr('title', "Error connecting. Please check whether you areblocking " + (utils.upcase(serviceProviderName)) + ".");
    };

    return LoginView;

  })(View);
  
}});

window.require.define({"views/post_view": function(exports, require, module) {
  var PostView, View, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/post');

  module.exports = PostView = (function(_super) {

    __extends(PostView, _super);

    function PostView() {
      return PostView.__super__.constructor.apply(this, arguments);
    }

    PostView.prototype.template = template;

    return PostView;

  })(View);
  
}});

window.require.define({"views/posts_view": function(exports, require, module) {
  var PostsView, View, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/posts');

  module.exports = PostsView = (function(_super) {

    __extends(PostsView, _super);

    function PostsView() {
      return PostsView.__super__.constructor.apply(this, arguments);
    }

    PostsView.prototype.template = template;

    return PostsView;

  })(View);
  
}});

window.require.define({"views/templates/board": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"well board container\" data-cid=\"";
    foundHelper = helpers.board;
    stack1 = foundHelper || depth0.board;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.cid);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "board.cid", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\r\n  <button class=\"btn btn-danger pull-right board-delete\"><i class=\"icon-remove icon-white\"></i></button>\r\n  <button class=\"btn btn-primary pull-right item-edit\"><i class=\"icon-pencil icon-white\"></i></button>\r\n  <div class=\"view\">\r\n    <p><a href=\"/boards/";
    foundHelper = helpers.board;
    stack1 = foundHelper || depth0.board;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.id);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "board.attributes.id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">";
    foundHelper = helpers.board;
    stack1 = foundHelper || depth0.board;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.alias);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "board.attributes.alias", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</a></p>\r\n    <p>";
    foundHelper = helpers.board;
    stack1 = foundHelper || depth0.board;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.title);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "board.attributes.title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\r\n    <p>";
    foundHelper = helpers.board;
    stack1 = foundHelper || depth0.board;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.description);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "board.attributes.description", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\r\n  </div>\r\n  <div class=\"edit-view hidden\">\r\n    <form class=\"board-edit form-horizontal\">\r\n      <div class=\"control-group\">\r\n        <label class=\"control-label\" for=\"board-alias\">Alias</label>\r\n        <div class=\"controls\">\r\n          <input type=\"text\" \r\n            name=\"alias\" \r\n            class=\"input-xlarge alias\"\r\n            value=\"";
    foundHelper = helpers.board;
    stack1 = foundHelper || depth0.board;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.alias);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "board.attributes.alias", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" \r\n            placeholder=\"Alias\"/>\r\n        </div>\r\n      </div>\r\n      <div class=\"control-group\">\r\n        <label class=\"control-label\" for=\"board-title\">Title</label>\r\n        <div class=\"controls\">\r\n          <input type=\"text\" \r\n            name=\"title\" \r\n            class=\"input-xlarge title\"\r\n            value=\"";
    foundHelper = helpers.board;
    stack1 = foundHelper || depth0.board;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.title);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "board.attributes.title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" \r\n            placeholder=\"Title\"/>\r\n        </div>\r\n      </div>\r\n      <div class=\"control-group\">\r\n        <label class=\"control-label\" for=\"board-description\">Description</label>\r\n        <div class=\"controls\">\r\n          <input type=\"text\" \r\n            name=\"description\" \r\n            class=\"input-xlarge description\"\r\n            value=\"";
    foundHelper = helpers.board;
    stack1 = foundHelper || depth0.board;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.description);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "board.attributes.description", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" \r\n            placeholder=\"Description\"/>\r\n        </div>\r\n      </div>\r\n      <div class=\"form-actions\">\r\n        <input class=\"btn btn-primary board-edit-submit\" type=\"submit\" value=\"Save board\"/>\r\n        <input class=\"btn btn-inverse\" type=\"reset\" value=\"Reset\"/>\r\n      </div>\r\n    </form>\r\n  </div>\r\n</div>\r\n<div class=\"board-";
    foundHelper = helpers.board;
    stack1 = foundHelper || depth0.board;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.id);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "board.attributes.id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "-threads\"></div>";
    return buffer;});
}});

window.require.define({"views/templates/boards": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"boards-container\">\r\n  <form class=\"board-create form-horizontal\">\r\n    <fieldset>\r\n      <legend>Create board</legend>\r\n      <div class=\"control-group\">\r\n        <label class=\"control-label\" for=\"board-alias\">Alias</label>\r\n        <div class=\"controls\">\r\n          <input id=\"board-alias\"\r\n            name=\"alias\"\r\n            type=\"text\"\r\n            placeholder=\"Alias\"\r\n            class=\"input-xlarge\"/>\r\n        </div>\r\n      </div>\r\n      <div class=\"control-group\">\r\n        <label class=\"control-label\" for=\"board-title\">Title</label>\r\n        <div class=\"controls\">\r\n          <input id=\"board-title\"\r\n            name=\"title\"\r\n            type=\"text\"\r\n            placeholder=\"Title\"\r\n            class=\"input-xlarge\"/>\r\n        </div>\r\n      </div>\r\n      <div class=\"control-group\">\r\n        <label class=\"control-label\" for=\"board-description\">Description</label>\r\n        <div class=\"controls\">\r\n          <input id=\"board-description\"\r\n            name=\"description\"\r\n            type=\"text\"\r\n            placeholder=\"Description\"\r\n            class=\"input-xlarge\"/>\r\n        </div>\r\n      </div>\r\n      <div class=\"form-actions\">\r\n        <input class=\"btn btn-primary board-create-submit\" type=\"submit\" value=\"Create board\"/>\r\n        <input class=\"btn btn-inverse board-create-reset\" type=\"reset\" value=\"Reset\"/>\r\n      </div>\r\n    </fieldset>\r\n  </form>\r\n  <div class=\"boards\"></div>\r\n</div>";});
}});

window.require.define({"views/templates/header": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n  <a class=\"header-link\" href=\"";
    foundHelper = helpers.href;
    stack1 = foundHelper || depth0.href;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "href", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">";
    foundHelper = helpers.title;
    stack1 = foundHelper || depth0.title;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</a>\n";
    return buffer;}

    foundHelper = helpers.items;
    stack1 = foundHelper || depth0.items;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { return stack1; }
    else { return ''; }});
}});

window.require.define({"views/templates/home": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<img src=\"https://a248.e.akamai.net/camo.github.com/73feb7a933dc37e0e030d82bbab9f9ad9a0e9cdb/687474703a2f2f6d656c6579616c2e666c78642e69742f687a66635f3531322e6a7067\" alt=\"Brunch\" />\n";});
}});

window.require.define({"views/templates/login": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", foundHelper, self=this;


    return buffer;});
}});

window.require.define({"views/templates/post": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", foundHelper, self=this;


    return buffer;});
}});

window.require.define({"views/templates/posts": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", foundHelper, self=this;


    return buffer;});
}});

window.require.define({"views/templates/thread": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"well thread container\" data-cid=\"";
    foundHelper = helpers.thread;
    stack1 = foundHelper || depth0.thread;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.cid);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "thread.cid", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\r\n  <button class=\"btn btn-danger pull-right thread-delete\"><i class=\"icon-remove icon-white\"></i></button>\r\n  <button class=\"btn btn-primary pull-right item-edit\"><i class=\"icon-pencil icon-white\"></i></button>\r\n  <div class=\"view\">\r\n    <p><a href=\"/boards/";
    foundHelper = helpers.boardId;
    stack1 = foundHelper || depth0.boardId;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "boardId", { hash: {} }); }
    buffer += escapeExpression(stack1) + "/threads/";
    foundHelper = helpers.thread;
    stack1 = foundHelper || depth0.thread;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.id);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "thread.attributes.id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">";
    foundHelper = helpers.thread;
    stack1 = foundHelper || depth0.thread;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.id);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "thread.attributes.id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</a></p>\r\n    <p>";
    foundHelper = helpers.thread;
    stack1 = foundHelper || depth0.thread;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.title);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "thread.attributes.title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\r\n    <p>";
    foundHelper = helpers.thread;
    stack1 = foundHelper || depth0.thread;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.description);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "thread.attributes.description", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\r\n  </div>\r\n  <div class=\"edit-view hidden\">\r\n    <form class=\"thread-edit form-horizontal\">\r\n      <div class=\"control-group\">\r\n        <label class=\"control-label\" for=\"thread-title\">Title</label>\r\n        <div class=\"controls\">\r\n          <input type=\"text\" \r\n            name=\"title\" \r\n            class=\"input-xlarge title\"\r\n            value=\"";
    foundHelper = helpers.thread;
    stack1 = foundHelper || depth0.thread;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.title);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "thread.attributes.title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" \r\n            placeholder=\"Title\"/>\r\n        </div>\r\n      </div>\r\n      <div class=\"control-group\">\r\n        <label class=\"control-label\" for=\"thread-description\">Description</label>\r\n        <div class=\"controls\">\r\n          <input type=\"text\" \r\n            name=\"description\" \r\n            class=\"input-xlarge description\"\r\n            value=\"";
    foundHelper = helpers.thread;
    stack1 = foundHelper || depth0.thread;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.description);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "thread.attributes.description", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" \r\n            placeholder=\"Description\"/>\r\n        </div>\r\n      </div>\r\n      <div class=\"form-actions\">\r\n        <input class=\"btn btn-primary thread-edit-submit\" type=\"submit\" value=\"Save thread\"/>\r\n        <input class=\"btn btn-inverse thread-edit-reset\" type=\"reset\" value=\"Reset\"/>\r\n      </div>\r\n    </form>\r\n  </div>\r\n</div>\r\n<div class=\"board-";
    foundHelper = helpers.boardId;
    stack1 = foundHelper || depth0.boardId;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "boardId", { hash: {} }); }
    buffer += escapeExpression(stack1) + "-thread-";
    foundHelper = helpers.thread;
    stack1 = foundHelper || depth0.thread;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.id);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "thread.attributes.id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"></div>";
    return buffer;});
}});

window.require.define({"views/templates/threads": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"threads-container\">\r\n  <form class=\"thread-create form-horizontal\">\r\n    <fieldset>\r\n      <legend>Create thread</legend>\r\n      <div class=\"control-group\">\r\n        <label class=\"control-label\" for=\"thread-title\">Title</label>\r\n        <div class=\"controls\">\r\n          <input id=\"thread-title\"\r\n            name=\"title\"\r\n            type=\"text\"\r\n            placeholder=\"Title\"\r\n            class=\"input-xlarge\"/>\r\n        </div>\r\n      </div>\r\n      <div class=\"control-group\">\r\n        <label class=\"control-label\" for=\"thread-description\">Description</label>\r\n        <div class=\"controls\">\r\n          <input id=\"thread-description\"\r\n            name=\"description\"\r\n            type=\"text\"\r\n            placeholder=\"Description\"\r\n            class=\"input-xlarge\"/>\r\n        </div>\r\n      </div>\r\n      <div class=\"form-actions\">\r\n        <input class=\"btn btn-primary thread-create-submit\" type=\"submit\" value=\"Create thread\"/>\r\n      </div>\r\n    </fieldset>\r\n  </form>\r\n  <div class=\"threads\"></div>\r\n</div>\r\n";});
}});

window.require.define({"views/thread_view": function(exports, require, module) {
  var ThreadView, View, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/thread');

  module.exports = ThreadView = (function(_super) {

    __extends(ThreadView, _super);

    function ThreadView() {
      return ThreadView.__super__.constructor.apply(this, arguments);
    }

    ThreadView.prototype.template = template;

    ThreadView.prototype.initialize = function(atributes) {
      console.debug('ThreadView - initialize - arguments ', arguments);
      console.debug('ThreadView - initialize - atributes ', atributes);
      return this.boardId = atributes.boardId;
    };

    ThreadView.prototype.getTemplateData = function() {
      console.log('ThreadView - @model - ', this.model);
      return {
        thread: this.model,
        boardId: this.boardId
      };
    };

    return ThreadView;

  })(View);
  
}});

window.require.define({"views/threads_view": function(exports, require, module) {
  var CollectionView, ThreadView, ThreadsView, template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CollectionView = require('views/base/collection_view');

  template = require('views/templates/threads');

  ThreadView = require('views/thread_view');

  module.exports = ThreadsView = (function(_super) {

    __extends(ThreadsView, _super);

    function ThreadsView() {
      this.toggleEdit = __bind(this.toggleEdit, this);

      this.create = __bind(this.create, this);
      return ThreadsView.__super__.constructor.apply(this, arguments);
    }

    ThreadsView.prototype.template = template;

    ThreadsView.prototype.itemView = ThreadView;

    ThreadsView.prototype.listSelector = 'div.threads';

    ThreadsView.prototype.container = '#page-container';

    ThreadsView.prototype.autoRender = true;

    ThreadsView.prototype.initialize = function(options) {
      ThreadsView.__super__.initialize.apply(this, arguments);
      console.debug('ThreadsView#initialize - options', options);
      this.boardId = options.collection.boardId;
      this.container = '.board-' + options.collection.boardId + '-threads';
      console.debug('ThreadsView#initialize - @container', this.container);
      this.delegate('click', 'button.item-edit', this.toggleEdit);
      this.delegate('submit', 'form.thread-create', this.create);
      return console.debug('ThreadsView - @collection ', this.collection);
    };

    ThreadsView.prototype.create = function(event) {
      var result;
      event.preventDefault();
      console.debug('ThreadsView#create', event);
      result = this.collection.create({
        'title': $('input#thread-title').val(),
        'description': $('input#thread-description').val()
      }, {
        'wait': true
      });
      if (result != null) {
        return $('input.thread-create-reset').trigger('click');
      }
    };

    ThreadsView.prototype.toggleEdit = function(event) {
      console.debug('ThreadsView#toggleEdit', event);
      return $(event.target).closest('div.container').find('div.view').toggleClass('hidden').end().find('div.edit-view').toggleClass('hidden');
    };

    ThreadsView.prototype.getView = function(item) {
      return new ThreadView({
        model: item,
        boardId: this.boardId
      });
    };

    return ThreadsView;

  })(CollectionView);
  
}});

