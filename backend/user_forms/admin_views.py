
from django.http import Http404
from django.core.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, CreateAPIView, GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.filters import OrderingFilter

import user_forms.perms as perms
import user_forms.serializers as sers  
import user_forms.models as models


class AdminUserList(ListAPIView, APIView):
    permission_classes = [perms.PermIsAuth & perms.PermIsAdmin]
    serializer_class = sers.UserSerializerForAdminPanels
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['role']
    ordering_fields = ['email', 'first_name', 'last_name']
    ordering = ['email']

    def get_queryset(self):
        return models.User.objects.all()
    
    def list(self, request, *args, **kwargs):
        resp = super(AdminUserList, self).list(request, *args, **kwargs)
        return Response({"data": resp.data})


class AdminUserOpsCreate(APIView):
    permission_classes = [perms.PermIsAuth & perms.PermIsAdmin]    
    def post(self, request, format=None):
        ser = sers.CreateUserSerializerForAdminPanels(data=request.data)
        ser.is_valid(raise_exception=True)
        # return Response(ser.data)
        instance = ser.save()
        instance.set_password(ser.validated_data['password'])
        instance.save()
        return Response(sers.UserSerializerForAdminPanels(instance).data)


class AdminUserOps(APIView):
    permission_classes = [perms.PermIsAuth & perms.PermIsAdmin]
    def _get_user_or_404(self, id):
        try:
            user = models.User.objects.get(id=id)
            return user
        except(models.User.DoesNotExist):
            raise Http404()
        
    # GET /api/v1/admin/user/id/:id 	(get one by id)
    def get(self, request, id):
        user = self._get_user_or_404(id)
        return Response(sers.UserSerializerForAdminPanels(user).data)

    # PUT /api/v1/admin/user/id/:id	(update)
    def put(self, request, id):
        user = self._get_user_or_404(id)
        ser = sers.UserSerializerForAdminPanels(user, 
                data=request.data, partial=True, context={"user": user})
        ser.is_valid(raise_exception=True)
        instance = ser.save()
        return Response(sers.UserSerializerForAdminPanels(instance).data)

    # DELETE /api/v1/admin/user/id/:id	(delete)
    def delete(self, request, id, format=None):
        user = self._get_user_or_404(id)

        if user.id == request.user.id:  # you can't delete your own account in admin panel!
            raise PermissionDenied()
        
        user.delete()
        return Response({})
