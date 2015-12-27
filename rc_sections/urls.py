"""rc_sections URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Import the include() function: from django.conf.urls import url, include
    3. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import url, include
from django.contrib import admin
from sections import urls as sections_urls
import views
from sections.views import UserList, UserDetail


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', views.index),
    url(r'^sections/', views.index, name="sections"),
    url(r'^sections/(?P<pk>[0-9]+)/', views.index, name="sections_detail"),
    url(r'^api/sections/', include(sections_urls)),
    url(r'^api/users/$', UserList.as_view()),
    url(r'^api/users/(?P<pk>[0-9]+)/$', UserDetail.as_view()),
    url('', include('django.contrib.auth.urls')),
    url('', include('social.apps.django_app.urls', namespace='social')),
]
