"""mysite5 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from film.views import get_movies, add_movie, search_movies
from .views import homepage_view

urlpatterns = [
    path('', homepage_view),
    path('get_movies/', get_movies),
    path('admin/', admin.site.urls),
    path('add_movie/', add_movie),
    path('search_movies/', search_movies),
] 
