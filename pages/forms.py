from django import forms
from .models import ContactMessage, Course


class ContactForm(forms.ModelForm):
    course_interest = forms.ModelChoiceField(
        queryset=Course.objects.filter(is_active=True),
        required=False,
        empty_label="Select a course"
    )

    class Meta:
        model = ContactMessage
        fields = [
            "full_name",
            "email",
            "phone",
            "course_interest",
            "message",
        ]

        widgets = {
            "full_name": forms.TextInput(attrs={
                "placeholder": "Full Name",
                "class": "h-10 w-full rounded-lg border border-[#E6E2F0] px-4 text-sm focus:border-[#6B4EFF] focus:ring-2 focus:ring-[#6B4EFF]/20 outline-none"
            }),
            "email": forms.EmailInput(attrs={
                "placeholder": "Email Id",
                "class": "h-10 w-full rounded-lg border border-[#E6E2F0] px-4 text-sm focus:border-[#6B4EFF] focus:ring-2 focus:ring-[#6B4EFF]/20 outline-none"
            }),
            "phone": forms.TextInput(attrs={
                "placeholder": "Phone No.",
                "class": "h-10 w-full rounded-lg border border-[#E6E2F0] px-4 text-sm"
            }),
            "course_interest": forms.Select(attrs={
                "class": "h-10 w-full rounded-lg border border-[#E6E2F0] px-4 text-sm focus:border-[#6B4EFF] focus:ring-2 focus:ring-[#6B4EFF]/20 outline-none"
            }),
            "message": forms.Textarea(attrs={
                "rows": 4,
                "placeholder": "Tell us about your goals and how we can help you.",
                "class": "w-full rounded-lg border border-[#E6E2F0] px-4 py-3 text-sm resize-none"
            }),
        }
