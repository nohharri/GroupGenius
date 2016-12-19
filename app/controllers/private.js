'use strict';

angular.module('myApp.controllers.private', [])

// Homepage controller
.controller('PrivateCtrl', function($scope, $rootScope, firebaseData, $location, $http, $timeout, $firebaseObject) {
    $scope.isCollapsed = true;
    $scope.messages = [];
    $scope.groups = [];
    $scope.groupInfo = "";
    $scope.messageText = "";
    $scope.chats = [];
    $scope.selected = null;
    $scope.name = '';
    $scope.userData;

    $scope.groupId = $location.search().groupId;
    

    var firepadRef = firebaseData.database().ref('/docs/' + $scope.groupId + '/');

    // Get Group Data
    $http.get('https://groupgenius-5953b.firebaseio.com/groups.json')
    .success(function (response) {
        var key;
        for (key in response)
        {
            if (response[key].groupId == $scope.groupId)
            {
                $scope.groupInfo = response[key];
                return;
            }
        }
    });

    firebaseData.provider().onAuthStateChanged(function(user) {
        var email = firebaseData.provider().currentUser.email;
        //console.log(email);
        var userRef = firebaseData.database().ref('/users/');
        $scope.userData = $firebaseObject(userRef);
        //userRefObject.$bindTo($scope, 'userData');
        $scope.userData.$loaded()
          .then(function() {
            console.log('user data');
            console.log($scope.userData);
            for(var user in $scope.userData) {
                if($scope.userData[user]) {
                    if(email == $scope.userData[user].email) {
                        console.log(user);
                        $scope.name = $scope.userData[user].firstName + ' ' + $scope.userData[user].lastName;
                        console.log('name found: ' + $scope.name);
                        break;
                    }
                }
            }
          })
          .catch(function(err) {
            console.error(err);
          });
    });
/*
    firebaseData.database().ref('/users/').on('value', function(snapshot) {
        var users = snapshot.val();
        for(var user in users) {
            if(email == user.email) {
                console.log(user);
                $scope.name = user.firstName + ' ' + user.lastName;
                console.log('name found: ' + $scope.name);
                break;
            }
        }
    });
*/
    // Initialize chats
    console.log($scope.groupId);
    $scope.chatRef = firebaseData.database().ref('/chat/' + $scope.groupId + '/');


    $timeout(function() {
        $scope.chatRef.on('value', function(snapshot) {
            $timeout(function() {
                if($scope.chats.length == 0) {
                    $scope.chatObjects = snapshot.val();
                    if($scope.chatObjects) {
                        for(var key in $scope.chatObjects) {
                            $scope.chatObjects[key].chatName = key;
                            $scope.chatObjects[key].selected = false;
                            console.log($scope.chatObjects[key]);
                            $scope.chats.push($scope.chatObjects[key]);
                        }
                    } 
                }
                // Initialize the first variable
                $scope.chats[0].selected = true;

                $scope.$apply();
            }, 1000);
        });
    }, 1000);


    firebaseData.provider().onAuthStateChanged(function(user) {
        var userId = user.uid;
        //firepad stuff
        var codeMirror = CodeMirror(document.getElementById('wrapper-document'), { lineWrapping: true });
        var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
            richTextShortcuts: true,
            richTextToolbar: true,
            userId: userId,
            defaultText: 'Hello, World!'
        });
        var firepadUserList = FirepadUserList.fromDiv(firepadRef.child('users'),
        document.getElementById('group-activeStatus'), userId, getUniqname(user.email));

        $scope.chatRef.off();
        var setMessage = function(data){
            $scope.messages.push(data.val());
            $scope.$apply();
        }

        $scope.chatRef.limitToLast(12).on('child_added', setMessage);
        $scope.chatRef.limitToLast(12).on('child_changed', setMessage);
    });

    $scope.saveMessage = function() {
        if(!$scope.messageText) {
            return;
        }
    $scope.chatRef.push({
        name: $scope.name,
        text: $scope.messageText
    }).then(function() {
        $scope.messageText = "";
            //This apply seems to be okay. Comment out if we're still getting errors.
            $scope.$apply();
        });
    }


