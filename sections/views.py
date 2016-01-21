from rest_framework import status
from rest_framework.decorators import api_view
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from sections.models import Section
from sections.serializers import SectionSerializer, UserSerializer
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework import permissions
from sections.permissions import IsOwnerOrReadOnly
import requests
import json


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class SectionsList(APIView):
    """
    List all sections, or create a new section.
    """
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)

    def get(self, request, format=None):
        # sections = Section.objects.filter(owner=request.user)
        sections = Section.objects.all()
        serializer = SectionSerializer(sections, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = SectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data['owner'] = request.user
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # def perform_create(self, serializer):
    #     serializer.save(owner=self.request.user)

class SectionsDetail(APIView):
    """
    Retrieve, update or delete a section.
    """
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)

    def get_object(self, pk):
        try:
            return Section.objects.get(pk=pk)
        except Section.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        section = self.get_object(pk)
        serializer = SectionSerializer(section)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        section = self.get_object(pk)
        # for e in request.data['actions']['uls']:
        #     e['safe'] = "OK"

        r = requests.post("http://openg.fe.up.pt/rcsections", data=request.data)
        #request.data['actions'] = json.loads(r.json())
        print r.text

        serializer = SectionSerializer(section, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        section = self.get_object(pk)
        section.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


