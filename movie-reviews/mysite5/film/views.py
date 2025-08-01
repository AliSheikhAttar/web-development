from django.shortcuts import render
from .models import Movie
from django.db.models import Q, query
from django.views.generic import ListView

def get_movies(request):
    context = {}
    context['movies'] = Movie.objects.all()
    return render(request, 'film/get_movies.html', context)


def add_movie(request):
    if request.method == "POST":
        dta = request.POST
        Movie.objects.create(name = dta['name'], director = dta['director'], description = dta['description'], Score=dta['Score'], username = dta['username'])
        return render(request, 'film/done.html')
    elif request.method == "GET":
        return render(request, 'film/list.html')

def search_movies(request):
    data = Movie.objects.all()
    if 'q' in request.GET:
        q = request.GET['q']
        data = Movie.objects.filter(name__icontains=q)
    return render(request,'film/search_result.html',{'data': data})
