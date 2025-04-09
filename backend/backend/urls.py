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
from django.conf.urls import include
import user_forms.views as views_uf


path_prefix = "api/v1/"


urlpatterns = [
    path(path_prefix, include('user_forms.urls')),
]

# print("\nTOP: PATTERNS USERS", include('user_forms.urls'))
# print("\nTOP: PATTERNS ", urlpatterns,"\n\n")


# path('/api/v1/user/register/unregister', views_uf.xxx),            # DELETE 
#    path('admin/', admin.site.urls),   
