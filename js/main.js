//Parse
// var APP_ID = 'u22TtFsvkg5G8xN5Mj5PspgC9fOlb5QuF0I1stZ2';
// var JS_KEY = 'O0GCKW2jAS6QYO1Uz70ye4AdjcmekKACrY6tgbEi';
// var REST_API_KEY = 'PjG4jj4Umo1CDgdiRmywp9gSXaAiPdcQj9dPzLyv';
var APP_ID = 'hecRBvHLn26dXkkLfUGxPIWUrbv7uJBJ8JVwwPs3';
var JS_KEY = 'QJzUYV2rrwffyIkbyamrfr7jDUwcZmPnEUVGEAEp';
var REST_API_KEY = 'lQ1lDvpKMsv5Vnvk24hmx5MkeVZe2iNl0gDiEmwj';
Parse.initialize(APP_ID, JS_KEY);

var signUp = function(user, callback, errorCallback) {
    Parse.Cloud.run('createUser', {
        newUser: user
    }, {
        success: function(result) {
            console.log(result);
            if (callback) {
                callback(result);
            }
        },
        error: function(error) {
            console.log(error);
            if (errorCallback) {
                errorCallback(error);
            }
        }
    });
};

//Client
//variables
var role = 'student';
var studentAvatar, tutorAvatar;

var levels, subjects, tutorSubjects, schools, locations;

//functions
var init = function() {
    //get levels
    var q = new Parse.Query(Parse.Object.extend('Levels'));
    q.find(function(results) {
        levels = results;
        $('select#student-level').append('<option value="">Select Level</option');
        $('.tt-teach-lvl').append('<option value="">Select Level</option');
        levels.forEach(function(level) {
            $('select#student-level').append('<option value="' + level.id + '">' + level.get('name') + '</option');
            $('.tt-teach-lvl').append('<option value="' + level.id + '">' + level.get('name') + '</option');
        });
    });
    //get locations
    var q2 = new Parse.Query(Parse.Object.extend('Locations'));
    q2.ascending('name')
    q2.find(function(results) {
        locations = results;
        $('select#student-location').append('<option value="">Select Location</option');
        $('select#tutor-location').append('<option value="">Select Location</option');
        locations.forEach(function(location) {
            $('select#student-location').append('<option value="' + location.id + '">' + location.get('name') + '</option');
            $('select#tutor-location').append('<option value="' + location.id + '">' + location.get('name') + '</option');
        });
    });
}

var previewAvatar = function(input, target) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $(target).attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
};

var uploadAvatar = function(file, callback) {
    if (!file) return callback();
    $('#message').append('<li>Uploading avatar ...</li>');

    var serverUrl = 'https://api.parse.com/1/files/' + file.name;

    $.ajax({
        type: "POST",
        beforeSend: function(request) {
            request.setRequestHeader("X-Parse-Application-Id", APP_ID);
            request.setRequestHeader("X-Parse-REST-API-Key", REST_API_KEY);
            request.setRequestHeader("Content-Type", file.type);
        },
        url: serverUrl,
        data: file,
        processData: false,
        contentType: false,
        success: function(data) {
            if (callback) {
                callback(data.url);
            }
        },
        error: function(data) {
            var obj = jQuery.parseJSON(data);
            alert(obj.error);
            if (callback) {
                callback();
            }
        }
    });

};

var createStudent = function() {
    console.log('student');
    var username = $('#student-username').val();
    var email = $('#student-email').val();
    var pwd = $('#student-pwd').val();
    var pwdConf = $('#student-pwdConf').val();
    var level = $('#student-level').val();
    var subject = [];
    var school = $('#student-school').val();
    var location = $('#student-location').val();

    $('#student-pref-subs select').each(function() {
        if ($(this).val()) {
            subject.push({
                id: $(this).val(),
                label: $(this).children(':selected').text(),
            });
        };
    })

    if (!(username && email && pwd && pwdConf && level && subject[0] && school && location)) {
        alert('Please fill in all required fields!');
        return;
    }

    if (pwd !== pwdConf) {
        alert('Password missmatch!');
        return;
    }

    console.log('Upload avatar');
    uploadAvatar(studentAvatar, function(avatarUrl) {
        var newStudent = {
            avatar: avatarUrl,
            name: username,
            email: email,
            pass: pwd,
            level: level,
            subject: subject,
            school: school,
            location: location,
            role: 1,
        }
        console.log(newStudent);
        $('#message').append('<li>Creating new Student account ...</li>');
        signUp(newStudent, function() {
            $('#message').append('<li>Success!</li>');
        }, function(err) {
            $('#message').append('<li>Failed: ' + err.message + '</li>');
        });
    });

};

