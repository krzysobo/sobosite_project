# from rest_framework.generics import ListAPIView
#
# from cms.models import CmsContentBranchTop
#
# # TODO FIXME!!! DEVELOP!!!
#
#
# class ContentViewTpl(ListAPIView):
#     """
#     queryset         - property
#     serializer_class - property
#     get_queryset()     - using queryset property
#     get_serializer_class() - using serializer_class property
#     get_serializer()  - using the get_serializer_class() method
#     >> ERGO: set the queryset and serializer_class on __init__ and all the rest (incl the above)  will work
#     ListModelMixin will work as well using this, and ListAPIView =   mixins.ListModelMixin and GenericAPIView
#
#
#     # .venv/lib/python3.9/site-packages/rest_framework/generics.py
#     """
#     def __init__(self, queryset, serializer_class, *args, **kwargs):
#         self.queryset = queryset
#         self.serializer_class = serializer_class
#         super().__init__(**kwargs)
#
