import logging

from rest_framework.generics import ListAPIView, GenericAPIView, RetrieveAPIView, CreateAPIView, UpdateAPIView, \
    DestroyAPIView
from rest_framework.mixins import RetrieveModelMixin

# from django.utils.decorators import method_decorator
# from django_filters.rest_framework import DjangoFilterBackend
# from drf_yasg.utils import swagger_auto_schema
# from rest_framework.filters import OrderingFilter
# from rest_framework.generics import ListAPIView
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response
#
# from web.core_view import CoreAPIView
# from web.models import Place
# from .serializers import PlaceSerializer, PlaceCreateSerializer
# from ..permissions import IsAdmin, IsGet

log = logging.getLogger(__name__)


# https://www.django-rest-framework.org/api-guide/generic-views/


class ContentItemView(RetrieveAPIView):
    def __init__(self, queryset, serializer_class, *args, **kwargs):
        self.queryset = queryset
        self.serializer_class = serializer_class
        super().__init__(**kwargs)


class ContentListView(ListAPIView):
    queryset = None
    serializer_class = None

    def __init__(self, queryset, serializer_class, *args, **kwargs):
        self.queryset = queryset
        self.serializer_class = serializer_class
        super().__init__(**kwargs)


    """
    queryset         - property
    serializer_class - property
    get_queryset()     - using queryset property
    get_serializer_class() - using serializer_class property
    get_serializer()  - using the get_serializer_class() method
    >> ERGO: set the queryset and serializer_class on __init__ and all the rest (incl the above)  will work
    ListModelMixin will work as well using this, and ListAPIView =   mixins.ListModelMixin and GenericAPIView
    """

    pass


class ContentItemCreate(CreateAPIView):
    def __init__(self, queryset, serializer_class, *args, **kwargs):
        self.queryset = queryset
        self.serializer_class = serializer_class
        super().__init__(**kwargs)


class ContentItemUpdate(UpdateAPIView):
    def __init__(self, queryset, serializer_class, *args, **kwargs):
        self.queryset = queryset
        self.serializer_class = serializer_class
        super().__init__(**kwargs)


class ContentItemDelete(DestroyAPIView):
    def __init__(self, queryset, serializer_class, *args, **kwargs):
        self.queryset = queryset
        self.serializer_class = serializer_class
        super().__init__(**kwargs)


# # --- Content Admin ----------------------------
# @method_decorator(name='post', decorator=swagger_auto_schema(
#     operation_id='place_create',
#     operation_description="Create place",
#     tags=['place'],
#     request_body=PlaceSerializer,
#     responses={'200': PlaceSerializer()},
# ))
# class ContentCreate(CoreAPIView):
#     permission_classes = [IsAuthenticated & IsAdmin]
# 
#     def post(self, request, *args, **kwargs):
#         print("\n\n PLACE CREATE - REQUEST DATA ", request.data);
#         ser = PlaceCreateSerializer(data=request.data)
#         ser.is_valid(raise_exception=True)
#         print("\n\n PLACE CREATE - SER DATA V ", ser.validated_data);
#         place = ser.save()
#         print("\n\n PLACE CREATE - SER DATA 22q22222 ", ser.validated_data);
#         return Response(PlaceSerializer(place, context=self.get_serializer_context()).data)
# 
# 
# class ContentManip(CoreAPIView):
#     obj_name = 'place'
#     model = Place
#     permission_classes = [IsAuthenticated & (IsAdmin | IsGet)]
# 
#     @swagger_auto_schema(
#         operation_id='place_read',
#         tags=['place'],
#         responses={'200': PlaceSerializer()},
#     )
#     def get(self, request, *args, **kwargs):
#         self.get_object_or_not_found()
#         return Response(PlaceSerializer(self.place, context=self.get_serializer_context()).data)
# 
#     @swagger_auto_schema(
#         operation_id='place_update',
#         tags=['place'],
#         request_body=PlaceSerializer,
#         responses={'200': PlaceSerializer()},
#     )
#     def put(self, request, *args, **kwargs):
#         self.get_object_or_not_found()
#         ser = PlaceSerializer(self.place, data=request.data, partial=True,
#                              context=self.get_serializer_context())
#         ser.is_valid(raise_exception=True)
#         instance = ser.save()
#         return Response(PlaceSerializer(instance, context=self.get_serializer_context()).data)
# 
#     @swagger_auto_schema(
#         operation_id='place_delete',
#         tags=['place'],
#         responses={'200': '{}'},
#     )
#     def delete(self, request, *args, **kwargs):
#         self.get_object_or_not_found()
#         self.place.delete()
#         return Response({})
