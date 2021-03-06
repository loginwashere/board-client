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

window.require.define({"test/controllers/boards_controller_test": function(exports, require, module) {
  var Boards;

  Boards = require('models/boards');

  describe('Boards', function() {
    return beforeEach(function() {
      return this.model = new Boards();
    });
  });
  
}});

window.require.define({"test/controllers/posts_controller_test": function(exports, require, module) {
  var Posts;

  Posts = require('models/posts');

  describe('Posts', function() {
    return beforeEach(function() {
      return this.model = new Posts();
    });
  });
  
}});

window.require.define({"test/controllers/threads_controller_test": function(exports, require, module) {
  var Threads;

  Threads = require('models/threads');

  describe('Threads', function() {
    return beforeEach(function() {
      return this.model = new Threads();
    });
  });
  
}});

window.require.define({"test/models/board": function(exports, require, module) {
  var Board;

  Board = require('models/board');

  describe('Board', function() {
    return beforeEach(function() {
      return this.model = new Board();
    });
  });
  
}});

window.require.define({"test/models/boards_test": function(exports, require, module) {
  

  
}});

window.require.define({"test/models/header_test": function(exports, require, module) {
  var Header;

  Header = require('models/header');

  describe('Header', function() {
    beforeEach(function() {
      return this.model = new Header();
    });
    afterEach(function() {
      return this.model.dispose();
    });
    return it('should contain 3 items', function() {
      return expect(this.model.get('items')).to.have.length(3);
    });
  });
  
}});

window.require.define({"test/models/post": function(exports, require, module) {
  var Post;

  Post = require('models/post');

  describe('Post', function() {
    return beforeEach(function() {
      return this.model = new Post();
    });
  });
  
}});

window.require.define({"test/models/posts_test": function(exports, require, module) {
  

  
}});

window.require.define({"test/models/thread": function(exports, require, module) {
  var Thread;

  Thread = require('models/thread');

  describe('Thread', function() {
    return beforeEach(function() {
      return this.model = new Thread();
    });
  });
  
}});

window.require.define({"test/models/threads_test": function(exports, require, module) {
  

  
}});

window.require.define({"test/test-helpers": function(exports, require, module) {
  
  module.exports = {
    expect: require('chai').expect,
    sinon: require('sinon')
  };
  
}});

window.require.define({"test/views/board_view": function(exports, require, module) {
  var BoardView;

  BoardView = require('views/board_view');

  describe('BoardView', function() {
    return beforeEach(function() {
      return this.view = new BoardView();
    });
  });
  
}});

window.require.define({"test/views/boards_view": function(exports, require, module) {
  var BoardsView;

  BoardsView = require('views/boards_view');

  describe('BoardsView', function() {
    return beforeEach(function() {
      return this.view = new BoardsView();
    });
  });
  
}});

window.require.define({"test/views/header_view_test": function(exports, require, module) {
  var Header, HeaderView, HeaderViewTest, mediator,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  Header = require('models/header');

  HeaderView = require('views/header_view');

  HeaderViewTest = (function(_super) {

    __extends(HeaderViewTest, _super);

    function HeaderViewTest() {
      return HeaderViewTest.__super__.constructor.apply(this, arguments);
    }

    HeaderViewTest.prototype.renderTimes = 0;

    HeaderViewTest.prototype.render = function() {
      HeaderViewTest.__super__.render.apply(this, arguments);
      return this.renderTimes += 1;
    };

    return HeaderViewTest;

  })(HeaderView);

  describe('HeaderView', function() {
    beforeEach(function() {
      this.model = new Header();
      return this.view = new HeaderViewTest({
        model: this.model
      });
    });
    afterEach(function() {
      this.view.dispose();
      return this.model.dispose();
    });
    it('should display 3 links', function() {
      return expect(this.view.$el.find('a')).to.have.length(3);
    });
    return it('should re-render on login event', function() {
      expect(this.view.renderTimes).to.equal(1);
      mediator.publish('loginStatus');
      return expect(this.view.renderTimes).to.equal(2);
    });
  });
  
}});

window.require.define({"test/views/home_page_view_test": function(exports, require, module) {
  var HomePageView;

  HomePageView = require('views/home_page_view');

  describe('HomePageView', function() {
    beforeEach(function() {
      return this.view = new HomePageView();
    });
    afterEach(function() {
      return this.view.dispose();
    });
    return it('should auto-render', function() {
      return expect(this.view.$el.find('img')).to.have.length(1);
    });
  });
  
}});

window.require.define({"test/views/post_view": function(exports, require, module) {
  var PostView;

  PostView = require('views/post_view');

  describe('PostView', function() {
    return beforeEach(function() {
      return this.view = new PostView();
    });
  });
  
}});

window.require.define({"test/views/posts_view": function(exports, require, module) {
  var PostsView;

  PostsView = require('views/posts_view');

  describe('PostsView', function() {
    return beforeEach(function() {
      return this.view = new PostsView();
    });
  });
  
}});

window.require.define({"test/views/thread_view": function(exports, require, module) {
  var ThreadView;

  ThreadView = require('views/thread_view');

  describe('ThreadView', function() {
    return beforeEach(function() {
      return this.view = new ThreadView();
    });
  });
  
}});

window.require.define({"test/views/threads_view": function(exports, require, module) {
  var ThreadsView;

  ThreadsView = require('views/threads_view');

  describe('ThreadsView', function() {
    return beforeEach(function() {
      return this.view = new ThreadsView();
    });
  });
  
}});

window.require('test/controllers/boards_controller_test');
window.require('test/controllers/posts_controller_test');
window.require('test/controllers/threads_controller_test');
window.require('test/models/boards_test');
window.require('test/models/header_test');
window.require('test/models/posts_test');
window.require('test/models/threads_test');
window.require('test/views/header_view_test');
window.require('test/views/home_page_view_test');
