from rest_framework import serializers
from sections.models import Section
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    sections = serializers.PrimaryKeyRelatedField(many=True, queryset=Section.objects.all())

    class Meta:
        model = User



class SectionSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        model = Section
        # fields = ('id', 'created', 'modified', 'title', 'description')
