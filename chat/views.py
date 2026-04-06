import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .services.handler import handle_message

@csrf_exempt
@require_POST
def chat_api(request):
    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    response = handle_message(
        session_id=data.get("session_id"),
        message=data.get("message", "")
    )

    return JsonResponse(response)
