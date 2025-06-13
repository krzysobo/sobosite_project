# import logging
#
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
#
# log = logging.getLogger(__name__)
#
# # https://www.django-rest-framework.org/api-guide/generic-views/#genericapiview
#
#
# class ContentListTpl(GenericApiView):
#     pass
#
#
# # # @method_decorator(name='get', decorator=swagger_auto_schema(
# # #     operation_id='content_item_list_tpl',
# # #     operation_description="List content items",
# # #     tags=['content_item'],
# # #     responses={'200': PlaceSerializer(many=True)},
# # # ))
# # class ContentListTpl(ListAPIView, CoreAPIView):
# #     permission_classes = [IsAuthenticated]
# #     serializer_class = None   # content serializer from __init__
# #     model_class = None
# #     filter_backends = [DjangoFilterBackend, OrderingFilter]
# #     #filterset_class = VisitListFilter
# #     # ordering_fields = ['city', 'street', 'preferred_tod']
# #     # ordering = ['city']
# #     ordering_fields = []
# #     ordering = []
#
# #     def __init__(self, serializer_class, model_class):
# #         self.serializer_class = serializer_class
# #         self.model_class = model_class
#
# #     def get_queryset(self):
# #         return self.serializer_class.objects.all()
#
#
# # class ContentGetItemTpl(CoreAPIView):
# #     obj_name = None
# #     model = None
# #     serializer_class = None
# #     content_item = None
# #     permission_classes = [IsAuthenticated & (IsAdmin | IsGet)]
#
#
# #     def __init__(self, serializer_class, model_class):
# #         self.serializer_class = serializer_class
# #         self.model = model_class
#
# #     # @swagger_auto_schema(
# #     #     operation_id='content_item_get_tpl',
# #     #     tags=['content_item'],
# #     #     responses={'200': serializer_class()},
# #     # )
# #     def get(self, request, *args, **kwargs):
# #         self.get_object_or_not_found()
# #         return Response(self.serializer_class(self.content_item, context=self.get_serializer_context()).data)
#
#
