from django.db import models


class Movie(models.Model):
    name = models.CharField(max_length=128)
    director = models.CharField(max_length=128)
    description = models.TextField()
    Score = models.FloatField(max_length=10)
    username = models.CharField(max_length=15)
    def __str__(self) -> str:
        return self.name
