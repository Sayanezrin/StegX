from flask import Flask, render_template, request, jsonify, send_file
import firebase_admin
from encode import hide_data
from decode import decode_data
from flask import redirect, url_for
from firebase_admin import credentials,auth

app = Flask(__name__, template_folder='templates')

# Initialize Firebase
cred = credentials.Certificate('credentials.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://stegx-148c0-default-rtdb.firebaseio.com/',
    'databaseAuthVariableOverride': {
        'uid': 'firebase-adminsdk-wyv01@stegx-148c0.iam.gserviceaccount.com'
    }
})

# Route for the home page
@app.route('/')
def index():
    return render_template('index_main.html')  
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        try:
            user = auth.sign_in_with_email_and_password(email, password)
            return redirect(url_for('home'))  # Redirect to home page after successful login
        except Exception as e:
            print(f"Error logging in: {e}")
            return "Error logging in"
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        try:
            user = auth.create_user(email=email, password=password)
            return redirect(url_for('login'))  # Redirect to login page after successful signup
        except Exception as e:
            print(f"Error creating user: {e}")
            return "Error creating user"
    return render_template('signup.html')

# Route for encoding (hide message in image)
@app.route('/encode', methods=['POST'])
def encode():
    try:
        image_file = request.files['image']
        key_input = request.form['key']
        message = request.form['message']

        image_path = "static/images/uploaded_image.png"
        image_file.save(image_path)

        stego_image_path = hide_data(image_path, message, key_input.encode('utf-8'))

        return send_file(stego_image_path, as_attachment=True)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
   

# Route for decoding (extract message from image)
@app.route('/decode', methods=['POST'])
def decode():
    try:
        image_file = request.files['image']
        key = request.form['key']

        image_path = "static/images/downloaded_image.png"
        image_file.save(image_path)

        decoded_message = decode_data(image_path, key.encode('utf-8'))
        return jsonify({'message': decoded_message}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/home')
def home():
    return render_template('index_main.html')

if __name__ == '__main__':
    app.run(debug=True)
