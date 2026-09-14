from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Book(models.Model):
    title = models.CharField(max_length=200)
    release_year = models.IntegerField()

    def __str__(self):
        return self.title


class Entry(models.Model):
    placeName = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    timeWeWent = models.DateTimeField()

    foodScore = models.IntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(10)
        ]
    )

    priceScore = models.IntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(10)
        ]
    )

    notes = models.TextField(blank=True)

    # Actual image bytes
    photo = models.BinaryField(
        blank=True,
        null=True
    )

    # e.g. image/jpeg or image/png
    photoType = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.placeName