$scope.location = $location;
    // Gets groupId from the url
    $scope.$watch('location.search()', function() {
        $scope.groupId = ($location.search()).groupId; 
        // Get group data from groupId
        
    }, true);
    // Changes groupId in the url
    $scope.changeTarget = function(name) {
        $location.search('groupId', name);
    }
    $scope.groupInfo = {};
});

//Taken from github
var FirepadUserList = (function() {
  function FirepadUserList(ref, place, userId, displayName) {
    if (!(this instanceof FirepadUserList)) {
      return new FirepadUserList(ref, place, userId, displayName);
  }

  this.ref_ = ref;
  this.userId_ = userId;
  this.place_ = place;
  this.firebaseCallbacks_ = [];

  var self = this;
  this.hasName_ = !!displayName;
  this.displayName_ = displayName || 'Guest ' + Math.floor(Math.random() * 1000);
  this.firebaseOn_(ref.root.child('.info/connected'), 'value', function(s) {
      if (s.val() === true && self.displayName_) {
        var nameRef = ref.child(self.userId_).child('name');
        nameRef.onDisconnect().remove();
        nameRef.set(self.displayName_);
    }
});

  this.userList_ = this.makeUserList_()
  place.appendChild(this.userList_);
}

  // This is the primary "constructor" for symmetry with Firepad.
  FirepadUserList.fromDiv = FirepadUserList;

  FirepadUserList.prototype.dispose = function() {
    this.removeFirebaseCallbacks_();
    this.ref_.child(this.userId_).child('name').remove();

    this.place_.removeChild(this.userList_);
};

FirepadUserList.prototype.makeUserList_ = function() {
    return elt('div', [
      this.makeHeading_(),
      elt('div', [
        this.makeUserEntryForSelf_(),
        this.makeUserEntriesForOthers_()
        ], {'class': 'firepad-userlist-users' })
      ], {'class': 'firepad-userlist' });
};

FirepadUserList.prototype.makeHeading_ = function() {
    var counterSpan = elt('span', '0');
    this.firebaseOn_(this.ref_, 'value', function(usersSnapshot) {
      setTextContent(counterSpan, "" + usersSnapshot.numChildren());
  });

    return elt('div', [
      elt('span', 'ONLINE ('),
          counterSpan,
          elt('span', ')')
          ], { 'class': 'firepad-userlist-heading' });
};

FirepadUserList.prototype.makeUserEntryForSelf_ = function() {
    var myUserRef = this.ref_.child(this.userId_);

    var colorDiv = elt('div', null, { 'class': 'firepad-userlist-color-indicator' });
    this.firebaseOn_(myUserRef.child('color'), 'value', function(colorSnapshot) {
      var color = colorSnapshot.val();
      if (isValidColor(color)) {
        colorDiv.style.backgroundColor = color;
    }
});

    var nameInput = elt('p', null, { type: 'text', 'class': 'firepad-userlist-name-input'} );
    nameInput.innerHTML = this.displayName_;

    var nameHint = elt('div', 'ENTER YOUR NAME', { 'class': 'firepad-userlist-name-hint'} );
    /*if (this.hasName_)*/ nameHint.style.display = 'none';

    // Update Firebase when name changes.
    var self = this;
    on(nameInput, 'change', function(e) {
      var name = nameInput.value || "Guest " + Math.floor(Math.random() * 1000);
      myUserRef.child('name').onDisconnect().remove();
      myUserRef.child('name').set(name);
      nameHint.style.display = 'none';
      nameInput.blur();
      self.displayName_ = name;
      stopEvent(e);
  });

    var nameDiv = elt('div', [nameInput, nameHint]);

    return elt('div', [ colorDiv, nameDiv ], {
      'class': 'firepad-userlist-user ' + 'firepad-user-' + this.userId_
  });
};

FirepadUserList.prototype.makeUserEntriesForOthers_ = function() {
    var self = this;
    var userList = elt('div');
    var userId2Element = { };

    function updateChild(userSnapshot, prevChildName) {
      var userId = userSnapshot.key;
      var div = userId2Element[userId];
      if (div) {
        userList.removeChild(div);
        delete userId2Element[userId];
    }
    var name = userSnapshot.child('name').val();
    if (typeof name !== 'string') { name = 'Guest'; }
    name = name.substring(0, 20);

    var color = userSnapshot.child('color').val();
    if (!isValidColor(color)) {
        color = "#ffb"
    }

    var colorDiv = elt('div', null, { 'class': 'firepad-userlist-color-indicator' });
    colorDiv.style.backgroundColor = color;

    var nameDiv = elt('div', name || 'Guest', { 'class': 'firepad-userlist-name' });

    var userDiv = elt('div', [ colorDiv, nameDiv ], {
        'class': 'firepad-userlist-user ' + 'firepad-user-' + userId
    });
    userId2Element[userId] = userDiv;

    if (userId === self.userId_) {
        // HACK: We go ahead and insert ourself in the DOM, so we can easily order other users against it.
        // But don't show it.
        userDiv.style.display = 'none';
    }

    var nextElement =  prevChildName ? userId2Element[prevChildName].nextSibling : userList.firstChild;
    userList.insertBefore(userDiv, nextElement);
}

this.firebaseOn_(this.ref_, 'child_added', updateChild);
this.firebaseOn_(this.ref_, 'child_changed', updateChild);
this.firebaseOn_(this.ref_, 'child_moved', updateChild);
this.firebaseOn_(this.ref_, 'child_removed', function(removedSnapshot) {
  var userId = removedSnapshot.key;
  var div = userId2Element[userId];
  if (div) {
    userList.removeChild(div);
    delete userId2Element[userId];
}
});

return userList;
};

FirepadUserList.prototype.firebaseOn_ = function(ref, eventType, callback, context) {
    this.firebaseCallbacks_.push({ref: ref, eventType: eventType, callback: callback, context: context });
    ref.on(eventType, callback, context);
    return callback;
};

FirepadUserList.prototype.firebaseOff_ = function(ref, eventType, callback, context) {
    ref.off(eventType, callback, context);
    for(var i = 0; i < this.firebaseCallbacks_.length; i++) {
      var l = this.firebaseCallbacks_[i];
      if (l.ref === ref && l.eventType === eventType && l.callback === callback && l.context === context) {
        this.firebaseCallbacks_.splice(i, 1);
        break;
    }
}
};

FirepadUserList.prototype.removeFirebaseCallbacks_ = function() {
    for(var i = 0; i < this.firebaseCallbacks_.length; i++) {
      var l = this.firebaseCallbacks_[i];
      l.ref.off(l.eventType, l.callback, l.context);
  }
  this.firebaseCallbacks_ = [];
};

/** Assorted helpers */

function isValidColor(color) {
    return typeof color === 'string' &&
    (color.match(/^#[a-fA-F0-9]{3,6}$/) || color == 'transparent');
}


/** DOM helpers */
function elt(tag, content, attrs) {
    var e = document.createElement(tag);
    if (typeof content === "string") {
      setTextContent(e, content);
  } else if (content) {
      for (var i = 0; i < content.length; ++i) { e.appendChild(content[i]); }
  }
for(var attr in (attrs || { })) {
  e.setAttribute(attr, attrs[attr]);
}
return e;
}

function setTextContent(e, str) {
    e.innerHTML = "";
    e.appendChild(document.createTextNode(str));
}

function on(emitter, type, f) {
    if (emitter.addEventListener) {
      emitter.addEventListener(type, f, false);
  } else if (emitter.attachEvent) {
      emitter.attachEvent("on" + type, f);
  }
}

function off(emitter, type, f) {
    if (emitter.removeEventListener) {
      emitter.removeEventListener(type, f, false);
  } else if (emitter.detachEvent) {
      emitter.detachEvent("on" + type, f);
  }
}

function preventDefault(e) {
    if (e.preventDefault) {
      e.preventDefault();
  } else {
      e.returnValue = false;
  }
}

function stopPropagation(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
  } else {
      e.cancelBubble = true;
  }
}

function stopEvent(e) {
    preventDefault(e);
    stopPropagation(e);
}

return FirepadUserList;
})();


function getUniqname(email){
    console.log(email);
    return email.substring(0,email.indexOf('@'));
}
