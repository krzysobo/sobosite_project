import datetime as dt
import pytz
from django.http import Http404, JsonResponse
from django.shortcuts import render
from django.core.exceptions import PermissionDenied, BadRequest
# from django.contrib.auth import get_user_model, update_session_auth_hash
# from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, exceptions as drf_exceptions
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ValidationError
import datetime as dt
import user_forms.perms as perms 
import user_forms.serializers as sers
import user_forms.models as models
import user_forms.utils as utils 
from .exceptions import Conflict409Exception


def xxx():   # just for testing
    return {"hello": "world"}


# ------------------------------------- views -----------------------------------


class Login(APIView):
    """
    """
    permission_classes = []

    def post(self, request, format=None):
        print("aaaaaaa")
        ser = sers.LoginSerializer(data=request.data)
        ser.is_valid(raise_exception=True)


        token, user = utils.UserFormsAuth.generate_token_for_login_data(
            username=ser.validated_data['email'], password=ser.validated_data['password'])
        if token and user:
            res = {
                "id": user.id,
                "status": user.status,
                "email": ser.validated_data['email'],
                "token": token.key,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "is_staff": user.is_staff,
            }
            print("\n\nRES::: ", res, "aaaaa\n\n")
            return Response(res, status=200)

        return Response({}, status=403)
    

class Logout(APIView):
    permission_classes = [perms.PermIsAuth]
    def post(self, request, format=None):
        utils.UserFormsAuth.log_out(request)
        
        return Response({}, 200)


class ProfileOwn(APIView):
    permission_classes = [perms.PermIsAuth]

    def get_object_or_not_found(self):
        return self.request.user

    def get(self, request, format=None):
        obj = self.get_object_or_not_found()
        return Response(sers.UserSerializerForUserPanelsReadOnly(obj).data)

    def put(self, request, format=None):
        ser = utils.ProfileUtils.update_profile(request.user, request.data)
        # print(" REQUEST USER NOW ", request.user, request.user.email, request.user.first_name, request.user.last_name, 
        #     request.user.role, request.user.status, request.user.is_staff)
        return Response(ser.data)
    

class ProfileOwnChangePassword(APIView):
    permission_classes = [perms.PermIsAuth]

    def post(self, request, format=None):
        utils.ProfileUtils.change_password(request.user, request.data)
        return Response({})
   

class Register(APIView):
    permission_classes=[]
    
    def post(self, request, format=None):
        user = utils.UserFormsRegister.register(self.request.data)
        return Response({"email": user.email, "first_name": user.first_name, "last_name": user.last_name})

    
class RegisterConfirm(APIView):
    permission_classes = []

    def get(self, request, email, token, format=None):
        """ confirm - "get" because we usually use a link from email """
        utils.UserFormsRegister.register_confirm(email, token)
        return Response({})


class ResetPassword(APIView):
    permission_classes = []

    def post(self, request, format=None):
        """ send request"""
        try:
            utils.ResetPasswordUtils.reset_password(request.user, request.data)
        except(PermissionDenied):  # security measure to prevent non-users from checking, who is registered here
            pass 

        return Response({})
 

class ResetPasswordConfirm(APIView):
    permission_classes = []

    def post(self, request, email, token, format=None):
        utils.ResetPasswordUtils.reset_password_confirm(request.user, request.data, email, token)
        return Response({})
