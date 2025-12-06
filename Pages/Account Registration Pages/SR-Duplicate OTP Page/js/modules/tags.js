// Tags Management
const tagsContainer = document.querySelector('.tags-container');
const selectedCount = document.querySelector('.selected-count');

function renderTags(tags) {
    tagsContainer.innerHTML = '';

    if (!tags || tags.length === 0) {
        tagsContainer.innerHTML = '<p>No tags available for this course.</p>';
        return;
    }

    tags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tagElement.addEventListener('click', () => toggleTag(tag, tagElement));
        tagsContainer.appendChild(tagElement);
    });
}

function toggleTag(tag, element) {
    const index = selectedTags.indexOf(tag);

    if (index > -1) {
        selectedTags.splice(index, 1);
        element.classList.remove('chosen');
    } else {
        if (selectedTags.length < maxSelection) {
            selectedTags.push(tag);
            element.classList.add('chosen');
        } else {
            selectedCount.classList.add("shake");
            setTimeout(() => {
                selectedCount.classList.remove("shake");
            }, 500);
        }
    }
    updateSelectedCount();
}

function updateSelectedCount() {
    selectedCount.textContent = `Selected: ${selectedTags.length}/${maxSelection}`;
}

function updateTagsForSelectedCourse() {
    const courseInput = document.querySelector('#course-input');
    const selectedCourse = courseInput.value.trim();

    // Clear previous selection when course changes
    selectedTags = [];
    updateSelectedCount();

    if (courseTagsData[selectedCourse]) {
        renderTags(courseTagsData[selectedCourse]);
    } else {
        renderTags([]); // Or handle default/fallback tags
    }
}
