document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.querySelector('input[type="file"]');
    const form = document.querySelector('form');
    
    // Preview image before upload
    fileInput.addEventListener('change', function(e) {
      if (e.target.files.length > 0) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
          // Remove any existing preview
          const oldPreview = document.querySelector('.upload-preview');
          if (oldPreview) {
            oldPreview.remove();
          }
          
          // Create new preview
          const preview = document.createElement('div');
          preview.className = 'upload-preview';
          preview.innerHTML = `
            <h3>Selected Image Preview:</h3>
            <img src="${event.target.result}" alt="Preview" style="max-width: 300px;">
          `;
          
          form.insertBefore(preview, form.firstChild);
        };
        
        reader.readAsDataURL(file);
      }
    });
    
    // Show loading state during processing
    form.addEventListener('submit', function() {
      const button = form.querySelector('button');
      button.disabled = true;
      button.textContent = 'Processing...';
      
      // Add loading spinner
      const spinner = document.createElement('span');
      spinner.className = 'spinner';
      button.appendChild(spinner);
    });
  });