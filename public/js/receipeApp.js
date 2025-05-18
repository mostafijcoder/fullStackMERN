// public/js/recipeApp.js

$(document).ready(function () {
  const apiToken = window.apiToken || null; // Optional global variable

  // Load courses into modal
  $('#modal-button').on('click', function () {
    const $body = $('#coursesModal .modal-body');
    $body.html(`
      <div class="text-center py-3">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2">Loading courses…</p>
      </div>
    `);

    // Fetch courses
    $.get('/api/courses')
      .done(function (response) {
        $body.empty();
        const courses = response.data;

        if (!courses || !courses.length) {
          return $body.append('<p class="text-muted">No courses available at the moment.</p>');
        }

        // Render each course card
        courses.forEach(course => {
          const courseCard = `
            <div class="card mb-3 shadow-sm">
              <div class="card-body">
                <h5 class="card-title">${course.title}</h5>
                <p class="card-text">${course.description || 'No description provided.'}</p>
                <button 
                  class="btn ${course.joined ? 'btn-secondary' : 'btn-success'} join-button" 
                  data-id="${course._id}" 
                  ${course.joined ? 'disabled' : ''}
                  data-title="${course.title}">
                  ${course.joined ? 'Joined' : 'Join Course'}
                </button>
              </div>
            </div>
          `;
          $body.append(courseCard);
        });

        addJoinButtonListener();
      })
      .fail(function () {
        $body.html('<p class="text-danger">⚠ Failed to load courses. Please try again later.</p>');
      });
  });

  // Attach join logic
  function addJoinButtonListener() {
    $('.join-button').on('click', function () {
      const $button = $(this);
      const courseId = $button.data('id');
      const courseTitle = $button.data('title');

      $button.prop('disabled', true).text('Joining...');

      const joinUrl = `/api/courses/${courseId}/join${apiToken ? `?apiToken=${apiToken}` : ''}`;

      fetch(joinUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({})
      })
        .then(res => res.json())
        .then(response => {
          if (response.success) {
            $button
              .removeClass('btn-success join-button')
              .addClass('btn-secondary joined-button')
              .text('Joined');

            const $courseList = $('.course-list');
            if ($courseList.length && !$courseList.find(`li:contains("${courseTitle}")`).length) {
              $courseList.find('.no-courses').remove();
              $courseList.append(`<li>${courseTitle}</li>`);
            }
          } else if (response.message === 'User not logged in.' || response.message.includes('token')) {
            alert("Please log in to join the course.");
            window.location.href = "/users/login";
          } else {
            $button.prop('disabled', false).text('Try Again');
            alert(response.message || "Something went wrong.");
          }
        })
        .catch(() => {
          $button.prop('disabled', false).text('Failed to Join');
          alert("Join request failed.");
        });
    });
  }
});
