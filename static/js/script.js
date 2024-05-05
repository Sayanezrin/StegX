 // Function to handle the 'Encode' button click event
document.getElementById('encodeSubmit').addEventListener('click', async () => {
    // Retrieve input values (image file, key, message)
    const imageFile = document.getElementById('encodeImage').files[0];
    const key = document.getElementById('encodeKey').value;
    const message = document.getElementById('message').value;

    // Create FormData object to send form data via POST request
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('key', key);
    formData.append('message', message);

    try {
        // Send POST request to '/encode' endpoint
        const response = await fetch('/encode', {
            method: 'POST',
            body: formData
        });

        // Check if the response is successful (HTTP status 200-299)
        if (response.ok) {
            // Retrieve the response as a blob (encoded image)
            const blob = await response.blob();

            // Create a URL for the blob object
            const blobUrl = URL.createObjectURL(blob);

            // Create a link element to trigger the download
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'encoded_image.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Revoke the blob URL to free up memory
            URL.revokeObjectURL(blobUrl);
        } else {
            // Handle error response (e.g., display error message)
            console.error('Failed to encode and download stego image');
        }
    } catch (error) {
        // Handle fetch error (e.g., display error message)
        console.error('Error:', error);
    }
});

// Function to handle the 'Decode' button click event
document.getElementById('decodeSubmit').addEventListener('click', async () => {
    // Retrieve input values (image file, key)
    const imageFile = document.getElementById('decodeImage').files[0];
    const key = document.getElementById('decodeKey').value;

    // Create FormData object to send form data via POST request
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('key', key);

    try {
        // Send POST request to '/decode' endpoint
        const response = await fetch('/decode', {
            method: 'POST',
            body: formData
        });

        // Check if the response is successful (HTTP status 200-299)
        if (response.ok) {
            // Parse response JSON to get the decoded message
            const data = await response.json();
            const decodedMessage = data.message;

            // Display the decoded message (e.g., in a message box)
            const messageBox = document.getElementById('messageBox');
            messageBox.textContent = 'Decoded Message: ' + decodedMessage;
        } else {
            // Handle error response (e.g., display error message)
            const errorMessage = 'Failed to decode hidden message';
            const errorBox = document.getElementById('errorBox'); // Add an error box element to your HTML
            errorBox.textContent = errorMessage;
            console.error(errorMessage);
        }
    } catch (error) {
        // Handle fetch error (e.g., display error message)
        const errorMessage = 'Error: ' + error.message;
        const errorBox = document.getElementById('errorBox'); // Add an error box element to your HTML
        errorBox.textContent = errorMessage;
        console.error(errorMessage);
    }
});

const form = document.querySelector( 'form' );
const fullName = document.getElementById('name');
const email = document.getElementById('email');
const mess = document.getElementById('message');

function sendEmail(){
  const bodyMessage = `Name: ${fullName.value} <br> Email: ${email.value} <br> Message: ${mess.value}`;

  Email.send({
    Host : "smtp.elasticemail.com",
    Username : "stegx6466@gmail.com",
    Password : "FF421394491DAC8D81822B01C845004DBB54",
    To : 'stegx6466@gmail.com',
    From : 'stegx6466@gmail.com',
    Subject : "Enquiry",
    Body : bodyMessage
  }).then(
    message => {
      if (message == "OK"){
        Swal.fire({
            title: "Success!",
            text: "Message sent successfully!",
            icon: "success"
          });
      }
    }
  );
}

form.addEventListener("submit",(e) => {
  e.preventDefault();
  sendEmail();
});
