from rest_framework import serializers
from .models import Book, Entry


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = "__all__"


class EntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        exclude = ["photo"]