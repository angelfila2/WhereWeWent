# All API endpoints are written here

from django.http import HttpResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Book, Entry
from .serializer import BookSerializer, EntrySerializer


# ============================================================
# ENTRY ENDPOINTS
# ============================================================

@api_view(["GET"])
def getEntries(request):

    entries = Entry.objects.all()

    # If serializing multiple objects, use many=True
    serializedData = EntrySerializer(entries, many=True)

    return Response(serializedData.data)


@api_view(["POST"])
def create_entry(request):

    # Copy the normal form data
    data = request.data.copy()

    # Get the uploaded photo if one was provided
    photo = request.FILES.get("photo")

    # We handle the binary photo ourselves instead of
    # passing it through the serializer
    data.pop("photo", None)

    serializer = EntrySerializer(data=data)

    if serializer.is_valid():

        if photo:
            entry = serializer.save(
                photo=photo.read(),
                photoType=photo.content_type
            )
        else:
            entry = serializer.save()

        return Response(
            EntrySerializer(entry).data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["GET"])
def get_entry_photo(request, pk):

    try:
        entry = Entry.objects.get(pk=pk)

    except Entry.DoesNotExist:
        return Response(
            {"error": "Entry not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    # Entry exists but doesn't have a photo
    if not entry.photo:
        return Response(
            {"error": "This entry has no photo"},
            status=status.HTTP_404_NOT_FOUND
        )

    # Return the actual image bytes stored inside SQLite
    return HttpResponse(
        bytes(entry.photo),
        content_type=entry.photoType or "image/jpeg"
    )
@api_view(["PUT", "DELETE"])
def entry_detail(request, pk):

    # Find the entry
    try:
        entry = Entry.objects.get(pk=pk)
    except Entry.DoesNotExist:
        return Response(
            {"error": "Entry not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    # ============================================================
    # DELETE ENTRY
    # ============================================================

    if request.method == "DELETE":

        entry.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )

    # ============================================================
    # UPDATE ENTRY
    # ============================================================

    elif request.method == "PUT":

        # Get data sent from React
        data = request.data.copy()

        # Photo is NOT editable
        data.pop("photo", None)
        data.pop("photoType", None)

        serializer = EntrySerializer(
            entry,
            data=data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

# ============================================================
# BOOK ENDPOINTS
# ============================================================

# Sample code for getting books
@api_view(["GET"])
def get_books(request):

    books = Book.objects.all()

    # If serializing multiple objects, use many=True
    serializedData = BookSerializer(books, many=True)

    return Response(serializedData.data)


# Sample code for creating a book
@api_view(["POST"])
def create_book(request):

    data = request.data

    serializer = BookSerializer(data=data)

    if serializer.is_valid():

        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["PUT", "DELETE"])
def book_detail(request, pk):

    try:
        book = Book.objects.get(pk=pk)

    except Book.DoesNotExist:
        return Response(
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == "DELETE":

        book.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )

    elif request.method == "PUT":

        data = request.data

        serializer = BookSerializer(
            book,
            data=data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )