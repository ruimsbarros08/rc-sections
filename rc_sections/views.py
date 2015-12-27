from django.shortcuts import render
from django.conf import settings

def index(request):
	if request.user.is_authenticated():
		return render(request, 'app.html', { 'version': settings.VERSION })
	else:
		return render(request, 'login.html', { 'version': settings.VERSION })

# def index2(request, pk):
# 	if request.user.is_authenticated():
# 		return render(request, 'app.html', { 'version': settings.VERSION })
# 	else:
# 		return render(request, 'login.html', { 'version': settings.VERSION })