// public/js/recipeApp.js
$(document).ready(function () {
    $('#modal-button').on('click', function () {
      const $body = $('#coursesModal .modal-body');
      $body.html('<p>Loading courses…</p>');
  
      $.get('/api/courses')
        .done(function (response) {
          $body.empty();
  
          const courses = response.data;
  
          if (!courses.length) {
            return $body.append('<p>No courses available at the moment.</p>');
          }
  
          courses.forEach(course => {
            $body.append(`
              <div class="card mb-3">
                <div class="card-body">
                  <h5 class="card-title">${course.title}</h5>
                  <p class="card-text">${course.description}</p>
                  <button 
                    class="btn btn-success join-button" 
                    data-id="${course._id}">
                    Join Course
                  </button>
                </div>
              </div>
            `);
          });
  
          addJoinButtonListener();
        })
        .fail(function () {
          $body.html('<p class="text-danger">Failed to load courses.</p>');
        });
    });
  
    function addJoinButtonListener() {
      $('.join-button').on('click', function () {
        const button = $(this);
        const courseId = button.data('id');
  
        fetch(`/api/courses/${courseId}/join`, {
          method: 'POST',
          credentials: 'include', // important for session cookie
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({}) // you can leave it empty if only using params
        })
          .then(res => res.json())
          .then(response => {
            if (response.success) {
              button
                .removeClass('join-button btn-success')
                .addClass('joined-button btn-secondary')
                .text('Joined')
                .prop('disabled', true);
            } else if (response.message === 'User not logged in.') {
              alert("Please log in to join the course.");
              window.location.href = "/users/login";
            } else {
              button.text('Try again');
            }
          })
          .catch(() => {
            button.text('Failed to join');
          });
      });
    }
  });
  
      