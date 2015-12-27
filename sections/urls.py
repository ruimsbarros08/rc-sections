from django.conf.urls import patterns, url, include
from sections import views
from rest_framework.urlpatterns import format_suffix_patterns


urlpatterns = patterns('',
    url(r'^$', views.SectionsList.as_view(), name='section_list'),
    url(r'^(?P<pk>[0-9]+)/$', views.SectionsDetail.as_view(), name='section_detail'),
    url(r'^auth/', include('rest_framework.urls', namespace='rest_framework')),
)

urlpatterns = format_suffix_patterns(urlpatterns)