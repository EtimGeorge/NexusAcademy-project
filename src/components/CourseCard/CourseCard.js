// /src/components/CourseCard/CourseCard.js

    /**
     * Creates the HTML element for a single course card.
     * @param {object} courseData - An object containing course details (id, title, description, thumbnailURL).
     * @returns {HTMLElement} The fully constructed course card element.
     */
    export function createCourseCard(courseData) {
      const cardElement = document.createElement('div');
      cardElement.className = 'course-card';

      // The entire card is a link to the course player page (which we will build later).
      cardElement.innerHTML = `
        <a href="/#/course/${courseData.id}">
          <img src="${courseData.thumbnailURL || 'https://via.placeholder.com/400x225'}" alt="${courseData.title}" class="course-card-image">
          <div class="course-card-content">
            <h3 class="course-card-title">${courseData.title}</h3>
            <p class="course-card-description">${courseData.description}</p>
          </div>
        </a>
      `;
      return cardElement;
    }