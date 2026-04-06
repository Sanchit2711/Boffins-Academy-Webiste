from django.shortcuts import render, redirect
from django.views.decorators.http import require_http_methods
from django.contrib import messages

from .forms import ContactForm
from .models import Courses, GalleryImage, Placement, Company


# ---------- STATIC PAGES ----------

def home(request):
    placements = Placement.objects.filter(is_active=True)[:6]

    testimonials = []
    for p in placements:
        name = p.name or ""
        parts = [part for part in name.split() if part]
        initials = "".join(part[0].upper() for part in parts[:2]) or "BA"

        testimonials.append({
            "image": p.avatar.url if p.avatar else None,
            "initials": initials,
            "quote": p.testimonial or "Great learning experience at Boffins Academy.",
            "name": p.name,
            "role": p.company,
            "course": p.course,
            "salary": p.package_lpa,
        })

    return render(
        request,
        "pages/home.html",
        {
            "hero": {
                "trust_text": "Trusted by 15,000+ Students • 10 Years of Excellence",
                "headline_top": "Transform Your Career With",
                "headline_highlight": "Industry-Ready Tech Skills",
                "subtext": (
                    "Master Data Science, Full Stack Development, Cloud & DevOps, "
                    "or Digital Marketing through hands-on training, build a professional "
                    "portfolio, and land your dream job."
                ),
                "primary_cta": "Explore Courses",
                "secondary_cta": "Get Free Counselling",
            },
            "testimonials": testimonials,
        },
    )

def gallery(request):
    images = GalleryImage.objects.filter(is_active=True)

    return render(request, "pages/gallery.html", {
        "images": images
    })


def about(request):
    return render(request, "pages/about.html")



def courses(request):
    courses = (
        Courses.objects
        .filter(is_active=True)
        .select_related(
            "salary",
            "batch",
            "certificate",
            "cta",
        )
        .prefetch_related(
            "curriculum",
            "technologies",
            "projects",
            "career_roles",
        )
        .order_by("order")
    )

    return render(
        request,
        "pages/courses.html",
        {
            "courses": courses
        }
    )



def instructors(request):
    return render(request, "pages/instructors.html")

def placements(request):
    placements = Placement.objects.filter(is_active=True)
    companies = Company.objects.filter(is_active=True)

    return render(
        request,
        "pages/placements.html",
        {
            "placements": placements,
            "companies": companies,
        }
    )


# ---------- CONTACT PAGE ----------

@require_http_methods(["GET", "POST"])
def contact(request):
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()

            messages.success(
                request,
                "Message sent successfully. We’ll contact you soon."
            )

            # IMPORTANT: redirect WITHOUT query params
            return redirect("contact")
    else:
        form = ContactForm()

    context = {
        "form": form,

        # LEFT INFO CARDS
        "phone_lines": [
            "+91 1122334455",
            "+91 1122334455",
        ],
        "email_lines": [
            "info@boffinsacademy.com",
            "admissions@boffinsacademy.com",
        ],
        "location_lines": [
            "IT Park, Nagpur, Maharashtra",
            "Postal Code – 440022",
        ],
        "hours_lines": [
            "Mon–Fri: 9:00 AM – 7:00 PM",
            "Sat: 10:00 AM – 5:00 PM",
        ],
    }

    return render(request, "pages/contact.html", context)