var createTutor = function() {
    console.log('tutor');
    var username = $('#tutor-username').val();
    var email = $('#tutor-email').val();
    var pwd = $('#tutor-pwd').val();
    var pwdConf = $('#tutor-pwdConf').val();
    var tutor_center = $('#tutor-center').val();
    var qualification = $('#tutor-qualification').val();
    var subject = [];
    var location = $('#tutor-location').val();
    var quote = $('#tutor-quotes').val();
    var availabelTuition = $('#tutor-available').prop('checked');
    var phone = $('#tutor-phone').val();
    var website = $('#tutor-website').val();
    var tutorAddress = $('#tutor-address').val();
    $('.tt-teach-sub').each(function() {
        if ($(this).val()) {
            subject.push({
                id: $(this).val(),
                label: $(this).children(':selected').text(),
            });
        };
    });

    if (!(username && email && pwd && pwdConf && qualification && subject[0] && location && availabelTuition)) {
        alert('Please fill in all required fields!');
        return;
    }

    if (pwd !== pwdConf) {
        alert('Password missmatch!');
        return;
    }
    console.log('Upload avatar');
    uploadAvatar(tutorAvatar, function(avatarUrl) {
        var newTutor = {
            avatar: avatarUrl,
            name: username,
            email: email,
            pass: pwd,
            tutor_center: tutor_center,
            qualification: qualification,
            subject: subject,
            location: location,
            quote: quote,
            availabelTuition: availabelTuition,
            phone: phone,
            website: website,
            tutorAddress: tutorAddress,
            role: 2,
        }
        console.log(newTutor);
        $('#message').append('<li>Creating new Tutor account ...</li>');
        signUp(newTutor, function() {
            $('#message').append('<li>Success!</li>');
        }, function(err) {
            $('#message').append('<li>Failed: ' + err.message + '</li>');
        });
    });

};

//events
$(document).ready(function() {
    init();
});

$('#student-level').change(function() {
    var levelId = $(this).val();
    console.log(levelId);
    if (levelId) {
        var level = levels.find(function(l) {
            return l.id = levelId;
        });
        var mainLevel = level.get('main_level').id;
        console.log(mainLevel);

        //find subjects
        var query = new Parse.Query(Parse.Object.extend('Subjects'));
        query.equalTo('level', level);
        query.ascending('name');
        query.find({
            success: function(results) {
                console.log(results.length, 'subjects');
                // Do something with the returned Parse.Object values
                subjects = results;
                $('.st-pref-subs').each(function() {
                    var sl = $(this);
                    sl.empty().append('<option value="">Select Subject</option>');
                    subjects.forEach(function(subject) {
                        sl.append('<option value="' + subject.id + '">' + subject.get('name') + '</option>');
                    });
                });
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });

        //find schools
        var query2 = new Parse.Query(Parse.Object.extend('Schools'));
        query2.equalTo('main_levels', mainLevel);
        query2.ascending('name');
        query2.find({
            success: function(results) {
                console.log(results.length, 'schools');
                // Do something with the returned Parse.Object values
                schools = results;
                $('#student-school').empty().append('<option value="">Select School</option>');
                schools.forEach(function(school) {
                    $('#student-school').append('<option value="' + school.id + '">' + school.get('name') + '</option>');
                });
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });

    } else {
        $('.st-pref-subs').each(function() {
            var sl = $(this);
            sl.empty().append('<option value="">Select Subject</option>');
        });
        $('#student-school').empty().append('<option value="">Select School</option>');
    }
});

$('#tutor-sub-lvl').change(function() {
    var levelId = $(this).val();
    console.log(levelId);
    if (levelId) {
        var level = levels.find(function(l) {
            return l.id = levelId;
        });
        var mainLevel = level.get('main_level').id;
        console.log(mainLevel);

        //find subjects
        var query = new Parse.Query(Parse.Object.extend('Subjects'));
        query.equalTo('level', level);
        query.ascending('name');
        query.find({
            success: function(results) {
                console.log(results.length, 'subjects');
                var subSub = $('#tutor-sub-taught');

                subSub.append('<option value="">Select Subject</option>');
                results.forEach(function(subject) {
                    subSub.append('<option value="' + subject.id + '">' + subject.get('name') + '</option>');
                });

            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });
    } else {
        $('#tutor-sub-taught').empty();
    }
})

$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
    //show selected tab / active
    role = $(e.target).attr('aria-controls');
});

$('#btn-student-avatar').click(function(e) {
    e.preventDefault();
    $('#file-student-avatar').click();
});

$('#btn-remove-student-avatar').click(function() {
    studentAvatar = null;
    $('#student-avatar').attr('src', 'img/no-avatar.png');
});

$('#file-student-avatar').change(function(e) {
    var files = e.target.files || e.dataTransfer.files;
    studentAvatar = files[0];
    previewAvatar(this, '#student-avatar');
});

$('#btn-tutor-avatar').click(function(e) {
    e.preventDefault();
    $('#file-tutor-avatar').click();
});

$('#btn-remove-tutor-avatar').click(function() {
    tutorAvatar = null;
    $('#tutor-avatar').attr('src', 'img/no-avatar.png');
});

$('#file-tutor-avatar').change(function(e) {
    var files = e.target.files || e.dataTransfer.files;
    tutorAvatar = files[0];
    previewAvatar(this, '#tutor-avatar');
});

$('.student-add-subs').click(function() {
    var sub = $('<br><div class="input-group"><select class="form-control st-pref-subs"></select><span class="input-group-btn"><button type="button" class="btn btn-warning remove-sub"><span class="glyphicon glyphicon-minus"></span></button></span></div>');
    $(sub).find('select').append('<option value="">Select Subject</option>');
    subjects.forEach(function(subject) {
        $(sub).find('select').append('<option value="' + subject.id + '">' + subject.get('name') + '</option');
    });
    $(sub).find('.remove-sub').click(function(e) {
        e.preventDefault();
        $(sub).remove();
    });
    $('#student-pref-subs').append(sub);
});

$('.tutor-add-subs').click(function() {
    var sub = $('<br><div class="row"><div class="col-sm-4"><select class="form-control tt-teach-lvl"></select></div><div class="col-sm-7"><select class="form-control tt-teach-sub"></select></div><div class="col-sm-1"><button class="btn btn-warning remove-sub" type="button"><span class="glyphicon glyphicon-minus"></span></button></div></div>');
    var subLvl = $(sub).find('.tt-teach-lvl');
    subLvl.append('<option value="">Select Level</option>');
    levels.forEach(function(l) {
        subLvl.append('<option value="' + l.id + '">' + l.get('name') + '</option>');
    });
    subLvl.change(function() {
        var levelId = $(this).val();
        console.log(levelId);
        if (levelId) {
            var level = levels.find(function(l) {
                return l.id = levelId;
            });
            var mainLevel = level.get('main_level').id;
            console.log(mainLevel);

            //find subjects
            var query = new Parse.Query(Parse.Object.extend('Subjects'));
            query.equalTo('level', level);
            query.ascending('name');
            query.find({
                success: function(results) {
                    console.log(results.length, 'subjects');
                    var subSub = $(sub).find('.tt-teach-sub');

                    subSub.append('<option value="">Select Subject</option>');
                    results.forEach(function(subject) {
                        subSub.append('<option value="' + subject.id + '">' + subject.get('name') + '</option>');
                    });

                },
                error: function(error) {
                    console.log("Error: " + error.code + " " + error.message);
                }
            });
        } else {
            $(sub).find('.tt-teach-sub').empty();
        }
    })
    $(sub).find('.remove-sub').click(function(e) {
        e.preventDefault();
        $(sub).remove();
    })
    $('#tutor-teach-subs').append(sub);
});

$('#btn-reset').click(function() {
    $('form').each(function() {
        this.reset();
    });
    studentAvatar = tutorAvatar = null;
    $('#student-avatar').attr('src', 'img/no-avatar.png');
    $('#tutor-avatar').attr('src', 'img/no-avatar.png');
});

$('#btn-create').click(function() {
    $('#message').empty();
    if (role === 'student') {
        createStudent();
    } else if (role === 'tutor') {
        createTutor();
    }
})
