// Sublet Form

function goBack() {
  window.history.back();
}

//Preview Form 
function previewImage(event) {
  const preview = document.getElementById('imagePreview');
  const container = document.getElementById('previewContainer');
  const file = event.target.files[0];

  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      container.style.display = 'inline-block';
    };
    reader.readAsDataURL(file);
  } else {
    preview.src = '';
    container.style.display = 'none';
  }
}

// Remove Image

function removePreview() {
  const preview = document.getElementById('imagePreview');
  const container = document.getElementById('previewContainer');
  const input = document.getElementById('photo');

  preview.src = '';
  container.style.display = 'none';
  input.value = '';
}


// Submit form code

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  
  if (!form) {
    console.error("❌ No form element found in the DOM.");
    return;
  }

  form.addEventListener('submit', event => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(form);

    fetch('/submit-form', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        alert("🎉 Your submission was successful!");
        form.reset();
        window.location.href = "/Home_page.html"; // Make sure this exists locally
      } else {
        alert("⚠️ Submission failed. Please try again.");
        console.error("⚠️ Server responded with status:", response.status);
      }
    })
    .catch(error => {
      console.error("❌ Error submitting form:", error);
      alert("❌ Something went wrong.");
    });
  });
});




/*
document.querySelectorAll('input[type="radio"]').forEach(radio => {
  radio.addEventListener('mousedown', function (e) {
    if (this.checked) {
      this.wasChecked = true;
    } else {
      this.wasChecked = false;
    }
  });

  radio.addEventListener('click', function (e) {
    if (this.wasChecked) {
      this.checked = false;
    }
  });
});
*/