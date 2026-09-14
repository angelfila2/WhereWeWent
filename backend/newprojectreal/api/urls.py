from django.urls import path
from .views import book_detail, create_entry, entry_detail, get_books,create_book, get_entry_photo, getEntries

urlpatterns = [
    path('books/', get_books, name='get_books'),
     path('books/create/', create_book, name='create_book'),
     path('books/<int:pk>/', book_detail, name='book_detail'),
     
    path("entries/", getEntries,name="getEntries"),
    path("entries/create/", create_entry, name="createEntry"),
    path("entries/<int:pk>/photo/", get_entry_photo, name="getEntryPhoto"),
    path(
    "entries/<int:pk>/",
    entry_detail,
    name="entryDetail"
),
]