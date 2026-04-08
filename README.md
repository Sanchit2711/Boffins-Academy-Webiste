# Boffins Academy Website

A comprehensive Django-based website for Boffins Academy, featuring course management, interactive chat, gallery, placements, and more.

## Features

- **Courses Page**: Display available courses with detailed information, pricing, and enrollment options
- **Interactive Chat**: AI-powered chat system for student assistance
- **Gallery**: Showcase of academy activities and achievements
- **Placements**: Career placement information and success stories
- **About & Contact**: Information about the academy and contact details
- **Responsive Design**: Mobile-friendly interface with modern UI/UX

## Technologies Used

- **Backend**: Django (Python web framework)
- **Frontend**: HTML5, CSS3, JavaScript
- **Database**: SQLite3
- **Icons**: SVG icons
- **Fonts**: Manrope font family

## Installation & Setup

### Prerequisites

- Python 3.8 or higher
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/3000sagar/Boffins-Academy-Webiste.git
   cd Boffins-Academy-Webiste
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run database migrations**
   ```bash
   python manage.py migrate
   ```

5. **Collect static files** (for production)
   ```bash
   python manage.py collectstatic
   ```

6. **Run the development server**
   ```bash
   python manage.py runserver
   ```

7. **Access the website**
   
   Open your browser and go to `http://127.0.0.1:8000/`

## Project Structure

```
boffins_academy/
├── boffins_academy/          # Main Django project settings
├── chat/                     # Chat application
├── pages/                    # Pages application (courses, about, etc.)
├── static/                   # Static files (CSS, JS, images)
├── templates/                # HTML templates
├── media/                    # User-uploaded media files
├── db.sqlite3               # SQLite database
├── manage.py                # Django management script
└── requirements.txt         # Python dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.