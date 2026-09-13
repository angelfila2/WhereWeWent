
#is actually to write all the endopoints here
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Book
from .serializer import BookSerializer

@api_view(['GET'])
def get_books(request):
    books = Book.objects.all()
    #if usinng an array of objects, more than 1 field, must put arg many=True
    serializedData = BookSerializer(books, many=True)
    return Response(serializedData.data)


@api_view(['POST'])
def create_book(request):
    data = request.data
    serializer = BookSerializer(data=data)
    if serializer.is_valid():   
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)                  
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

