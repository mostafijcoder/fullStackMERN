// public/js/recipeApp.js
$(document).ready(function() {
    $('#modal-button').on('click', function() {
      const $body = $('#coursesModal .modal-body');
      $body.html('<p>Loading courses…</p>');
  
      $.get('/courses?format=json')
        .done(function(courses) {
          $body.empty();
          if (!courses.length) {
            return $body.append('<p>No courses available at the moment.</p>');
          }
          courses.forEach(course => {
            $body.append(`
              <div class="card mb-3">
                <div class="card-body">
                  <h5 class="card-title">${course.title}</h5>
                  <p class="card-text">${course.description}</p>
                  <!-- Join button: opens enrollment form with course pre-selected -->
                  <a 
                    href="/enroll?courseId=${course._id}" 
                    class="btn btn-success"
                  >
                    Join Course
                  </a>
                </div>
              </div>
            `);
          });
        })
        .fail(function() {
          $body.html('<p class="text-danger">Failed to load courses.</p>');
        });
    });
  });
  