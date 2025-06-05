"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
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

Sample CURL call:
    ### Sample CURL call 
    curl -X POST -H 'Content-Type: application/json' -d '{"email": "aaa@example.com", "password":"bbb"}'  http://localhost:8000/api/v1/user/login

"""
# from django.contrib import admin
import os
from django.urls import path
import user_forms.views as views_uf
import user_forms.admin_views as views_ad


urlpatterns = [
    # --- server info ---
    path('info/', views_uf.ServerInfo.as_view()),

    # --- for all users ---
    path('user_forms/user/login/', views_uf.Login.as_view()),
    path('user_forms/user/logout/', views_uf.Logout.as_view()),
    path('user_forms/user/profile/own/', views_uf.ProfileOwn.as_view()),
    path('user_forms/user/profile/own/update/', views_uf.ProfileOwn.as_view()),
    path('user_forms/user/profile/own/change-password/', views_uf.ProfileOwnChangePassword.as_view()),
    path('user_forms/user/register/create/', views_uf.Register.as_view()),
    path('user_forms/user/register/confirm/<str:email>/<str:token>/', views_uf.RegisterConfirm.as_view()),
    path('user_forms/user/reset-password/send-request/', views_uf.ResetPassword.as_view()),
    path('user_forms/user/reset-password/confirm/<str:email>/<str:token>/', views_uf.ResetPasswordConfirm.as_view()),

    # --- for admins only ---
    path('user_forms/admin/user/create/', views_ad.AdminUserOpsCreate.as_view()),
    # update and delete:
    path('user_forms/admin/user/id/<str:id>/', views_ad.AdminUserOps.as_view()),
    # fetch:
    path('user_forms/admin/user/', views_ad.AdminUserList.as_view()),
]
